import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";

import {
  createDataExtensionBody,
  createFieldsXml,
} from "../../models/soap/create";

import { deleteDataExtensionBody } from "../../models/soap/delete";
import { retrieveDataExtensionBody } from "../../models/soap/retrieve";
import { SfmcSoapFilter, createFilterXml } from "./soap-filter";
import { SfmcHelper } from "../../sfmc-ts";


enum SoapAction {
  Create = "Create",
  Retrieve = "Retrieve",
  Delete = "Delete",
}

export interface ISoapGetOptions {
  queryAllAccounts?: boolean;
}

export interface SfmcDataExtensionField {
  name: string;
  type: "Text" | "Number" | "Date" | "Boolean";
  isPrimaryKey?: boolean;
  isRequired?: boolean;
  length?: number;
}

export interface ISoapRequest {
  create({
    fields,
  }: {
    fields: AtLeastOnePrimaryKey<SfmcDataExtensionField>;
  }): Promise<any>;
  get({
    fields,
    options,
  }: {
    fields: string[];
    options?: ISoapGetOptions;
  }): Promise<Array<any>>;
  remove(): Promise<any>;
}

export interface PrimaryKeyField extends SfmcDataExtensionField {
  isPrimaryKey: true;
}

export type AtLeastOnePrimaryKey<T> = T[] extends PrimaryKeyField[]
  ? T[]
  : T extends PrimaryKeyField
  ? T[]
  : [PrimaryKeyField, ...T[]];

export class SfmcDataExtensionSoap implements ISoapRequest {
  private helper: SfmcHelper;
  private objectKey: string;

  constructor(helper: SfmcHelper, objectKey: string) {
    this.helper = helper;
    this.objectKey = objectKey;
  }

  private buildSoapEnvelope(body: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <soapenv:Header>
              <fueloauth xmlns="http://exacttarget.com">${
                this.helper.getAccessToken()?.token
              }</fueloauth>
            </soapenv:Header>
            <soapenv:Body>${body}</soapenv:Body>
          </soapenv:Envelope>`;
  }

  private async sendSoapRequest(
    requestBody: string,
    soapAction: SoapAction
  ): Promise<any> {
    await this.helper.authenticate();
    const soapEnvelope = this.buildSoapEnvelope(requestBody);
    let response: any;
    try {
      response = await fetch(
        this.helper.getConfig().soapEndpoint + "/Service.asmx",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/xml;charset=UTF-8",
            SOAPAction: soapAction,
          },
          body: soapEnvelope,
        }
      );
    } catch (err) {
      throw err;
    }

    const responseText = await response.text();
    const parsedResponse = await parseStringPromise(responseText, {
      explicitArray: false,
    });

    return parsedResponse;
  }

  async create({
    fields,
  }: {
    fields: AtLeastOnePrimaryKey<SfmcDataExtensionField>;
  }): Promise<void> {
    const hasPrimaryKey = fields.some((field) => field.isPrimaryKey);

    if (!hasPrimaryKey) {
      throw new Error("At least one field must be a primary key");
    }

    const fieldsXml = createFieldsXml(fields);
    const body = createDataExtensionBody(this.objectKey, fieldsXml);

    try {
      const response = await this.sendSoapRequest(body, SoapAction.Create);
      const overallStatus =
        response["soap:Envelope"]["soap:Body"].CreateResponse.OverallStatus;

      if (overallStatus !== "OK") {
        throw new Error(`Failed to create Data Extension: ${overallStatus}`);
      }

      return overallStatus;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async get({
    fields,
    filters,
    options,
  }: {
    fields: string[];
    filters: SfmcSoapFilter[];
    options?: ISoapGetOptions;
  }): Promise<Array<any>> {
    try {
      const propertiesXml = fields
        .map((field: string) => `<Properties>${field}</Properties>`)
        .join("");

      const filterXml = filters.length > 0 ? createFilterXml(filters) : "";

      const response = await this.sendSoapRequest(
        retrieveDataExtensionBody(
          this.objectKey,
          propertiesXml,
          filterXml,
          options
        ),
        SoapAction.Retrieve
      );

      const envelopeBody = response["soap:Envelope"]["soap:Body"];
      const retrieveResponse = envelopeBody.RetrieveResponseMsg;
     
      const overallStatus = retrieveResponse.OverallStatus;
      const results = retrieveResponse.Results;

      const resultsArray = Array.isArray(results)
        ? results
        : results != undefined
        ? [results]
        : [];

      const keyValueObjects = resultsArray.map((result: any) => {
        if (!result) return undefined;
        return result.Properties.Property.reduce(
          (accumulator: any, current: any) => {
            accumulator[current.Name] = current.Value;
            return accumulator;
          },
          {}
        );
      });

      if (overallStatus != "OK") {
        throw new Error(`Data Extension retrieve error: ${overallStatus}`);
      }
      return keyValueObjects;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async remove(): Promise<any> {
    try {
      const response = await this.sendSoapRequest(
        deleteDataExtensionBody(this.objectKey),
        SoapAction.Delete
      );
      const envelopeBody = response["soap:Envelope"]["soap:Body"];
      const deleteResponse = envelopeBody.DeleteResponse;
      const overallStatus = deleteResponse.OverallStatus;

      if (overallStatus !== "OK") {
        throw new Error(`Failed to delete Data Extension: ${overallStatus}`);
      }

      return overallStatus;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
