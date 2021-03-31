import React from 'react';
import './App.css';
import { ForecastScenarioRunner } from './forecastScenarioRunner';
import { BuildForecastScenarios } from './forecastScenarioFactory';
import { IScenarioIoPair } from './interfacesAndEnums';
import { ScenarioView } from './components/ScenarioView/ScenarioView';
import { SimulationAllResultsComparison } from './components/SimulationAllResultsComparison/SimulationAllResultsComparison';

interface AppState
{
  allScenarios: IScenarioIoPair[];
}

interface AppProps
{
}

const initialState: AppState = {
  allScenarios: []
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

  RunAndPlot = () =>
  {
    const runner = new ForecastScenarioRunner( BuildForecastScenarios() );
    const result = runner.runForecasts();
    this.setState( {
      allScenarios: result
    } );
  }

  Reset = () =>
  {
    this.setState( initialState );
  }

  render()
  {
    return (
      <div className="App" >
        <button onClick={ this.Reset }>Reset</button>
        <button onClick={ this.RunAndPlot }>Run Simulation</button>

        {this.state.allScenarios.length > 0 &&
          <>
            <SimulationAllResultsComparison scenarios={ this.state.allScenarios } />
            <table>
              <tr>
                <td><ScenarioView scenarios={ this.state.allScenarios } /></td>
                <td><ScenarioView scenarios={ this.state.allScenarios } /></td>
              </tr>
            </table>
          </> }
      </div>
    );
  }


}

export default App;