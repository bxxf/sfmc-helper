import { ComparisonOperator } from "sfmc-ts";

export class SfmcFilter {
  columnName: string;
  value: string;
  operator: ComparisonOperator;

  constructor(columnName: string, operator: ComparisonOperator, value: string) {
    this.columnName = columnName;
    this.operator = operator;
    this.value = value;
  }

  toString(): string {
    return `${this.columnName} ${this.operator} '${this.value}'`;
  }
}
