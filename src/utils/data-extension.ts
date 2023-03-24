import { SfmcHelper } from "../sfmc-helper";
import { SfmcQueryBuilder, SfmcQueryBuilderWhere } from "./query-builder";

import fetch from "cross-fetch";

/**
 * Represents a Salesforce Marketing Cloud Data Extension
 */
export class SfmcDataExtension {
  private helper: SfmcHelper;
  private objectKey: string;

  /**
   * Constructs a new SfmcDataExtension instance.
   * @param {SfmcHelper} helper The SfmcHelper instance.
   * @param {string} objectKey The Data Extension's external key.
   */
  constructor(helper: SfmcHelper, objectKey: string) {
    this.helper = helper;
    this.objectKey = objectKey;
  }

  /**
   * Checks if the helper is authenticated and tries to authenticate if it's not.
   * @private
   */
  private async checkAuth() {
    if (!this.helper.isAuthenticated()) {
      try {
        await this.helper.authenticate();
      } catch {
        throw new Error("Failed to authenticate with SFMC API");
      }
    }
  }

  /**
   * Returns a row API for a specific key column and key value.
   * @param {string} keyColumn The key column name (usually primary key name).
   * @param {string} keyValue The key value - column value of row you are trying to fetch/modify.
   * @returns {Object} The row API with get and upsert methods.
   */
  row(keyColumn: string, keyValue: string) {
    const rowApi = {
      get: async (): Promise<any> => {
        await this.checkAuth();

        const filter = `${keyColumn} eq '${encodeURIComponent(keyValue)}'`;
        const response = await fetch(
          `${
            this.helper.getConfig().restEndpoint
          }/data/v1/customobjectdata/key/${
            this.objectKey
          }/rowset?$filter=${filter}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.helper.getAccessToken()?.token}`,
            },
          }
        );
        return (await (response.json() as any))?.items[0];
      },

      upsert: async (record: object): Promise<void> => {
        await this.checkAuth();

        const response = await fetch(
          `${this.helper.getConfig().restEndpoint}/hub/v1/dataevents/key:${
            this.objectKey
          }/rowset`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.helper.getAccessToken()?.token}`,
            },
            body: JSON.stringify([
              { keys: { [keyColumn]: keyValue }, values: record },
            ]),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          console.error(data);
          throw new Error("Failed to add record to data extension");
        }
        return data[0];
      },
    };

    return rowApi;
  }

  /**
   * Fetches all rows from the data extension.
   * @returns {SfmcQueryBuilderWhere} The query builder with where method to filter data
   */
  get(): SfmcQueryBuilderWhere {
    const queryBuilder = SfmcQueryBuilder.create(this.helper, this.objectKey);

    const handler = {
      get: (target: SfmcQueryBuilderWhere, prop: string) => {
        if (prop === "then") {
          return (...args: any[]) =>
            (target as unknown as SfmcQueryBuilder)._execute().then(...args);
        }

        return Reflect.get(target, prop);
      },
    };

    return new Proxy(queryBuilder.get(), handler);
  }
}
