/// <reference path="./types.ts" />

import { SfmcHelper as SfmcHelperClass } from "./sfmc-helper";

export const initializeSfmcHelper = SfmcHelperClass.initialize;
const SfmcHelper = SfmcHelperClass.initialize;
export default SfmcHelper;

export enum ComparisonEnum {
    Equal = "eq",
    NotEqual = "ne",
    LargerThan = "lt",
    LowerOrEqual = "le",
    GreaterThan = "gt",
    GreaterOrEqual = "ge",
  }
  
