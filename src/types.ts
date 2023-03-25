declare module "sfmc-helper" {
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
  }

  /**
   * Represents the configuration object for the Marketing Cloud API.
   */
  export interface SfmcApiConfig {
    clientId: string;
    clientSecret: string;
    authEndpoint: string;
    restEndpoint: string;
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
    get(): SfmcQueryBuilderWhere;
  }

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

  /**
   * Represents a Salesforce Marketing Cloud query builder.
   */
  interface SfmcQueryBuilder {
    /**
     * Adds a WHERE clause to the query.
     * @param {string} columnName - The column name for the filter.
     * @param {ComparisonOperator} operator - The comparison operator for the filter.
     * @param {string} value - The value for the filter.
     * @returns {SfmcQueryBuilder} - The SfmcQueryBuilder instance.
     */
    where(
      columnName: string,
      operator: ComparisonOperator,
      value: string
    ): SfmcQueryBuilder;
  }

  const initializeSfmcHelper: typeof SfmcHelper.initialize;
  export default initializeSfmcHelper;
}
