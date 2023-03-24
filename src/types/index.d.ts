export interface ApiResponse {
    items: Array<{
      values: any;
    }>;
  }
  
  export type ComparisonOperator =
    | "eq"
    | "ne"
    | "lt"
    | "le"
    | "gt"
    | "ge"
    | ComparisionEnum;
  
  export enum ComparisionEnum {
    Equal = "eq",
    NotEqual = "ne",
    LargerThan = "lt",
    LowerOrEqual = "le",
    GreaterThan = "gt",
    GreaterOrEqual = "ge",
  }
  
  export interface SfmcApiConfig {
    clientId: string;
    clientSecret: string;
    authEndpoint: string;
    restEndpoint: string;
    businessUnitId?: string;
  }
  
  export interface SfmcDataExtensionRow {
    [key: string]: any;
  }
  
  export declare class SfmcDataExtension {
    constructor(helper: SfmcHelper, objectKey: string);
    row(key: string, value: string): SfmcDataExtensionRow;
    get(): Promise<Array<SfmcDataExtensionRow>>;
    where(key: string, operator: string, value: string): SfmcDataExtension;
    upsert(data: SfmcDataExtensionRow): Promise<void>;
    delete(key: string, value: string): Promise<void>;
  }
  
  export declare class SfmcHelper {
    private config;
    private accessToken;
    private static instance;
    constructor(config: SfmcApiConfig);
    dataExtension(objectKey: string): SfmcDataExtension;
  }
  