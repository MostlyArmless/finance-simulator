import { IMonthsToRetirement, IScenarioIoPair } from '../../interfacesAndEnums';
import { ScenarioTable } from '../ScenarioTable/ScenarioTable';
import styles from './ScenarioView.module.css';
import { PlotData } from 'plotly.js';
import React from 'react';
import { LinSpace } from '../../tools';
import createPlotlyComponent from "react-plotly.js/factory";
const Plotly = window.Plotly;
const Plot = createPlotlyComponent( Plotly );

interface ScenarioViewProps
{
    scenarios: IScenarioIoPair[];
}

interface ScenarioViewState
{
    selectedScenarioIndex: number;
}

const initialState: ScenarioViewState = {
    selectedScenarioIndex: 0
}

function getTraces( scenario: IScenarioIoPair ): Partial<PlotData>[]
{
    let traces: Partial<PlotData>[] = [];
    scenario.forecastResult.debts.forEach( debt =>
    {
        const trace: Partial<PlotData> = {
            name: debt.name,
            x: LinSpace( 0, 1, debt.GetBalances().length ),
            y: debt.GetBalances(),
            type: 'scatter',
            mode: 'lines+markers'
        };

        traces.push( trace );
    } );

    return traces;
}

export class ScenarioView extends React.Component<ScenarioViewProps, ScenarioViewState>
{
    constructor( props: ScenarioViewProps )
    {
        super( props );
        this.state = initialState;
    }

    getSortedMonthsToRetirementData = ( output: IScenarioIoPair[] ): IMonthsToRetirement[] =>
    {
        const scenarioNames = output.map( scenarioIoPair => scenarioIoPair.scenarioSummary.scenarioName );
        const monthsToRetirements = output.map( scenarioIoPair => scenarioIoPair.forecastResult.numMonthsToReachRetirementGoal );

        let data = [];
        for ( let i = 0; i < monthsToRetirements.length; i++ )
        {
            data.push( {
                monthsRequiredToRetire: monthsToRetirements[i],
                scenarioName: scenarioNames[i]
            } );
        }
        // Sort from best to worst (smallest to largest monthsToRetirement)
        data.sort( ( a, b ) => { return a.monthsRequiredToRetire - b.monthsRequiredToRetire; } );
        return data;
    }

    componentWillReceiveProps()
    {
        if ( this.props.scenarios.length === 0 )
            return;

        const sortedResults = this.getSortedMonthsToRetirementData( this.props.scenarios );
        const bestScenarioName = sortedResults[0].scenarioName;
        const bestScenarioIndex = this.props.scenarios.findIndex( ( scenario ) => { return scenario.scenarioSummary.scenarioName === bestScenarioName; } );
        this.setState( { selectedScenarioIndex: bestScenarioIndex } );
    }

    HandleDropdownChange = ( event: React.ChangeEvent<HTMLSelectElement> ) =>
    {
        const selectedScenarioName = event.target.value;
        this.setState( {
            selectedScenarioIndex: this.props.scenarios.findIndex( result => result.scenarioSummary.scenarioName === selectedScenarioName )
        } );
    }

    render()
    {
        const selectedScenario = this.props.scenarios[this.state.selectedScenarioIndex];
        if ( !selectedScenario )
            return null;

        const menuOptions = this.getDropdownItems();

        const maxMonths = this.props.scenarios
            .map( scenario => scenario.forecastResult.totalDebtVsTime.length )
            .reduce( ( a, b ) => Math.max( a, b ) );

        return (
            <div className={ styles.ScenarioView } >
                <select name='forecastSelect' onChange={ this.HandleDropdownChange }>
                    { menuOptions }
                </select>
                <div className={ styles.GridContainer }>
                    <div className={ styles.item1 }>
                        <ScenarioTable
                            summary={ selectedScenario.scenarioSummary } />
                    </div>

                    <div className={ styles.item2 }>
                        <Plot
                            data={ getTraces( selectedScenario ) }
                            layout={ {
                                width: 800,
                                height: 600,
                                xaxis: { range: [0, maxMonths] }
                            } }
                        />
                    </div>
                </div>
            </div>
        );
    }

    private getDropdownItems()
    {
        return this.props.scenarios
            .slice()
            .map( scenario =>
            {
                const name = scenario.scenarioSummary.scenarioName;
                return <option key={ name } value={ name }>{ name }</option>;
            }
            );
    }
}