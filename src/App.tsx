import './App.css';
import {
  IForecastInput,
  IForecastResult,
  IncomeEndCondition,
  IncomeStartCondition,
  IScenarioIoPair,
} from './interfacesAndEnums';
import { GetDummyScenarioData } from './dummyScenariosData';
import { DataEntryPage } from './components/DataEntryPage';
import { ResultsPage } from './components/ResultsPage/ResultsPage';
import { IncomeModel, NullIncomeModelInput } from './IncomeModel';
import { DebtModel, NullDebtModelInput } from './DebtModel';
import Container from '@material-ui/core/Container';
import { forecast } from './forecast';
import { cloneDeep, debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { SimulationAllResultsComparison } from './components/SimulationAllResultsComparison/SimulationAllResultsComparison';
import { Grid } from '@material-ui/core';
import produce from 'immer';
import { nullForecastResult, nullForecastInput } from './fixtures/forecastFixtures';

const initialState: IScenarioIoPair[] = GetDummyScenarioData().map( input =>
{
  return {
    forecastInput: input,
    forecastResult: cloneDeep( nullForecastResult )
  };
} );

const emptyState: IScenarioIoPair[] = [{
  forecastInput: cloneDeep( nullForecastInput ),
  forecastResult: cloneDeep( nullForecastResult )
}];

function App()
{
  const [scenarios, setScenarios] = useState<IScenarioIoPair[]>( initialState );
  
  const inputs = scenarios.map(scenario => scenario.forecastInput);
  const debouncedForecast = debounce((inputs: IForecastInput[]): IForecastResult[] => {
    console.log('Running forecast');
    return inputs.map(input => forecast(input));
  }, 60000);

  useEffect(() => {
    console.log('Inside useEffect');
    const results = debouncedForecast(inputs);
    if (results) {
      const newState: IScenarioIoPair[] = inputs.map((input, index) => {
        return {
          forecastInput: input,
          forecastResult: results[index]
        };
      });
      setScenarios(newState);
    }
  }, [inputs]);

  const loadSampleData = () =>
  {
    const dummyInputs = GetDummyScenarioData();
    const sampleData = dummyInputs.map( input => {
      return {
        forecastInput: input,
        forecastResult: cloneDeep( nullForecastResult )
      };
    });
    setScenarios(sampleData);
  };

  const resetScenarios = () => {
    setScenarios( emptyState );
  };

  const addNewScenario = () =>
  {
    setScenarios( produce(draftState =>
    {
      draftState.push( {
        forecastInput: cloneDeep( nullForecastInput ),
        forecastResult: cloneDeep( nullForecastResult )
      } );
    }));
  };

  const addNewIncome = ( scenarioIndex: number ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.incomes
        .push( new IncomeModel( new NullIncomeModelInput() ) );
    }));
  };

  const removeIncome = ( scenarioIndex: number, incomeIndexToRemove: number ): void =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.incomes = draftState[scenarioIndex].forecastInput.incomes
        .filter( ( income, index ) => index !== incomeIndexToRemove );
    }));
  };

  const setIncomeName = ( scenarioIndex: number, incomeIndex: number, val: string ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.incomes[incomeIndex].name = val;
    }));
  };

  const setMonthlyValue = ( scenarioIndex: number, incomeIndex: number, val: number ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.incomes[incomeIndex].monthlyValue = val;
    }));
  };

  const setStartCondition = ( scenarioIndex: number, incomeIndex: number, val: IncomeStartCondition ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.incomes[incomeIndex].startCondition = val;
    }));
  };

  const setEndCondition = ( scenarioIndex: number, incomeIndex: number, val: IncomeEndCondition ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.incomes[incomeIndex].endCondition = val;
    }));
  };

  const setIncomeEndDate = ( scenarioIndex: number, incomeIndex: number, val: Date ) =>
  {
    setScenarios( produce( draftState  =>
    {
      draftState[scenarioIndex].forecastInput.incomes[incomeIndex].endDate = val;
    }));
  };

  const addNewDebt = ( scenarioIndex: number ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.debts
        .push( new DebtModel( new NullDebtModelInput() ) );
    }));
  };

  const removeDebt = ( scenarioIndex: number, debtIndexToRemove: number ): void =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.debts = draftState[scenarioIndex].forecastInput.debts
        .filter( ( income, index ) => index !== debtIndexToRemove );
    }));
  };

  const setDebtName = ( scenarioIndex: number, debtIndex: number, val: string ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.debts[debtIndex].name = val;
    }));
  };

  const setDebtInitialBalance = ( scenarioIndex: number, debtIndex: number, val: number ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.debts[debtIndex].initialBalance = val;
    }));
  };

  const setDebtInterestRate = ( scenarioIndex: number, debtIndex: number, val: number ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.debts[debtIndex].interestRate = val;
    }));
  };

  const setDebtMinPayment = ( scenarioIndex: number, debtIndex: number, val: number ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.debts[debtIndex].minPayment = val;
    }));
  };

  const setDebtIsMortgage = ( scenarioIndex: number, debtIndex: number, val: boolean ) =>
  {
    setScenarios( produce( draftState =>
    {
      draftState[scenarioIndex].forecastInput.debts[debtIndex].isMortgage = val;
    }));
  };

  const runSimulation = () =>
  {
    const results = scenarios.map( scenario =>
    {
      return forecast( scenario.forecastInput );
    } );

    setScenarios( produce( draftState =>
    {
      draftState.forEach( ( scenario, index ) =>
      {
        scenario.forecastResult = results[index];
      } );
    }));
  };

  return (
    <Container className="App">
      <Grid container>
        <Grid item
          xs={ 6 }
        >
          <DataEntryPage
            loadSampleData={ loadSampleData }
            resetScenarios={ resetScenarios }
            runSimulation={ runSimulation }
            addNewScenario={ addNewScenario }
            scenarioNames={ scenarios.map(scenario => scenario.forecastInput.forecastName) }
            incomeModels={ scenarios.map(scenario => scenario.forecastInput.incomes) }
            addNewIncome={ addNewIncome }
            removeIncome={ removeIncome }
            setIncomeName={ setIncomeName }
            setIncomeMonthlyValue={ setMonthlyValue }
            setIncomeStartCondition={ setStartCondition }
            setIncomeEndCondition={ setEndCondition }
            setIncomeEndDate={ setIncomeEndDate }
            debtModels={ scenarios.map(scenario => scenario.forecastInput.debts) }
            addNewDebt={ addNewDebt }
            removeDebt={ removeDebt }
            setDebtName={ setDebtName }
            setDebtInitialBalance={ setDebtInitialBalance }
            setDebtInterestRate={ setDebtInterestRate }
            setDebtMinPayment={ setDebtMinPayment }
            setDebtIsMortgage={ setDebtIsMortgage }
          />
        </Grid>
        <Grid item
          xs={ 6 }
        >
          <SimulationAllResultsComparison scenarios={ scenarios } />
        </Grid>
        <ResultsPage
          runSimulation={ runSimulation }
          scenarios={ scenarios }
        />
      </Grid>
    </Container>
  );
}

export default App;