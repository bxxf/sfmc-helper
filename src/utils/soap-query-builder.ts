import { ISoapGetOptions } from "sfmc-ts";
import { SfmcDataExtensionSoap } from "./soap/soap-client";
import { SfmcSoapFilter, SoapFilterOperator } from "./soap/soap-filter";
export type SoapOperator =
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

class SoapQueryBuilderBase {
  protected sfmcDataExtensionSoap: SfmcDataExtensionSoap;
  protected fields: string[] = [];
  protected filters: SfmcSoapFilter[] = [];

  /**
   * @param {SfmcDataExtensionSoap} sfmcDataExtensionSoap - The SFMC Data Extension SOAP client instance
   */
  constructor(sfmcDataExtensionSoap: SfmcDataExtensionSoap) {
    this.sfmcDataExtensionSoap = sfmcDataExtensionSoap;
  }
}

interface ISoapRequestBuilder {
  /**
   * @param {string} columnName - The column name to filter by
   * @param {SoapOperator} operator - The comparison operator for the filter
   * @param {string} value - The value to compare against
   * @returns {SoapQueryBuilderWhere & Promise<any>} - Returns an instance of SoapQueryBuilderWhere with Promise support
   */
  where(
    columnName: string,
    operator: SoapOperator,
    value: string
  ): SoapQueryBuilderWhere & Promise<any>;
}

class SoapQueryBuilderGet
  extends SoapQueryBuilderBase
  implements ISoapRequestBuilder
{
  protected options: ISoapGetOptions | undefined;

  /**
   * @param {SfmcDataExtensionSoap} sfmcDataExtensionSoap - The SFMC Data Extension SOAP client instance
   * @param {string[]} fields - The fields to retrieve
   */
  constructor(
    sfmcDataExtensionSoap: SfmcDataExtensionSoap,
    fields: string[],
    options?: ISoapGetOptions
  ) {
    super(sfmcDataExtensionSoap);
    this.fields = fields;
    this.options = options;
  }

  where(
    columnName: string,
    operator: SoapOperator,
    value: string
  ): SoapQueryBuilderWhere & Promise<any> {
    return createWhereProxy(this.sfmcDataExtensionSoap, this.fields, [
      { columnName, operator, value },
    ]) as any;
  }

  protected execute(): Promise<any> {
    return this.sfmcDataExtensionSoap.get({
      fields: this.fields,
      filters: this.filters,
    });
  }
}

const createGetProxy = (
  sfmcDataExtensionSoap: SfmcDataExtensionSoap,
  fields: string[],
  options?: ISoapGetOptions
): SoapQueryBuilderGet => {
  const getInstance = new SoapQueryBuilderGet(
    sfmcDataExtensionSoap,
    fields,
    options
  );

  return new Proxy(getInstance, {
    get(target, prop, receiver) {
      if (prop === "then") {
        return (...args: any[]) => (target as any).execute().then(...args);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
};

class SoapQueryBuilderWhere
  extends SoapQueryBuilderBase
  implements ISoapRequestBuilder
{
  /**
   * @param {SfmcDataExtensionSoap} sfmcDataExtensionSoap - The SFMC Data Extension SOAP client instance
   * @param {string[]} fields - The fields to retrieve
   * @param {SfmcSoapFilter[]} filters - The filters to apply
   */
  constructor(
    sfmcDataExtensionSoap: SfmcDataExtensionSoap,
    fields: string[],
    filters: SfmcSoapFilter[]
  ) {
    super(sfmcDataExtensionSoap);
    this.fields = fields;
    this.filters = filters;
  }

  where(
    columnName: string,
    operator: SoapOperator,
    value: string
  ): SoapQueryBuilderWhere & Promise<any> {
    this.filters.push({ columnName, operator, value });
    return this as any;
  }

  execute(): Promise<any> {
    return this.sfmcDataExtensionSoap.get({
      fields: this.fields,
      filters: this.filters,
    });
  }
}

const createWhereProxy = (
  sfmcDataExtensionSoap: SfmcDataExtensionSoap,
  fields: string[],
  filters: SfmcSoapFilter[]
): SoapQueryBuilderWhere => {
  const whereInstance = new SoapQueryBuilderWhere(
    sfmcDataExtensionSoap,
    fields,
    filters
  );

  return new Proxy(whereInstance, {
    get(target, prop, receiver) {
      if (prop === "then") {
        return (...args: any[]) => target.execute().then(...args);
      }
      return Reflect.get(target, prop, receiver);
    },
  });
};

export class SoapQueryBuilder extends SoapQueryBuilderBase {
  get(
    fields: string[],
    options: ISoapGetOptions | undefined
  ): SoapQueryBuilderGet {
    this.fields = fields;
    return createGetProxy(this.sfmcDataExtensionSoap, this.fields, options);
  }
}
