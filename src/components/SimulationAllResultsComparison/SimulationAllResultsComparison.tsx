import { IScenarioIoPair } from '../../interfacesAndEnums';
import styles from './SimulationAllResultsComparison.module.css';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent( Plotly );

interface SimulationAllResultsComparisonProps
{
    scenarios: IScenarioIoPair[];
}

export function SimulationAllResultsComparison(props: SimulationAllResultsComparisonProps)
{
  // Sort scenarios by time until retirement
  const sortedScenarios = [...props.scenarios]
    .sort( (a, b) => a.forecastResult.numMonthsToReachRetirementGoal - b.forecastResult.numMonthsToReachRetirementGoal );

  const xData = sortedScenarios.map( elem => {
    return elem.forecastResult.numMonthsToReachRetirementGoal === Number.POSITIVE_INFINITY
      ? null
      : elem.forecastResult.numMonthsToReachRetirementGoal;
  } ).reverse();

  const yData = sortedScenarios.map( elem => elem.forecastInput.forecastName ).reverse();
  const labelText = xData.map( x => { return x === null ? 'Retirement Unreachable' : String( x ); } );

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