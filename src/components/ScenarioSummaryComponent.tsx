import { IScenarioSummary } from "../interfacesAndEnums";
import { formatNumberAsDollars } from "../tools";

// TODO - this component probably shouldn't have "Component" in the name, but I've already got a non-React class named ScenarioSummary, so what's the best practice in this situation?
export function ScenarioSummaryComponent( props: { summary: IScenarioSummary } )
{
    return (
        <div className="scenario-summary">
            <h2>Scenario Summary</h2>
            <table>
                <th className="bold-text">Attribute</th><th>Value</th>
                <tr>
                    <td>Scenario Name</td><td className="td-reflow-text">{ props.summary.scenarioName }</td>
                </tr>
                <tr>
                    <td>Pre-retirement budget</td><td>{ formatNumberAsDollars( props.summary.preRetirementSpending ) }</td>
                </tr>
                <tr>
                    <td>Post-retirement budget</td><td>{ formatNumberAsDollars( props.summary.postRetirementSpending ) }</td>
                </tr>
                <tr>
                    <td>Required Savings to Retire</td><td>{ formatNumberAsDollars( props.summary.requiredSavingsToRetire ) }</td>
                </tr>
                <tr>
                    <td>Retirement Date</td><td>{ props.summary.retirementDate }</td>
                </tr>
                <tr>
                    <td>Months until retirement</td><td>{ props.summary.numMonthsToReachRetirementGoal }</td>
                </tr>
            </table>
        </div>
    );
}