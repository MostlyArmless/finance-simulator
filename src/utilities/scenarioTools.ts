import { IForecastResult } from '../interfacesAndEnums';

interface IForecastResultWithIndex extends IForecastResult
{
  index?: number;
}

export function findIndicesOfBestNScenarios( results: IForecastResult[], n: number ): number[]
{

  const resultsCopy: IForecastResultWithIndex[] = [...results];
  resultsCopy.map( ( result, index ) =>
  {
    result.index = index;
  } );

  resultsCopy.sort( ( a, b ) => a.numMonthsToReachRetirementGoal - b.numMonthsToReachRetirementGoal );
  const bestIndices: number[] = [];
  for ( let i = 0; i < n; i++ )
  {
    bestIndices.push( resultsCopy[i].index ?? 0 );
  }
  return bestIndices;
}