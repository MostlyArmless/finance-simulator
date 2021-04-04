import { useState } from 'react';
import './App.css';
import { ForecastScenarioRunner } from './forecastScenarioRunner';
import { IncomeEndCondition, IncomeStartCondition, IScenarioIoPair } from './interfacesAndEnums';
import { GetDummyScenarioData } from './dummyScenariosData';
import { sortScenariosBestToWorst } from './ScenarioSorter';
import { DataEntryPage } from './components/DataEntryPage/DataEntryPage';
import { ResultsPage } from './components/ResultsPage/ResultsPage';
import { IncomeModel, NullIncomeModelInput } from './IncomeModel';
import Container from '@material-ui/core/Container';

enum eAppPage
{
  DataEntry,
  ResultsView
}

function App()
{
  const [allScenarios, setAllScenarios] = useState<IScenarioIoPair[]>( [] );
  const [currentPage, setCurrentPage] = useState<eAppPage>( eAppPage.DataEntry );
  const [incomes, setIncomes] = useState<IncomeModel[]>( [new IncomeModel( new NullIncomeModelInput() )] );

  const setName = ( index: number, val: string ) =>
  {
    setIncomes( ( prev ) =>
    {
      const newState = [...prev];
      newState[index].name = val;
      return newState;
    } );
  }
  const setMonthlyValue = ( index: number, val: number ) =>
  {
    setIncomes( ( prev ) =>
    {
      const newState = [...prev];
      newState[index].monthlyValue = val;
      return newState;
    } );
  }
  const setStartCondition = ( index: number, val: IncomeStartCondition ) =>
  {
    setIncomes( ( prev ) =>
    {
      const newState = [...prev];
      newState[index].startCondition = val;
      return newState;
    } );
  }
  const setEndCondition = ( index: number, val: IncomeEndCondition ) =>
  {
    setIncomes( ( prev ) =>
    {
      const newState = [...prev];
      newState[index].endCondition = val;
      return newState;
    } );
  }
  const setIncomeEndDate = ( index: number, val: Date ) =>
  {
    setIncomes( ( prev ) =>
    {
      const newState = [...prev];
      newState[index].endDate = val;
      return newState;
    } );
  }

  const runAndPlot = () =>
  {
    const runner = new ForecastScenarioRunner( GetDummyScenarioData() );
    const result = sortScenariosBestToWorst( runner.runForecasts() );
    setAllScenarios( result );
  }

  const removeIncome = ( indexToRemove: number ): void =>
  {
    setIncomes( prev => prev.filter( ( income, index ) => index !== indexToRemove ) );
  }

  let page = null;
  switch ( currentPage )
  {
    case eAppPage.DataEntry:
      page = <DataEntryPage
        onClickDone={ () => setCurrentPage( eAppPage.ResultsView ) }
        incomeModels={ incomes }
        addNewIncome={ () => { setIncomes( prev => [...prev, new IncomeModel( new NullIncomeModelInput() )] ) } }
        removeIncome={ removeIncome }
        setName={ setName }
        setMonthlyValue={ setMonthlyValue }
        setStartCondition={ setStartCondition }
        setEndCondition={ setEndCondition }
        setIncomeEndDate={ setIncomeEndDate }
      />;
      break;
    case eAppPage.ResultsView:
      page = <ResultsPage
        runAndPlot={ runAndPlot }
        onClickReturnToDataEntry={ () => setCurrentPage( eAppPage.DataEntry ) }
        scenarios={ allScenarios } />;
      break;
  }

  return (
    <Container className="App">
      { page }
    </Container>
  )
}

export default App;