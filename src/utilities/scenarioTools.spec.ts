import { IForecastResult } from "../interfacesAndEnums";
import { findIndicesOfBestNScenarios } from "./scenarioTools";

const forecastResults: IForecastResult[] = [
  {
    numMonthsToReachRetirementGoal: 1,
    savingsOverTime: [],
    incomesOverTime: [],
    debts: [],
    totalDebtVsTime: [],
    requiredSavingsToRetire: 0,
  },
  {
    numMonthsToReachRetirementGoal: 5,
    savingsOverTime: [],
    incomesOverTime: [],
    debts: [],
    totalDebtVsTime: [],
    requiredSavingsToRetire: 0,
  },
  {
    numMonthsToReachRetirementGoal: 2,
    savingsOverTime: [],
    incomesOverTime: [],
    debts: [],
    totalDebtVsTime: [],
    requiredSavingsToRetire: 0,
  }
];


describe( findIndicesOfBestNScenarios.name, () =>
{
  it( 'finds the scenarios with the shortest time until retirement', (): void =>
  {
    const bestIndices = findIndicesOfBestNScenarios( forecastResults, 2 );
    expect( bestIndices ).toEqual( [0, 2] );
  } );
} )