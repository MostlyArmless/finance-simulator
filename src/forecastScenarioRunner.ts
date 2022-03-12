import { IForecastResult, IScenarioSummary, IScenarioDescription, IForecastInput } from "./interfacesAndEnums";
import { throwIfInvalidScenarioNames } from "./scenarioValidator";
import { forecast } from "./forecast";
import { findLastDefinedValueInArray, addNMonthsToDate } from "./helpers";

export class ForecastScenarioRunner
{
    private forecastScenarios: IForecastInput[];

    constructor( forecastScenarios: IForecastInput[] )
    {
        this.forecastScenarios = forecastScenarios;
    }

    runForecasts(): IScenarioDescription[]
    {
        let output: IScenarioDescription[] = [];

        throwIfInvalidScenarioNames( this.forecastScenarios );

        this.forecastScenarios.forEach( scenario =>
        {
            const forecastResult: IForecastResult = forecast( scenario );

            if ( forecastResult.numMonthsToReachRetirementGoal === null )
            {
                const finalSavings = findLastDefinedValueInArray( forecastResult.savingsOverTime );
                const finalDebt = findLastDefinedValueInArray( forecastResult.totalDebtVsTime );
                console.warn( `You can never retire in this scenario. You die with $${finalSavings} in savings and $${finalDebt} in debts.` );
            }
            else
            {
                console.log( `Retire after ${forecastResult.numMonthsToReachRetirementGoal} months\n` );
            }

            const retirementDateString = forecastResult.numMonthsToReachRetirementGoal < 0 ? "Never" : addNMonthsToDate( scenario.startDate, forecastResult.numMonthsToReachRetirementGoal ).toLocaleDateString();

            // Populate the summary info
            const summary: IScenarioSummary = {
                scenarioName: scenario.forecastName,
                overtimeHoursPerMonth: scenario.overtimeHoursPerMonth,
                preRetirementSpending: scenario.essentialNonDebtSpendingPreRetirement,
                postRetirementSpending: scenario.desiredMonthlyBudgetPostRetirement,
                requiredSavingsToRetire: forecastResult.requiredSavingsToRetire,
                numMonthsToReachRetirementGoal: forecastResult.numMonthsToReachRetirementGoal,
                retirementDate: retirementDateString
            };

            output.push( {
                forecastResult: forecastResult,
                scenarioSummary: summary
            } );
        } );

        return output;
    }
}