# SFMC Data Extension Helper

SFMC JS is a Node.js library that provides an easy-to-use interface for interacting with the Salesforce Marketing Cloud API. It simplifies the process of managing data extensions, allowing developers to work with Marketing Cloud data in a more streamlined and efficient way.

## Installation

To install the SFMC JS library, run the following command in your terminal:

```sh
npm install sfmc-js
```

## Usage
To use the SFMC Helper library, you must first initialize it with your API configuration:

```js
import SfmcHelper from "sfmc-js";

const sfmc = SfmcHelper.initialize({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  authEndpoint: "https://YOUR_SUBDOMAIN.auth.marketingcloudapis.com",
  restEndpoint: "https://YOUR_SUBDOMAIN.rest.marketingcloudapis.com",
  businessUnitId: "YOUR_BUSINESS_UNIT_ID",
});

```

Once initialized, you can use the `dataExtension` method to interact with data extensions:

```js
const dataExtension = sfmc.dataExtension("DATA_EXTENSION_OBJECT_KEY");

// Fetch a row by a key column and its value
const row = await dataExtension.row("Email", "someone@example.com").get();

// Upsert a record in the data extension
await dataExtension.row("Email", "someone@example.com").upsert({
  FirstName: "John",
  LastName: "Doe",
});

// Query the data extension (fetch all)
const records = await dataExtension.get().where("FirstName", "eq", "John").where("LastName", "eq", "Doe");
```

## License

This project is licensed under the MIT License