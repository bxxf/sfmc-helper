import { SfmcApiConfig } from "sfmc-helper";

import { SfmcDataExtension } from "./utils/data-extension";
import fetch from "node-fetch";

interface AccessToken {
  token: string;
  expiresAt: number;
}

/**
 * Helper class for Salesforce Marketing Cloud API integration.
 */
export class SfmcHelper {
  private config: SfmcApiConfig;
  private accessToken: AccessToken | undefined;
  private static instance: SfmcHelper | undefined;

  /**
   * Initializes the Salesforce Marketing Cloud Helper.
   * @private
   */
  private constructor(config: SfmcApiConfig) {
    this.config = config;
    this.authenticate();
  }
  /**
   * Initializes the Salesforce Marketing Cloud Helper.
   * @param {SfmcApiConfig} config - The configuration object for the SFMC API.
   * @returns {SfmcHelper} - An instance of the SfmcHelper class.
   */
  static initialize(config: SfmcApiConfig): {
    dataExtension: (objectKey: string) => SfmcDataExtension;
  } {
    if (typeof window !== "undefined") {
      throw new Error(
        "SfmcHelper should not be used on the frontend due to security concerns."
      );
    }
    if (!SfmcHelper.instance) {
      SfmcHelper.instance = new SfmcHelper(config);
    }
    return SfmcHelper.instance;
  }
  
  /**
   * @private
   * Authenticates with the Salesforce Marketing Cloud API.
   * @returns {Promise<void>} - A promise that resolves when the authentication is complete.
   */
  async authenticate(): Promise<void> {
    if (this.isAuthenticated()) {
      return;
    }

    const response = await fetch(`${this.config.authEndpoint}/v2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        account_id: this.config.businessUnitId,
      }),
    });
    if (response.ok) {
      const data: any = await response.json();
      const expiresIn = data.expires_in;
      this.accessToken = {
        token: data.access_token,
        expiresAt: Date.now() + expiresIn * 1000,
      };
      if (!this.accessToken.token) {
        console.error(data);
        throw new Error("Failed to authenticate with SFMC API");
      }
    } else {
      const data = await response.json();
      console.error(data);
      throw new Error("Failed to authenticate with SFMC API");
    }
  }
  /**
   * @private
   * Checks if the current instance is authenticated.
   * @returns {boolean} - True if authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    if (!this.accessToken) {
      return false;
    }
    if (Date.now() < this.accessToken.expiresAt) {
      return true;
    } else {
      this.authenticate();
      return false;
    }
  }
  /**
   * @private
   * Returns the API configuration.
   * @returns {SfmcApiConfig} - The SFMC API configuration object.
   */
  getConfig(): SfmcApiConfig {
    return this.config;
  }
  /**
   * @private
   * Returns the access token.
   * @returns {AccessToken | undefined} - The access token object or undefined if not authenticated.
   */
  getAccessToken(): AccessToken | undefined {
    return this.accessToken;
  }
  /**
   * Returns a new instance of the SfmcDataExtension class - a helper class for interacting with data extensions.
   * @param {string} objectKey - The object key of the data extension.
   * @returns {SfmcDataExtension} - A new instance of the SfmcDataExtension class.
   */
  dataExtension(objectKey: string): SfmcDataExtension {
    return new SfmcDataExtension(this, objectKey);
  }
  
}
