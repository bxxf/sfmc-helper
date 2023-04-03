declare module "sfmc-ts" {
  /**
   * Represents the response from the Marketing Cloud API.
   */
  export interface ApiResponse {
    items: Array<{
      values: any;
    }>;
  }

  /**
   * The supported comparison operators for a WHERE clause in a query.
   */
  export type ComparisonOperator =
    | "eq"
    | "ne"
    | "lt"
    | "le"
    | "gt"
    | "ge"
    | "like"
    | ComparisonEnum;

  /**
   * The supported comparison operators for a WHERE clause in a query.
   */
  export enum ComparisonEnum {
    Equal = "eq",
    NotEqual = "ne",
    LargerThan = "lt",
    LowerOrEqual = "le",
    GreaterThan = "gt",
    GreaterOrEqual = "ge",
    Like = "like",
  }

  /**
   * Represents the configuration object for the Marketing Cloud API.
   */
  export interface SfmcApiConfig {
    clientId: string;
    clientSecret: string;
    authEndpoint: string;
    restEndpoint: string;
    soapEndpoint: string;
    businessUnitId?: string;
  }

  /**
   * Represents a row in a data extension.
   */
  export interface SfmcDataExtensionRow {
    [key: string]: any;
  }

  /**
   * Represents a data extension in the Marketing Cloud API.
   */
  export class SfmcDataExtension {
    /**
     * Constructs a new instance of the SfmcDataExtension class.
     * @param helper The SfmcHelper instance.
     * @param objectKey The external key of the data extension.
     */
    constructor(helper: SfmcHelper, objectKey: string);

    /**
     * Returns a row API for a specific key column and key value.
     * @param keyColumn The key column name (usually primary key name).
     * @param keyValue The key value - column value of row you are trying to fetch/modify.
     * @returns The row API with get and upsert methods.
     */
    row(
      keyColumn: string,
      keyValue: string
    ): {
      get: () => Promise<SfmcDataExtensionRow | undefined>;
      upsert: (record: SfmcDataExtensionRow) => Promise<void>;
    };

    /**
     * Fetches all rows from the data extension.
     * @returns The query builder with where method to filter data.
     */
    get(): SfmcQueryBuilderWhere & Promise<any>;

    /**
     * Creates SOAP api object for the data extension.
     * @returns Soap API object.
     */
    soap: SfmcDataExtensionSoap;
  }

  export interface SfmcDataExtensionField {
    name: string;
    value: any;
    isPrimaryKey?: boolean;
    isRequired?: boolean;
  }

  export interface PrimaryKeyField extends SfmcDataExtensionField {
    isPrimaryKey: true;
  }

  export type AtLeastOnePrimaryKey<T> = T[] extends PrimaryKeyField[]
    ? T[]
    : T extends PrimaryKeyField
    ? T[]
    : [PrimaryKeyField, ...T[]];
  /**
   * Interface for the SfmcApiConfig configuration object.
   */
  export interface SfmcApiConfig {
    clientId: string; // The client ID for the Marketing Cloud API.
    clientSecret: string; // The client secret for the Marketing Cloud API.
    authEndpoint: string; // The authentication endpoint for the Marketing Cloud API.
    restEndpoint: string; // The REST API endpoint for the Marketing Cloud API.
    businessUnitId?: string; // The business unit ID for the Marketing Cloud API (optional).
  }

  /**
   * Interface for the SfmcQueryBuilderWhere class.
   */
  export interface SfmcQueryBuilderWhere {
    /**
     * Adds a WHERE clause to the query.
     * @param {string} columnName - The column name for the filter.
     * @param {ComparisonOperator} operator - The comparison operator for the filter.
     * @param {string} value - The value for the filter.
     * @returns {SfmcQueryBuilderWhere & Promise} - An instance of the SfmcQueryBuilderWhere class.
     */
    where(
      columnName: string,
      operator: ComparisonOperator,
      value: string
    ): SfmcQueryBuilderWhere & Promise<any>;
  }

  /**
   * Helper class for Salesforce Marketing Cloud API integration.
   */
  class SfmcHelper {
    /**
     * Initializes the Salesforce Marketing Cloud Helper.
     * @param {SfmcApiConfig} config - The configuration object for the SFMC API.
     * @returns {{ dataExtension: (objectKey: string) => SfmcDataExtension }} - An object with a dataExtension method that creates a new instance of the SfmcDataExtension class.
     */
    static initialize(config: SfmcApiConfig): SfmcHelper;
    /**
     * Constructs a new SfmcHelper instance.
     * @param {SfmcApiConfig} config The configuration object for the SFMC API.
     */
    constructor(config: SfmcApiConfig);
    /**
     * Returns a new instance of the SfmcDataExtension class - a helper class for interacting with data extensions.
     * @param {string} objectKey - The object key of the data extension.
     * @returns {SfmcDataExtension} - A new instance of the SfmcDataExtension class.
     */
    dataExtension(objectKey: string): SfmcDataExtension;
  }

  export class SfmcDataExtensionSoap {
    /**
     * Creates a new row in the data extension with the specified fields.
     * @param {Object} args - The arguments object.
     * @param {Array<AtLeastOnePrimaryKey<SfmcDataExtensionField>>} args.fields - An array of fields for the new row, with at least one primary key field.
     * @returns {Promise<any>} - A promise that resolves when the row has been created.
     */
    create({
      fields,
    }: {
      fields: AtLeastOnePrimaryKey<SfmcDataExtensionField>;
    }): Promise<any>;

    /**
     * Retrieves data extension rows with specified fields and optional filters.
     * @param {string[]} fields - An array of field names to retrieve.
     * @param {ISoapGetOptions} options - Optional get options.
     * @returns {SoapQueryBuilderWhere} - A SoapQueryBuilderWhere instance to add filter conditions to the query.
     */
    get(fields: string[], options?: ISoapGetOptions): SoapQueryBuilderWhere;

    /**
     * Removes the data extension.
     * @returns {Promise<any>} - A promise that resolves when the data extension has been removed.
     */
    remove(): Promise<any>;
  }

  export interface ISoapRequestBuilder {
    /**
     * Adds a WHERE clause to the query.
     * @param {string} columnName - The column name for the filter.
     * @param {SoapOperator} operator - The comparison operator for the filter.
     * @param {string} value - The value for the filter.
     * @returns {SoapQueryBuilderWhere & Promise<any>} - An instance of the SoapQueryBuilderWhere class with Promise support.
     */
    where(
      columnName: string,
      operator: ComparisonOperator,
      value: string
    ): SoapQueryBuilderWhere & Promise<any>;
  }

  export interface SfmcFilter {
    columnName: string;
    operator: ComparisonOperator;
    value: string;
  }

  export interface SoapQueryBuilderBase {
    sfmcDataExtensionSoap: SfmcDataExtensionSoap;
    fields: string[];
    filters: SfmcFilter[];
  }

  export class SfmcSoapFilter {
    columnName: string;
    value: string;
    operator: SoapOperator;
  }

  export enum SoapFilterOperator {
    BEGINS_WITH = "beginsWith",
    BETWEEN = "between",
    CONTAINS = "contains",
    ENDS_WITH = "endsWith",
    EQUALS = "equals",
    EXISTS_IN_STRING = "existsInString",
    EXISTS_IN_STRING_AS_A_WORD = "existsInStringAsAWord",
    GREATER_THAN = "greaterThan",
    GREATER_THAN_ANNIVERSARY = "greaterThanAnniversary",
    GREATER_THAN_OR_EQUAL = "greaterThanOrEqual",
    IN = "IN",
    IS_ANNIVERSARY = "isAnniversary",
    IS_NOT_ANNIVERSARY = "isNotAnniversary",
    IS_NOT_NULL = "isNotNull",
    IS_NULL = "isNull",
    LESS_THAN = "lessThan",
    LESS_THAN_ANNIVERSARY = "lessThanAnniversary",
    LESS_THAN_OR_EQUAL = "lessThanOrEqual",
    LIKE = "like",
    NOT_CONTAINS = "notContains",
    NOT_EQUALS = "notEquals",
    NOT_EXISTS_IN_STRING = "notExistsInString",
  }

  type SoapOperator =
    | SoapFilterOperator
    | "beginsWith"
    | "between"
    | "contains"
    | "endsWith"
    | "equals"
    | "existsInString"
    | "existsInStringAsAWord"
    | "greaterThan"
    | "greaterThanAnniversary"
    | "greaterThanOrEqual"
    | "IN"
    | "isAnniversary"
    | "isNotAnniversary"
    | "isNotNull"
    | "isNull"
    | "lessThan"
    | "lessThanAnniversary"
    | "lessThanOrEqual"
    | "like"
    | "notContains"
    | "notEquals"
    | "notExistsInString";

  export interface SoapQueryBuilderGet {
    /**
     * Adds a WHERE clause to the query.
     * @param {string} columnName - The column name for the filter.
     * @param {SoapOperator} operator - The comparison operator for the filter.
     * @param {string} value - The value for the filter.
     * @returns {SoapQueryBuilderWhere & Promise<any>} - An instance of the SoapQueryBuilderWhere class with Promise support.
     */
    where(
      columnName: string,
      operator: SoapOperator,
      value: string
    ): SoapQueryBuilderWhere;
  }

  export interface SoapQueryBuilderWhere
    extends Promise<any>,
      SoapQueryBuilderGet {}

  export interface ApiResponse {
    items: Array<{
      values: any;
    }>;
  }

  /**
   * Represents the configuration object for the Marketing Cloud API.
   */
  export interface SfmcApiConfig {
    clientId: string;
    clientSecret: string;
    authEndpoint: string;
    restEndpoint: string;
    soapEndpoint: string;
    businessUnitId?: string;
  }

  export interface SfmcDataExtensionField {
    name: string;
    value: any;
    isPrimaryKey?: boolean;
    isRequired?: boolean;
  }

  export interface ISoapGetOptions {
    queryAllAccounts?: boolean;
  }

  export interface SoapQueryBuilder extends SoapQueryBuilderBase {
    /**
     * Retrieves data extension rows with specified fields and optional filters.
     * @param {Object} args - The arguments object.
     * @param {string[]} args.fields - An array of field names to retrieve.
     * @param {ISoapGetOptions} [args.options] - Optional get options.
     * @returns {SoapQueryBuilderWhere} - A SoapQueryBuilderWhere instance to add filter conditions to the query.
     */
    get(fields: string[]): SoapQueryBuilderWhere;
  }

  const initializeSfmcHelper: typeof SfmcHelper.initialize;
  export default initializeSfmcHelper;
}
