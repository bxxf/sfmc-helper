import type { ApiResponse, ComparisonOperator } from "../types";
import type { SfmcHelper } from "../sfmc-helper";

import fetch from "cross-fetch";
import { Filter } from "./filter";

export class SfmcQueryBuilder {
  private helper: SfmcHelper;
  private objectKey: string;

  filters: Filter[] = [];

  protected constructor(helper: SfmcHelper, objectKey: string) {
    this.helper = helper;
    this.objectKey = objectKey;
  }

  static create(helper: SfmcHelper, objectKey: string): SfmcQueryBuilder {
    const queryBuilder = new SfmcQueryBuilder(helper, objectKey);

    const handler = {
      get: (target: SfmcQueryBuilder, prop: string) => {
        if (prop === "then") {
          return (...args: any[]) => target._execute().then(...args);
        }

        return Reflect.get(target, prop);
      },
    };

    return new Proxy(queryBuilder, handler);
  }

  /**
   * Returns an instance of the SfmcQueryBuilderWhere class.
   * @returns {SfmcQueryBuilderWhere} - An instance of the SfmcQueryBuilderWhere class.
   */
  get(): SfmcQueryBuilderWhere {
    const handler = {
      get: (target: SfmcQueryBuilderWhere, prop: string) => {
        if (prop === "then") {
          return (...args: any[]) =>
            (target as unknown as SfmcQueryBuilder)._execute().then(...args);
        }

        return Reflect.get(target, prop);
      },
    };

    return new Proxy(this as any, handler);
  }

  /**
   * Adds a WHERE clause to the query.
   * @param {string} columnName - The column name for the filter.
   * @param {ComparisonOperator} operator - The comparison operator for the filter.
   * @param {string} value - The value for the filter.
   * @returns {SfmcQueryBuilderWhere} - An instance of the SfmcQueryBuilderWhere class.
   */
  where(
    columnName: string,
    operator: ComparisonOperator,
    value: string
  ): SfmcQueryBuilderWhere {
    if (typeof columnName !== "string") {
      throw new Error("Column name must be a string");
    }

    if (typeof operator !== "string") {
      throw new Error("Operator must be a string");
    }

    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    const filter = new Filter(columnName, operator, value);
    this.filters.push(filter);

    const handler = {
      get: (target: SfmcQueryBuilderWhere, prop: string) => {
        if (prop === "then") {
          return (...args: any[]) =>
            (target as unknown as SfmcQueryBuilder)._execute().then(...args);
        }

        return Reflect.get(target, prop);
      },
    };

    return new Proxy(this as any, handler);
  }

  private async checkAuth() {
    if (!this.helper.isAuthenticated()) {
      try {
        await this.helper.authenticate();
      } catch {
        throw new Error("Failed to authenticate with SFMC API");
      }
    }
  }

  async _execute(): Promise<any> {
    try {
      await this.checkAuth();
      const filterString = this.filters.length
        ? this.filters.map((filter) => filter.toString()).join(" and ")
        : undefined;
      const response = fetch(
        `${this.helper.getConfig().restEndpoint}/data/v1/customobjectdata/key/${
          this.objectKey
        }/rowset${filterString ? `?$filter=${filterString}` : ``}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.helper.getAccessToken()?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          const valuesArray = data.items?.length
            ? (data as ApiResponse).items.map((item: any) => item.values)
            : [];
          return valuesArray;
        } else {
          console.error(await res.json());
          throw new Error(`Failed to fetch filtered rows: ${res.statusText}`);
        }
      });
    } catch (error: any) {
      throw new Error(`Error while executing the query: ${error.message}`);
    }
  }
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
