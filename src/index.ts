/// <reference path="./types.ts" />

import { SfmcHelper } from "./sfmc-ts";

export const initializeSfmcHelper = SfmcHelper.initialize;
const SfmcTs = SfmcHelper.initialize;
export default SfmcTs;

export enum ComparisonEnum {
  Equal = "eq",
  NotEqual = "ne",
  LargerThan = "lt",
  LowerOrEqual = "le",
  GreaterThan = "gt",
  GreaterOrEqual = "ge",
}
