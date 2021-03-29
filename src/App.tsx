import React from 'react';
import './App.css';
import createPlotlyComponent from "react-plotly.js/factory";
import { ForecastScenarioRunner } from './forecastScenarioRunner';
import { BuildForecastScenarios } from './forecastScenarioFactory';
import { PlotData } from 'plotly.js';
import { IScenarioIoPair } from './interfacesAndEnums';
import { ForecastOutput, ScenarioSummary } from './forecastData';
import { ScenarioSummaryComponent } from './components/ScenarioSummaryComponent';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent( Plotly );

interface AppState
{
  // output: IScenarioRunnerOutput;
  x: number[][];
  y: number[][];
  debtNames: string[];
  selectedScenario: IScenarioIoPair;

  // Scenario summary info
  scenarioNames: string[];
  monthsToRetirements: number[];
  allScenarioResults: IScenarioIoPair[];
  traces: Partial<PlotData>[];
}

interface AppProps
{
}

const initialState: AppState = {
  x: [],
  y: [],
  scenarioNames: [],
  monthsToRetirements: [],
  debtNames: [],
  selectedScenario: {
    forecastResult: new ForecastOutput(),
    scenarioSummary: new ScenarioSummary()
  },
  allScenarioResults: [],
  traces: []
}

class App extends React.Component<AppProps, AppState>
{

  constructor( props: AppProps )
  {
    super( props );
    this.state = initialState;
  }

  componentDidMount()
  {
    this.RunAndPlot();
  }

  getBestScenario( scenarios: IScenarioIoPair[] ): IScenarioIoPair
  {
    let bestScenario = scenarios[0];
    let minNumMonthsToRetirement = Number.MAX_SAFE_INTEGER;
    scenarios.forEach( scenario =>
    {
      if ( scenario.forecastResult.numMonthsToReachRetirementGoal < minNumMonthsToRetirement )
      {
        bestScenario = scenario;
        minNumMonthsToRetirement = scenario.forecastResult.numMonthsToReachRetirementGoal;
      }
    } );
    return bestScenario;
  }

  RunAndPlot = () =>
  {
    const runner = new ForecastScenarioRunner( BuildForecastScenarios() );
    const output: IScenarioIoPair[] = runner.runForecasts();

    const plottableDebts = output[0].forecastResult.debts.map( debt => debt.GetPlottableDebt() );
    const debtTimeAxes = plottableDebts.map( plottable => plottable.x );
    const debtBalancesOverTime = plottableDebts.map( plottable => plottable.y );
    const debtNames = plottableDebts.map( plottable => plottable.name );

    const bestScenario = this.getBestScenario( output );

    this.setState( {
      x: debtTimeAxes,
      y: debtBalancesOverTime,
      debtNames: debtNames,
      scenarioNames: output.map( scenarioIoPair => scenarioIoPair.scenarioSummary.scenarioName ),
      monthsToRetirements: output.map( scenarioIoPair => scenarioIoPair.forecastResult.numMonthsToReachRetirementGoal ),
      allScenarioResults: output,
      selectedScenario: bestScenario,
      traces: this.getTraces( bestScenario )
    } );
  }

  Reset = () =>
  {
    this.setState( initialState );
  }

  HandleDropdownChange = ( event: React.ChangeEvent<HTMLSelectElement> ) =>
  {
    const selectedScenarioName = event.target.value;
    const selectedResult = this.state.allScenarioResults.filter( result => result.scenarioSummary.scenarioName === selectedScenarioName );
    this.setState( { selectedScenario: selectedResult[0], traces: this.getTraces( selectedResult[0] ) } );
  }

  getSortedMonthsToRetirementData = () =>
  {
    let data = [];
    for ( let i = 0; i < this.state.monthsToRetirements.length; i++ )
    {
      data.push( { months: this.state.monthsToRetirements[i], name: this.state.scenarioNames[i] } );
    }
    // Sort from best to worst (smallest to largest monthsToRetirement)
    data.sort( ( a, b ) => { return b.months - a.months; } );
    return data;
  }

  render()
  {
    const sortedData = this.getSortedMonthsToRetirementData();
    const menuOptions = sortedData.slice().reverse().map( elem => elem.name )
      .map( name =>
        <option key={ name } value={ name }>{ name }</option>
      );

    return (
      <div className="App" >
        <button onClick={ this.RunAndPlot }>Run Simulation</button>
        <button onClick={ this.Reset }>Reset</button>

        <select name='forecastSelect' onChange={ this.HandleDropdownChange }>
          { menuOptions }
        </select>

        <br />

        <ScenarioSummaryComponent
          summary={ this.state.selectedScenario.scenarioSummary }
        />
        <div className="grid-container">
          <div className="grid-item item1">
            <Plot
              data={ this.state.traces }
              layout={ { width: 1024, height: 800, title: `Debts over Time` } }
            />
          </div>
          <div className="grid-item item2">
            <Plot
              data={ [
                {
                  x: sortedData.map( elem => { return elem.months === Number.POSITIVE_INFINITY ? 1 : elem.months } ),
                  y: sortedData.map( elem => elem.name ),
                  type: 'bar',
                  orientation: 'h',
                  text: sortedData.map( elem => { return elem.months === Number.POSITIVE_INFINITY ? "Retirement Unreachable" : String( elem.months ) } ),
                  textposition: 'auto'
                }] }
              layout={ { width: 1000, height: 480, title: 'Months until Retirement', margin: { l: 500 } } }
            />
          </div>
        </div>
      </div>
    );
  }

  private getTraces( dataToPlot: IScenarioIoPair ): Partial<PlotData>[]
  {
    let traces: Partial<PlotData>[] = [];
    dataToPlot.forecastResult.debts.forEach( debt =>
    {
      const plottable = debt.GetPlottableDebt();
      const trace: Partial<PlotData> = {
        name: plottable.name,
        x: plottable.x,
        y: plottable.y,
        type: 'scatter',
        mode: 'lines+markers'
      };

      traces.push( trace );
    } );

    return traces;
  }
}

export default App;