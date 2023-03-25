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
};

const someFunction = async () => {
  const sfmc = SfmcAPI(config);
  
  const result = await sfmc
    .dataExtension("DataExtensionName")
    .get()
    .where("EmailAddress", "eq", "someemail@example.com")
  console.log(result);
};

someFunction();
