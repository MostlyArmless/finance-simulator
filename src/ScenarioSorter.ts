import { IScenarioDescription } from "./interfacesAndEnums";

export function sortScenariosBestToWorst( scenarios: IScenarioDescription[] ): IScenarioDescription[]
{
    return scenarios.sort( ( a, b ) => a.scenarioSummary.numMonthsToReachRetirementGoal - b.scenarioSummary.numMonthsToReachRetirementGoal );
}