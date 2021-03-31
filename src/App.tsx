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

  componentDidMount()
  {
    this.RunAndPlot();
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

  render()
  {
    let page;
    switch ( this.state.pageToDisplay )
    {
      case eAppPage.DataEntry:
        page = <DataEntryPage />;
        break;
      case eAppPage.ResultsView:
        page = <ResultsPage reset={ this.Reset } runAndPlot={ this.RunAndPlot } />;
        break;
      default:
        return null;
    }

    return (
      <div className="App" >
        {page }
      </div >
    );
  }
}

export default App;