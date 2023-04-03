import { SfmcDataExtensionField } from "../../utils/soap/soap-client";

export const createDataExtensionBody = (objectKey: string, xml: string) => `
<CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">
  <Objects xsi:type="DataExtension">
    <PartnerKey xsi:nil="true"/>
    <ObjectID xsi:nil="true"/>
    <CustomerKey>${objectKey}</CustomerKey>
    <Name>${objectKey}</Name>
    <Fields>
      ${xml}
    </Fields>
  </Objects>
</CreateRequest>`;

export const createFieldsXml = (fields: SfmcDataExtensionField[]) =>
  fields
    .map((field) => {
      const lengthAttribute =
        field.type === "Text"
          ? `<MaxLength>${field.length ?? 4000}</MaxLength>`
          : "";
      return `
    <Field>
      <Name>${field.name}</Name>
      <DataType>${field.type}</DataType>
      ${lengthAttribute}
      <IsPrimaryKey>${field.isPrimaryKey ?? false}</IsPrimaryKey>
      <IsRequired>${
        (field.isPrimaryKey || field.isRequired) ?? false
      }</IsRequired>
    </Field>`;
    })
    .join("");
