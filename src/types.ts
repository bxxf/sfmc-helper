export interface SfmcApiConfig {
  authEndpoint: string;
  clientId: string;
  clientSecret: string;
  businessUnitId?: string;
  restEndpoint: string;
}

export interface ApiResponse {
  items: Array<{
    values: any;
  }>;
}

export type ComparisonOperator = 'eq' | 'ne' | 'lt' | 'le' | 'gt' | 'ge' | ComparisionEnum;

export enum ComparisionEnum {
  Equal = 'eq',
  NotEqual = 'ne',
  LargerThan = 'lt',
  LowerOrEqual = 'le',
  GreaterThan = 'gt',
  GreaterOrEqual = 'ge'
}
