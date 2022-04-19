import { IScenarioIoPair } from '../../interfacesAndEnums';
import { ScenarioTable } from '../ScenarioTable/ScenarioTable';
import styles from './ScenarioView.module.css';
import { PlotData } from 'plotly.js';
import React, { useState } from 'react';
import { LinSpace } from '../../tools';
import createPlotlyComponent from 'react-plotly.js/factory';
import { summarizeForecastResult } from '../../summarize';
import { ResultsMissing } from '../ResultsMissing/ResultsMissing';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent( Plotly );

interface ScenarioViewProps
{
  scenarios: IScenarioIoPair[];
}

function getTraces( scenario: IScenarioIoPair ): Partial<PlotData>[]
{
  const traces: Partial<PlotData>[] = [];
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

export function ScenarioView( props: ScenarioViewProps )
{
  const [selectedScenarioIndex,
    setSelectedScenarioIndex] = useState<number>( 0 );

  const handleDropdownChange = ( event: React.ChangeEvent<HTMLSelectElement> ) =>
  {
    const selectedScenarioName = event.target.value;
    const index = props.scenarios.findIndex( result => result.forecastInput.forecastName === selectedScenarioName );
    setSelectedScenarioIndex( index );
  };

  const selectedScenario = props.scenarios[selectedScenarioIndex];
  if ( !selectedScenario )
    return null;
  if ( props.scenarios[0].forecastResult.debts.length === 0 )
    return <ResultsMissing />;

  const summary = summarizeForecastResult( selectedScenario.forecastInput, selectedScenario.forecastResult );

  const maxMonths = props.scenarios
    .map( scenario => scenario.forecastResult.totalDebtVsTime.length )
    .reduce( ( a, b ) => Math.max( a, b ) );

  const maxInitialDebt = props.scenarios[0].forecastResult.debts
    .map( debt => debt.GetBalanceAtMonth( 0 ) )
    .reduce( ( a, b ) => Math.max( a, b ) );

  return (
    <div className={ styles.ScenarioView } >
      <select name='forecastSelect'
        onChange={ handleDropdownChange }
      >
        { props.scenarios.map( scenario =>
        {
          const name = scenario.forecastInput.forecastName;
          return <option key={ name }
            value={ name }
          >{ name }</option>;
        } )
        }
      </select>
      <div className={ styles.GridContainer }>
        <div className={ styles.item1 }>
          <ScenarioTable
            summary={ summary }
          />
        </div>

        <div className={ styles.item2 }>
          <Plot
            data={ getTraces( selectedScenario ) }
            layout={ {
              width: 800,
              height: 600,
              xaxis: { range: [0,
                maxMonths] },
              yaxis: { range: [0,
                maxInitialDebt] }
            } }
          />
        </div>
      </div>
    </div>
  );
}