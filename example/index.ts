import SfmcAPI from "../dist";

// just importing env variables - you can skip this part
import dotenv from "dotenv";
dotenv.config();

const config = {
  authEndpoint: process.env.AUTH_ENDPOINT || "",
  clientId: process.env.CLIENT_ID || "",
  clientSecret: process.env.CLIENT_SECRET || "",
  restEndpoint: process.env.REST_ENDPOINT || "",
  businessUnitId: process.env.BUSINESS_UNIT_ID,
  soapEndpoint: process.env.SOAP_ENDPOINT || "",
};

const someFunction = async () => {
  const sfmc = SfmcAPI(config);
  
  const result = await sfmc
    .dataExtension("DataExtensionName")
    .get()
  console.log(result);

  const resultSoap = await sfmc
    .dataExtension("DataExtensionName")
    .soap
    .get(["Name", "Name2"], {
      queryAllAccounts: true,
    })
    .where("Name", "equals", "test");

  console.log(resultSoap);
};

someFunction();
