import { DebtModel, NullDebtModelInput } from '../DebtModel';
import { addNYearsToDate } from '../helpers';
import { IForecastResult, IForecastInput, DebtContributionStrategy } from '../interfacesAndEnums';

export const nullForecastResult: IForecastResult = {
  numMonthsToReachRetirementGoal: Number.POSITIVE_INFINITY,
  requiredSavingsToRetire: Number.POSITIVE_INFINITY,
  debts: [new DebtModel( new NullDebtModelInput() )],
  incomesOverTime: [],
  savingsOverTime: [],
  totalDebtVsTime: [],
};

export const nullForecastInput: IForecastInput = {
  forecastName: 'New Scenario',
  initialSavings: 0,
  startDate: new Date(),
  numMonthsToProject: 60,
  overtimeHoursPerMonth: 0,
  incomes: [],
  essentialNonDebtSpendingPreRetirement: 5000,
  debts: [],
  desiredMonthlyBudgetPostRetirement: 6000,
  deathDate: addNYearsToDate( new Date(), 60 ),
  debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst
};