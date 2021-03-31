import { IScenarioIoPair } from "./interfacesAndEnums";

export function sortScenariosBestToWorst( scenarios: IScenarioIoPair[] ): IScenarioIoPair[]
{
    return scenarios.sort( ( a, b ) => a.scenarioSummary.numMonthsToReachRetirementGoal - b.scenarioSummary.numMonthsToReachRetirementGoal );
}