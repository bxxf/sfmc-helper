import { SoapOperator } from "./soap-query-builder";

export class SfmcSoapFilter {
  columnName: string;
  value: string;
  operator: SoapOperator;

  constructor(columnName: string, operator: SoapFilterOperator, value: string) {
    this.columnName = columnName;
    this.operator = operator;
    this.value = value;
  }

  toString(): string {
    return `${this.columnName} ${this.operator} '${this.value}'`;
  }
}

export enum SoapFilterOperator {
  BEGINS_WITH = "beginsWith",
  BETWEEN = "between",
  CONTAINS = "contains",
  ENDS_WITH = "endsWith",
  EQUALS = "equals",
  EXISTS_IN_STRING = "existsInString",
  EXISTS_IN_STRING_AS_A_WORD = "existsInStringAsAWord",
  GREATER_THAN = "greaterThan",
  GREATER_THAN_ANNIVERSARY = "greaterThanAnniversary",
  GREATER_THAN_OR_EQUAL = "greaterThanOrEqual",
  IN = "IN",
  IS_ANNIVERSARY = "isAnniversary",
  IS_NOT_ANNIVERSARY = "isNotAnniversary",
  IS_NOT_NULL = "isNotNull",
  IS_NULL = "isNull",
  LESS_THAN = "lessThan",
  LESS_THAN_ANNIVERSARY = "lessThanAnniversary",
  LESS_THAN_OR_EQUAL = "lessThanOrEqual",
  LIKE = "like",
  NOT_CONTAINS = "notContains",
  NOT_EQUALS = "notEquals",
  NOT_EXISTS_IN_STRING = "notExistsInString",
}

export const createFilterXml = (filters: SfmcSoapFilter[], logicalOperator: string = "AND"): string => {
  if (filters.length === 0) {
    return "";
  } else if (filters.length === 1) {
    const filter = filters[0];
    return `<Filter xsi:type="SimpleFilterPart">
              <Property>${filter.columnName}</Property>
              <SimpleOperator>${filter.operator}</SimpleOperator>
              <Value>${filter.value}</Value>
            </Filter>`;
  } else {
    const leftOperand = filters[0];
    const remainingFilters = filters.slice(1);
    const remainingXml = createFilterXml(remainingFilters, logicalOperator);

    const rightOperandType = remainingFilters.length > 1 ? "ComplexFilterPart" : "SimpleFilterPart";

    return `<Filter xsi:type="ComplexFilterPart">
              <LeftOperand xsi:type="SimpleFilterPart">
                <Property>${leftOperand.columnName}</Property>
                <SimpleOperator>${leftOperand.operator}</SimpleOperator>
                <Value>${leftOperand.value}</Value>
              </LeftOperand>
              <LogicalOperator>${logicalOperator}</LogicalOperator>
              <RightOperand xsi:type="${rightOperandType}">
                ${remainingXml.replace(`<Filter xsi:type="${rightOperandType}">`, "").replace("</Filter>", "")}
              </RightOperand>
            </Filter>`;
  }
};

