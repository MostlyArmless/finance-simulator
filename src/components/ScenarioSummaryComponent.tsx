import { IScenarioSummary } from "../interfacesAndEnums";
import { formatNumberAsDollars } from "../tools";

export function ScenarioSummaryComponent( props: { summary: IScenarioSummary } )
{
    return (
        <>
            <div className="scenario-summary">
                <p>Scenario Name: { props.summary.scenarioName }</p>
                <p>Pre-retirement budget: { formatNumberAsDollars( props.summary.preRetirementSpending ) }</p>
                <p>Post-retirement budget: { formatNumberAsDollars( props.summary.postRetirementSpending ) }</p>
                <p>Required Savings to Retire: { formatNumberAsDollars( props.summary.requiredSavingsToRetire ) }</p>
                <p>Retirement Date: { props.summary.retirementDate }</p>
                <p>Months until retirement: { props.summary.numMonthsToReachRetirementGoal }</p>
            </div>
        </>
    );
}