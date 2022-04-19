import { findLastDefinedValueInArray, addNMonthsToDate } from './helpers';
import { IForecastInput, IForecastResult, IScenarioSummary } from './interfacesAndEnums';

export function summarizeForecastResult(input: IForecastInput, result: IForecastResult): IScenarioSummary {
  let retirementPhrase: string;
  if ( result.numMonthsToReachRetirementGoal === null )
  {
    const finalSavings = findLastDefinedValueInArray( result.savingsOverTime );
    const finalDebt = findLastDefinedValueInArray( result.totalDebtVsTime );
    retirementPhrase = `You can never retire in this scenario. You die with $${finalSavings} in savings and $${finalDebt} in debts.`;
  }
  else
  {
    retirementPhrase = `Retire after ${result.numMonthsToReachRetirementGoal} months`;
  }
    
  const retirementDateString = result.numMonthsToReachRetirementGoal < 0
    ? 'Never'
    : addNMonthsToDate( input.startDate, result.numMonthsToReachRetirementGoal ).toLocaleDateString();

  return {
    scenarioName: input.forecastName,
    overtimeHoursPerMonth: input.overtimeHoursPerMonth,
    preRetirementSpending: input.essentialNonDebtSpendingPreRetirement,
    postRetirementSpending: input.desiredMonthlyBudgetPostRetirement,
    requiredSavingsToRetire: result.requiredSavingsToRetire,
    numMonthsToReachRetirementGoal: result.numMonthsToReachRetirementGoal,
    retirementDate: retirementDateString,
    retirementPhrase: retirementPhrase,
  };
}