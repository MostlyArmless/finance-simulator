import { IForecastResult } from "./interfacesAndEnums";

export const nameCharacterLimit: number = 25;

export const nullForecastResult: IForecastResult = {
  numMonthsToReachRetirementGoal: Number.POSITIVE_INFINITY,
  requiredSavingsToRetire: Number.POSITIVE_INFINITY,
  debts: [],
  incomesOverTime: [],
  savingsOverTime: [],
  totalDebtVsTime: [],
};