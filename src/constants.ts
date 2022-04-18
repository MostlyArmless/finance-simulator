import { addNYearsToDate } from "./helpers";
import { DebtContributionStrategy, IForecastInput, IForecastResult } from "./interfacesAndEnums";

export const incomeAndDebtNameCharacterLimit: number = 25;

export const nullForecastInput: IForecastInput = {
  forecastName: "New Scenario",
  initialSavings: 0,
  startDate: new Date(),
  numMonthsToProject: 60,
  overtimeHoursPerMonth: 0,
  incomes: [],
  essentialNonDebtSpendingPreRetirement: 5000,
  debts: [],
  desiredMonthlyBudgetPostRetirement: 6000,
  deathDate: addNYearsToDate(new Date(), 60),
  debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst
};

export const nullForecastResult: IForecastResult = {
  numMonthsToReachRetirementGoal: Number.POSITIVE_INFINITY,
  requiredSavingsToRetire: Number.POSITIVE_INFINITY,
  debts: [],
  incomesOverTime: [],
  savingsOverTime: [],
  totalDebtVsTime: [],
};