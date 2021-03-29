import { IScenarioSummary } from "../interfacesAndEnums";

export function ScenarioSummaryComponent( props: { summary: IScenarioSummary } )
{
    return (
        <>
            <div className="scenario-summary">
                <p>Scenario Name: { props.summary.scenarioName }</p>
                <p>Pre-retirement budget: { props.summary.preRetirementSpending }</p>
                <p>Post-retirement budget: { props.summary.postRetirementSpending }</p>
                <p>Required Savings to Retire: { props.summary.requiredSavingsToRetire }</p>
                <p>Retirement Date: { props.summary.retirementDate }</p>
                <p>Months until retirement: { props.summary.numMonthsToReachRetirementGoal }</p>
            </div>
        </>
    );
}