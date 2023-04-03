import nock from "nock";
import { ComparisonEnum } from "../src/index";
import { SfmcHelper } from "../src/sfmc-ts";
import { SfmcQueryBuilder } from "../src/utils/query-builder";
import { apiConfig, authResponse, authRequestBody } from "./mock-data";
import { SfmcDataExtensionSoap } from "../src/utils/soap/soap-client";

describe("SfmcHelper", () => {
  nock.disableNetConnect();

  afterEach(nock.cleanAll);
  afterAll(nock.restore);

  nock(apiConfig.authEndpoint)
    .persist()
    .post("/v2/token", JSON.stringify(authRequestBody))
    .reply(200, authResponse);

  const helper = SfmcHelper.initialize(apiConfig) as SfmcHelper;

  it("should initialize the SfmcHelper class", () => {
    if (!helper) {
      throw new Error("Failed to initialize SfmcHelper");
    }
  });

  it("shoud check the SfmcHelper config", () => {
    expect(helper.getConfig().clientId).toBe(apiConfig.clientId);
  });

  it("should authenticate with the Salesforce Marketing Cloud API", async () => {
    nock(apiConfig.authEndpoint)
      .persist()
      .post("/v2/token", JSON.stringify(authRequestBody))
      .reply(200, authResponse);

    await helper.authenticate();

    if (!helper) {
      throw new Error("Failed to initialize SfmcHelper");
    }
    if (helper.getConfig().clientId !== apiConfig.clientId) {
      throw new Error("Failed to check SfmcHelper config");
    }
    expect(helper.isAuthenticated()).toBe(true);
  });

  const objectKey = "test_data_extension_key";
  const queryBuilder = SfmcQueryBuilder.create(helper, objectKey);

  it("should fetch rows from the data extension without filters", async () => {
    const rowsetResponse = {
      items: [
        {
          values: {
            test_column_1: "value_1",
            test_column_2: "value_2",
          },
        },
        {
          values: {
            test_column_1: "value_3",
            test_column_2: "value_4",
          },
        },
      ],
    };

    nock(apiConfig.restEndpoint)
      .get(`/data/v1/customobjectdata/key/${objectKey}/rowset`)
      .reply(200, rowsetResponse);

    const result = await queryBuilder.get();
    expect(result).toEqual(rowsetResponse.items.map((item) => item.values));
  });

  it("should fetch rows from the data extension with filters", async () => {
    const columnName = "test_column_1";
    const operator = ComparisonEnum.Equal;
    const value = "value_1";
    const rowsetResponse = {
      items: [
        {
          values: {
            test_column_1: "value_1",
            test_column_2: "value_2",
          },
        },
      ],
    };

    nock(apiConfig.restEndpoint)
      .get(
        `/data/v1/customobjectdata/key/${objectKey}/rowset?$filter=${columnName} ${operator} '${encodeURIComponent(
          value
        )}'`
      )
      .reply(200, rowsetResponse);

    const result = await queryBuilder
      .get()
      .where("test_column_1", "eq", "value_1");
    expect(result).toEqual(rowsetResponse.items.map((item) => item.values));
  });

  it("should handle failed API requests", async () => {
    const dataExtension = "test_data_extension_key";
    const errorMessage = "Failed to fetch filtered rows: Internal Server Error";

    nock(apiConfig.restEndpoint)
      .get(`/data/v1/customobjectdata/key/${dataExtension}/rowset`)
      .reply(500, { error: "Internal Server Error" });

    await expect(helper.dataExtension(dataExtension).get()).rejects.toThrow(
      errorMessage
    );
  });

  it("should handle no rows matching the filters", async () => {
    const dataExtension = "test_data_extension_key";
    const columnName = "test_column_1";
    const operator = ComparisonEnum.Equal;
    const value = "non_existent_value";

    const rowsetResponse = {
      items: [],
    };

    nock(apiConfig.restEndpoint)
      .get(
        `/data/v1/customobjectdata/key/${dataExtension}/rowset?$filter=${columnName} ${operator} '${encodeURIComponent(
          value
        )}'`
      )
      .reply(200, rowsetResponse);

    const result = await helper
      .dataExtension(dataExtension)
      .get()
      .where(columnName, operator, value);
    expect(result).toEqual([]);
  });

  it("should fetch rows from the data extension with multiple filters", async () => {
    const dataExtension = "test_data_extension_key";
    const columnName1 = "test_column_1";
    const operator1 = ComparisonEnum.Equal;
    const value1 = "value_1";

    const columnName2 = "test_column_2";
    const operator2 = ComparisonEnum.LargerThan;
    const value2 = "value_2";

    const rowsetResponse = {
      items: [
        {
          values: {
            test_column_1: "value_1",
            test_column_2: "value_2",
          },
        },
      ],
    };

    nock(apiConfig.restEndpoint)
      .get(
        `/data/v1/customobjectdata/key/${objectKey}/rowset?$filter=${columnName1} ${operator1} '${encodeURIComponent(
          value1
        )}' and ${columnName2} ${operator2} '${encodeURIComponent(value2)}'`
      )
      .reply(200, rowsetResponse);

    const result = await helper
      .dataExtension(dataExtension)
      .get()

      .where(columnName1, operator1, value1)
      .where(columnName2, operator2, value2);

    expect(result).toEqual(rowsetResponse.items.map((item) => item.values));
  });

  it("should fetch via soap api", async () => {
    const dataExtension = "test_data_extension_key";
    const fields = ["test_column_1", "test_column_2"];
    const testValues = {
      test_column_1: "value_1",
      test_column_2: "value_2",
    };

    const soapResponse = `
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <RetrieveResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
            <OverallStatus>OK</OverallStatus>
            <RequestID>123456789</RequestID>
            <Results xsi:type="DataExtensionObject">
              <PartnerKey xsi:nil="true"/>
              <ObjectID xsi:nil="true"/>
              <Type>DataExtensionObject</Type>
              <Properties>
                ${fields
                  .map(
                    (field) =>
                      // @ts-ignore
                      `<Property><Name>${field}</Name><Value>${testValues[field]}</Value></Property>`
                  )
                  .join("")}
               
              </Properties>
            </Results>
            <RequestType>Retrieve</RequestType>
          </RetrieveResponseMsg>
        </soap:Body>
      </soap:Envelope>
    `;

    nock(apiConfig.soapEndpoint)
      .persist()
      .post("/Service.asmx")
      .reply(200, soapResponse);

    const de = new SfmcDataExtensionSoap(helper, dataExtension);
    const result = await de.get({
      fields,
      filters: [],
    });

    expect(result).toEqual([testValues]);
  });
});
