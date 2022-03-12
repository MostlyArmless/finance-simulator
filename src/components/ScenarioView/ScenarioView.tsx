import { IScenarioDescription } from '../../interfacesAndEnums';
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
    scenarios: IScenarioDescription[];
}

interface ScenarioViewState
{
    selectedScenarioIndex: number;
}

const initialState: ScenarioViewState = {
    selectedScenarioIndex: 0
}

function getTraces( scenario: IScenarioDescription ): Partial<PlotData>[]
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

        const maxInitialDebt = this.props.scenarios[0].forecastResult.debts
            .map( debt => debt.GetBalanceAtMonth( 0 ) )
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
                                xaxis: { range: [0, maxMonths] },
                                yaxis: { range: [0, maxInitialDebt] }
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
            .map( scenario =>
            {
                const name = scenario.scenarioSummary.scenarioName;
                return <option key={ name } value={ name }>{ name }</option>;
            } );
    }
}