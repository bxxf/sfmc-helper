# SFMC-TS Data Extension Helper - Reference

This reference document provides a detailed overview of the classes, properties, and methods available in the SFMC-TS Data Extension Helper library.

## Table of Contents

1. [Config](#config)
2. [SFMC API (Main Object)](#sfmc-api-main-object)
3. [Data Extension](#data-extension)
4. [Where Clause Builder](#where-clause-builder)

## Config

The `Config` object represents the configuration for the Salesforce Marketing Cloud API.

### Properties

- `clientId`: The client ID for the Marketing Cloud API.
- `clientSecret`: The client secret for the Marketing Cloud API.
- `authEndpoint`: The authentication endpoint for the Marketing Cloud API.
- `restEndpoint`: The REST API endpoint for the Marketing Cloud API.
- `soapEndpoint`: The SOAP API endpoint for the Marketing Cloud API.
- `businessUnitId`: The business unit ID (clientID) for the Marketing Cloud API.

## SFMC API (Main Object)

The `SfmcAPI` factory function creates a Salesforce Marketing Cloud Helper instance.

### Parameters

- `config`: The configuration object for the SFMC API.

Returns an object with a `dataExtension` method that creates a new instance of the `SfmcDataExtension` class.

## Data Extension

The `DataExtension` class represents a data extension in the Salesforce Marketing Cloud API.

### Properties

#### soap

The `soap` property provides access to the SOAP API object, which allows interaction with the data extension using the SOAP protocol. The SOAP API object includes the following methods:

- `get(fields: string[], options?)`: Retrieves data from the data extension with filtering options. It returns a promise that resolves with the data.
  - `fields`: An array of column names to retrieve.
  - `options`: An optional object with additional settings for the request.
  - `.where(columnName: string, operator: string, value: string)`: A method to add filtering conditions. See [supported values for SOAP operators](https://developer.salesforce.com/docs/marketing/marketing-cloud/guide/simpleoperators.html).

- `create(fields: SfmcDataExtensionField[])`: Creates a new data extension.
  - `fields`: An array of field objects with the following properties:
    - `name`: The field's name as a string.
    - `value`: The field's value.
    - `isPrimaryKey`: An optional boolean indicating if the field is a primary key - at least one primary key is required.
    - `isRequired`: An optional boolean indicating if the field is required.

- `delete()`: Deletes the data extension. Returns a promise that resolves when the operation is complete.


### Methods

#### row(keyColumn: string, keyValue: string)

Returns a row API for a specific key column and key value.

- `keyColumn`: The key column name (usually the primary key name).
- `keyValue`: The key value - column value of the row you are trying to fetch/modify.

Returns an object with the following methods:
- `get()`: A method that returns a promise with the row data or undefined.
- `upsert(record: object)`: A method that updates or creates a row in the data extension.

#### get()

Fetches all rows from the data extension.

- Returns an instance of the `SfmcQueryBuilderWhere` class with a `where` method to filter data.

## Where Clause Builder

The `WhereClauseBuilder` interface represents the `SfmcQueryBuilderWhere` class.

### Methods

#### where(columnName: string, operator: string, value: string)

Adds a WHERE clause to the query.

- `columnName`: The column name for the filter.
- `operator`: The comparison operator for the filter as a string. The supported values are `"eq"`, `"ne"`, `"lt"`, `"le"`, `"gt"`, `"ge"`, and `"like"`.
- `value`: The value for the filter.
