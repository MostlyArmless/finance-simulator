import { IScenarioIoPair } from "./interfacesAndEnums";

export function sortScenariosBestToWorst( scenarios: IScenarioIoPair[] ): IScenarioIoPair[]
{
    return scenarios.sort( ( a, b ) => {
        return a.forecastResult.numMonthsToReachRetirementGoal - b.forecastResult.numMonthsToReachRetirementGoal
     } );
}