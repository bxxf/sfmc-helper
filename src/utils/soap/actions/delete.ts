export const deleteDataExtensionBody = (objectKey: string) => `
<DeleteRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">
  <Objects xsi:type="DataExtension">
    <CustomerKey>${objectKey}</CustomerKey>
  </Objects>
</DeleteRequest>`;
