# SFMC-TS Data Extension Helper

SFMC TS is a Node.js library that provides an easy-to-use interface for interacting with the Salesforce Marketing Cloud API. It simplifies the process of managing data extensions, allowing developers to work with Marketing Cloud data in a more streamlined and efficient way.

## Installation

To install the SFMC TS library, run the following command in your terminal:

```sh
npm install sfmc-ts
```

## Usage
First, initialize the SFMC Helper library with your API configuration:

```js
import SfmcAPI from "sfmc-ts";

const sfmc = SfmcAPI({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  authEndpoint: "https://YOUR_SUBDOMAIN.auth.marketingcloudapis.com",
  restEndpoint: "https://YOUR_SUBDOMAIN.rest.marketingcloudapis.com",
  soapEndpoint: "https://YOUR_SUBDOMAIN.soap.marketingcloudapis.com",
  businessUnitId: "YOUR_BUSINESS_UNIT_ID",
});

```

Once initialized, you can use the `dataExtension` method to interact with data extensions:

```js
const dataExtension = sfmc.dataExtension("DATA_EXTENSION_OBJECT_KEY");

// Fetch a row by key column and value
const row = await dataExtension.row("Email", "someone@example.com").get();

// Upsert a record in the data extension
await dataExtension.row("Email", "someone@example.com").upsert({
  FirstName: "John",
  LastName: "Doe",
});

// Query the data extension (fetch all)
const records = await dataExtension.get().where("FirstName", "eq", "John").where("LastName", "eq", "Doe");

// Use SOAP API if needed
const resultSoap = await sfmc
  .dataExtension("DataExtensionName")
  .soap
  .get(["Name", "Name2"], {
    queryAllAccounts: true,
  })
  .where("Name", "equals", "test");
```

## Reference
Detailed reference documentation can be found in the [REFERENCE.md](REFRENCE.md) file.

## Roadmap
- Add support for the SOAP API (✅ basic implementation).
- Add support for more operators between conditions (OR, etc.)
- Add additional functions to interact with other objects in the Marketing Cloud API
- Implement more granular error handling and logging capabilities.

## Collaboration
We welcome collaboration on this project and encourage users to submit issues, bug reports, feature requests, and general feedback through the project's [GitHub repository](https://github.com/bxxf/sfmc-ts/).

If you're interested in contributing to the project, please take a look at the open issues and submit a pull request with your proposed changes. We'll review your contributions and work with you to get them merged into the main codebase.

Thank you for your interest in our project, and we look forward to working with you!

## License

This project is licensed under the MIT License
