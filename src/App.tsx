import './App.css';
import Container from '@material-ui/core/Container';
import { ForecastInput } from './components/ForecastInput/ForecastInput';
import { ForecastInputOutputPair, IForecastInput } from './interfacesAndEnums';
import Button from '@material-ui/core/Button';
import { useState } from 'react';

function App()
{
  // const [simulationResults, setAllSimulationResults] = useState<ISimulationResult[]>( [] );
  // const [incomes, setIncomes] = useState<IncomeModel[]>( [new IncomeModel( new NullIncomeModelInput() )] );
  // const [debts, setDebts] = useState<DebtModel[]>( [new DebtModel( new NullDebtModelInput() )] );
  // const [forecastInput, setForecastInput] = useState<IForecastInput>( new NullForecastInput() );

  const [scenarios, setScenarios] = useState<ForecastInputOutputPair[]>( [] );

  // Can be used to set values of keys at the first layer of depth,
  // e.g. 'forecastName' can be set but sub-fields of 'incomes' cannot be.
  const handleUpdateForecastInputDepth1 = (
    scenarioIndex: number,
    key: keyof IForecastInput,
    value: IForecastInput[keyof IForecastInput] ): void =>
  {
    const updatedScenarios = [...scenarios];
    const scenarioToUpdate = updatedScenarios[scenarioIndex];
    //@ts-ignore
    scenarioToUpdate.input[key] = value;
    setScenarios( updatedScenarios );
  };

  // const handleUpdateIncomes = (
  //   scenarioIndex: number,
  //   incomeIndex: number,
  //   key: keyof IncomeModel,
  //   value: IncomeModel[keyof IncomeModel] ) =>
  // {
  //   const updatedScenarios = [...scenarios];
  //   const scenarioToUpdate = updatedScenarios[scenarioIndex];
  //   const incomeToUpdate = scenarioToUpdate.input.incomes[incomeIndex];
  //   incomeToUpdate[key] = value;
  // };

  // const handleUpdateDebts = (
  //   scenarioIndex: number,
  //   debtIndex: number,
  //   key: keyof IDebt,
  //   value: IDebt[keyof IDebt] ) =>
  // {
  //   const updatedScenarios = [...scenarios];
  //   const scenarioToUpdate = updatedScenarios[scenarioIndex];
  //   const debtToUpdate = scenarioToUpdate.input.debts[debtIndex];
  //   debtToUpdate[key] = value;
  // };

  const runSimulation = () =>
  {
    alert( 'not yet implemented.' );
  }

  return (
    <Container className="App">
      <Button variant="outlined" color="secondary" onClick={ runSimulation }>Run Simulation</Button>
      <ForecastInput
        handleUpdateForecastInputDepth1={ handleUpdateForecastInputDepth1 } />
      {/* <ForecastOutput /> TODO invent this*/ }
    </Container>
  )
}

export default App;