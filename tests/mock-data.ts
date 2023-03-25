export const apiConfig = {
  clientId: "test_client_id",
  clientSecret: "test_client_secret",
  authEndpoint: "https://auth.example.com",
  restEndpoint: "https://rest.example.com",
  businessUnitId: "test_business_unit_id",
};
export const authResponse = {
  access_token: "test_access_token",
  expires_in: 3600,
};
export const authRequestBody = {
  grant_type: "client_credentials",
  client_id: apiConfig.clientId,
  client_secret: apiConfig.clientSecret,
  account_id: apiConfig.businessUnitId,
};
