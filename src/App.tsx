import React from 'react';
import './App.css';
import { ForecastScenarioRunner } from './forecastScenarioRunner';
import { IScenarioIoPair } from './interfacesAndEnums';
import { GetDummyScenarioData } from './dummyScenariosData';
import { sortScenariosBestToWorst } from './ScenarioSorter';
import { DataEntryPage } from './components/DataEntryPage/DataEntryPage';
import { ResultsPage } from './components/ResultsPage/ResultsPage';

enum eAppPage
{
  DataEntry,
  ResultsView
}

interface AppState
{
  allScenarios: IScenarioIoPair[];
  pageToDisplay: eAppPage
}

interface AppProps
{
}

const initialState: AppState = {
  allScenarios: [],
  pageToDisplay: eAppPage.DataEntry
}

class App extends React.Component<AppProps, AppState>
{
  constructor( props: AppProps )
  {
    super( props );
    this.state = initialState;
  }

  RunAndPlot = () =>
  {
    const runner = new ForecastScenarioRunner( GetDummyScenarioData() );
    const result = sortScenariosBestToWorst( runner.runForecasts() );
    this.setState( {
      allScenarios: result
    } );
  }

  Reset = () =>
  {
    this.setState( initialState );
  }

  SwitchToResultsPage = () =>
  {
    this.setState( { pageToDisplay: eAppPage.ResultsView } );
  }

  SwitchToDataEntryPage = () =>
  {
    this.setState( { pageToDisplay: eAppPage.DataEntry } );
  }

  render()
  {
    let page = null;
    switch ( this.state.pageToDisplay )
    {
      case eAppPage.DataEntry:
        page = <DataEntryPage onClickDone={ this.SwitchToResultsPage } />;
        break;
      case eAppPage.ResultsView:
        page = <ResultsPage
          runAndPlot={ this.RunAndPlot }
          onClickReturnToDataEntry={ this.SwitchToDataEntryPage }
          scenarios={ this.state.allScenarios } />;
        break;
    }

    return (
      <div className="App">
        <button onClick={ this.Reset }>Reset</button>
        { page }
      </div>
    )
  }
}
export default App;