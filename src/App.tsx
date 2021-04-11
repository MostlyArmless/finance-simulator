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
import { DebtModel, NullDebtModelInput } from './DebtModel';

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
  const [debts, setDebts] = useState<DebtModel[]>( [new DebtModel( new NullDebtModelInput() )] );

  // TODO - Trying to figure out how to write a SINGLE updater function which can take the income prop key as an arg, but typescript makes this very difficult. come back to this later.
  // type IncomeModelKeyTypes = keyof IncomeModel;
  // type IncomeModelValueTypes = IncomeModel[IncomeModelKeyTypes];
  // const setIncomeState = ( index: number, key: IncomeModelKeyTypes, val: IncomeModelValueTypes ): void =>
  // {
  //   setIncomes( prev =>
  //   {
  //     const newState = [...prev];

  //     // const x = newState[index];
  //     // let y = x[key as keyof IncomeModel];
  //     // y = val as unknown as Pick<IncomeModel, keyof IncomeModel>;
  //     // console.log( y );

  //     newState[index][key] = val;
  //     return newState;
  //   } )
  // }

  const setIncomeName = ( index: number, val: string ) =>
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
  const removeIncome = ( indexToRemove: number ): void =>
  {
    setIncomes( prev => prev.filter( ( income, index ) => index !== indexToRemove ) );
  }

  const runAndPlot = () =>
  {
    const runner = new ForecastScenarioRunner( GetDummyScenarioData() );
    const result = sortScenariosBestToWorst( runner.runForecasts() );
    setAllScenarios( result );
  }

  const removeDebt = ( indexToRemove: number ): void =>
  {
    setDebts( prev => prev.filter( ( debt, index ) => index !== indexToRemove ) );
  }
  const setDebtName = ( index: number, val: string ) =>
  {
    setDebts( prev =>
    {
      const next = [...prev];
      next[index].name = val;
      return next;
    } );
  }
  const setDebtInitialBalance = ( index: number, val: number ) =>
  {
    setDebts( prev =>
    {
      const next = [...prev];
      next[index].initialBalance = val;
      return next;
    } );
  }
  const setDebtInterestRate = ( index: number, val: number ) =>
  {
    setDebts( prev =>
    {
      const next = [...prev];
      next[index].interestRate = val;
      return next;
    } );
  }
  const setDebtMinPayment = ( index: number, val: number ) =>
  {
    setDebts( prev =>
    {
      const next = [...prev];
      next[index].minPayment = val;
      return next;
    } );
  }
  const setDebtIsMortgage = ( index: number, val: boolean ) =>
  {
    setDebts( prev =>
    {
      const next = [...prev];
      next[index].isMortgage = val;
      return next;
    } );
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
        setIncomeName={ setIncomeName }
        setIncomeMonthlyValue={ setMonthlyValue }
        setIncomeStartCondition={ setStartCondition }
        setIncomeEndCondition={ setEndCondition }
        setIncomeIncomeEndDate={ setIncomeEndDate }
        debtModels={ debts }
        addNewDebt={ () => { setDebts( prev => [...prev, new DebtModel( new NullDebtModelInput() )] ) } }
        removeDebt={ removeDebt }
        setDebtName={ setDebtName }
        setDebtInitialBalance={ setDebtInitialBalance }
        setDebtInterestRate={ setDebtInterestRate }
        setDebtMinPayment={ setDebtMinPayment }
        setDebtIsMortgage={ setDebtIsMortgage }
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