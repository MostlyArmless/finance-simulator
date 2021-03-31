import React from 'react';
import { IScenarioIoPair } from '../../interfacesAndEnums';
import styles from './SimulationAllResultsComparison.module.css';
import createPlotlyComponent from "react-plotly.js/factory";
const Plotly = window.Plotly;
const Plot = createPlotlyComponent( Plotly );

interface SimulationAllResultsComparisonProps
{
    scenarios: IScenarioIoPair[];
}

interface SimulationAllResultsComparisonState
{

}

const initialState: SimulationAllResultsComparisonState = {

}

export class SimulationAllResultsComparison extends React.Component<SimulationAllResultsComparisonProps, SimulationAllResultsComparisonState>
{
    constructor( props: SimulationAllResultsComparisonProps )
    {
        super( props );
        this.state = initialState;
    }

    render()
    {
        const xData = this.props.scenarios.map( elem => { return elem.scenarioSummary.numMonthsToReachRetirementGoal === Number.POSITIVE_INFINITY ? null : elem.scenarioSummary.numMonthsToReachRetirementGoal } );
        const yData = this.props.scenarios.map( elem => elem.scenarioSummary.scenarioName );
        const labelText = this.props.scenarios.map( elem => { return elem.scenarioSummary.numMonthsToReachRetirementGoal === Number.POSITIVE_INFINITY ? "Retirement Unreachable" : String( elem.scenarioSummary.numMonthsToReachRetirementGoal ) } );

        return (
            <div className={ styles.SimulationAllResultsComparison } >
                <Plot
                    data={ [
                        {
                            x: xData,
                            y: yData,
                            type: 'bar',
                            orientation: 'h',
                            text: labelText,
                            textposition: 'auto'
                        }] }
                    layout={ { width: 1000, height: 480, title: 'Months until Retirement', margin: { l: 500 } } }
                />
            </div>
        );
    }
}