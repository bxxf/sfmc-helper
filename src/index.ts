/// <reference path="./types.ts" />

import { SfmcHelper } from "./sfmc-js";

export const initializeSfmcHelper = SfmcHelper.initialize;
const SfmcJs = SfmcHelper.initialize;
export default SfmcJs;

export enum ComparisonEnum {
  Equal = "eq",
  NotEqual = "ne",
  LargerThan = "lt",
  LowerOrEqual = "le",
  GreaterThan = "gt",
  GreaterOrEqual = "ge",
}
