import { ISoapGetOptions } from "../soap-client";

export const retrieveDataExtensionBody = (
  objectKey: string,
  properties: string,
  filterXml?: string,
  options?: ISoapGetOptions
) => {
  const queryAllAccounts = options?.queryAllAccounts ? "true" : "false";
  return `
<RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
  <RetrieveRequest>
    <ObjectType>DataExtensionObject[${objectKey}]</ObjectType>
    ${properties}
    ${
      filterXml
        ? `${filterXml}`
        : ""
    }
    <QueryAllAccounts>${queryAllAccounts}</QueryAllAccounts>
  </RetrieveRequest>
</RetrieveRequestMsg>`;
};
