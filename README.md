# SFMC-TS Data Extension Helper

SFMC TS is a Node.js library that provides an easy-to-use interface for interacting with the Salesforce Marketing Cloud API. It simplifies the process of managing data extensions, allowing developers to work with Marketing Cloud data in a more streamlined and efficient way.

## Installation

To install the SFMC TS library, run the following command in your terminal:

```sh
npm install sfmc-ts
```

## Usage
To use the SFMC Helper library, you must first initialize it with your API configuration:

```js
import SfmcAPI from "sfmc-ts";

const sfmc = SfmcAPI({
  clientId: "YOUR_CLIENT_ID",
  clientSecret: "YOUR_CLIENT_SECRET",
  authEndpoint: "https://YOUR_SUBDOMAIN.auth.marketingcloudapis.com",
  restEndpoint: "https://YOUR_SUBDOMAIN.rest.marketingcloudapis.com",
  businessUnitId: "YOUR_BUSINESS_UNIT_ID",
  soapEndpoint: "https://YOUR_SUBDOMAIN.soap.marketingcloudapis.com"
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

## Reference

### Config

Represents the configuration object for the Marketing Cloud API.

#### Properties

- `clientId`: The client ID for the Marketing Cloud API.
- `clientSecret`: The client secret for the Marketing Cloud API.
- `authEndpoint`: The authentication endpoint for the Marketing Cloud API.
- `restEndpoint`: The REST API endpoint for the Marketing Cloud API.
- `businessUnitId`: The business unit ID (clientID) for the Marketing Cloud API.

### SFMC API (Main Object)

Factory function to create a Salesforce Marketing Cloud Helper instance.

#### Parameters
  - `config`: The configuration object for the SFMC API.
  
- Returns an object with a `dataExtension` method that creates a new instance of the `SfmcDataExtension` class.

### Data Extension

Represents a data extension in the Marketing Cloud API.

#### Methods

##### row(keyColumn: string, keyValue: string)

Returns a row API for a specific key column and key value.

- `keyColumn`: The key column name (usually primary key name).
- `keyValue`: The key value - column value of row you are trying to fetch/modify.
- Returns an object with the following methods:
  - `get()`: A method that returns a promise with the row data or undefined.
  - `upsert(record: object)`: A method that updates or creates a row in the data extension.

##### get()

Fetches all rows from the data extension.

- Returns an instance of the `SfmcQueryBuilderWhere` class with a `where` method to filter data.

### Where Clause Builder

Interface for the `SfmcQueryBuilderWhere` class.

#### Methods

##### where(columnName: string, operator: string, value: string)

Adds a WHERE clause to the query.

- `columnName`: The column name for the filter.
- `operator`: The comparison operator for the filter as a string. The supported values are `"eq"`, `"ne"`, `"lt"`, `"le"`, `"gt"`, `"ge"`, and `"like"`.
- `value`: The value for the filter.


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
