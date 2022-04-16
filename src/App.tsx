import './App.css';
import {
  IncomeEndCondition,
  IncomeStartCondition,
  IScenarioIoPair,
} from './interfacesAndEnums';
import { GetDummyScenarioData } from './dummyScenariosData';
import { DataEntryPage } from './components/DataEntryPage';
import { ResultsPage } from './components/ResultsPage/ResultsPage';
import { IncomeModel, NullIncomeModelInput } from './IncomeModel';
import { DebtModel, NullDebtModelInput } from './DebtModel';
import { useImmer } from 'use-immer';
import Container from '@material-ui/core/Container';
import { forecast } from './forecast';
import { nullForecastInput, nullForecastResult } from './constants';
import { cloneDeep } from 'lodash';

const initialState: IScenarioIoPair[] = GetDummyScenarioData().map(input => {
  return {
    forecastInput: input,
    forecastResult: cloneDeep(nullForecastResult)
  }
});

function App()
{
  const [scenarios, setScenarios] = useImmer<IScenarioIoPair[]>( initialState );
  
  // ! TODO figure out how to useCallback, debounce, and useEffect together.
  // const inputs = scenarios.map(scenario => scenario.forecastInput);
  // const debouncedForecast = useCallback(debounce((inputs: IForecastInput[]): IForecastResult[] => {
  //   return inputs.map(input => forecast(input));
  // }, 500), [])

  // useEffect(() => {
  //   //! TODO - sort scenarios best to worst here
  //   const results = debouncedForecast(inputs);
  //   setScenarios((draftState) => {
  //     draftState.forEach((ioPair, index) => ioPair.forecastResult = results[index]);
  //   });
  // }, [inputs, setScenarios]);

  const loadSampleData = () => {
    const dummyData = GetDummyScenarioData();
    setScenarios((draftState) => {
      draftState = dummyData.map(input => {
        return {
          forecastInput: input,
          forecastResult: initialState[0].forecastResult
        };
      });
    });
  }

  const addNewScenario = () => {
    setScenarios(draftState => {
      draftState.push({
        forecastInput: cloneDeep(nullForecastInput),
        forecastResult: cloneDeep(nullForecastResult)
      })
    });
  }

  const addNewIncome = (scenarioIndex: number) => {
    setScenarios((draftState) => {
      draftState[scenarioIndex].forecastInput.incomes
        .push(new IncomeModel(new NullIncomeModelInput()));
    });
  }

  const removeIncome = ( scenarioIndex: number, incomeIndexToRemove: number ): void =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.incomes
        .filter((income, index) => index !== incomeIndexToRemove );
    });
  }

  const setIncomeName = ( scenarioIndex: number, incomeIndex: number, val: string ) =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.incomes[incomeIndex].name = val;
    });
  }

  const setMonthlyValue = ( scenarioIndex: number, incomeIndex: number, val: number ) =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.incomes[incomeIndex].monthlyValue = val;
    });
  }

  const setStartCondition = ( scenarioIndex: number, incomeIndex: number, val: IncomeStartCondition ) =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.incomes[incomeIndex].startCondition = val;
    });
  }

  const setEndCondition = ( scenarioIndex: number, incomeIndex: number, val: IncomeEndCondition ) =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.incomes[incomeIndex].endCondition = val;
    });
  }

  const setIncomeEndDate = ( scenarioIndex: number, incomeIndex: number, val: Date ) =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.incomes[incomeIndex].endDate = val;
    });
  }

  const addNewDebt = (scenarioIndex: number) => {
    setScenarios((draftState) => {
      draftState[scenarioIndex].forecastInput.debts
        .push(new DebtModel(new NullDebtModelInput()));
    });
  }

  const removeDebt = ( scenarioIndex: number, debtIndexToRemove: number ): void =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.debts
        .filter((income, index) => index !== debtIndexToRemove );
    });
  }

  const setDebtName = ( scenarioIndex: number, debtIndex: number, val: string ) =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.debts[debtIndex].name = val;
    });
  }

  const setDebtInitialBalance = ( scenarioIndex: number, debtIndex: number, val: number ) =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.debts[debtIndex].initialBalance = val;
    });
  }

  const setDebtInterestRate = ( scenarioIndex: number, debtIndex: number, val: number ) =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.debts[debtIndex].interestRate = val;
    });
  }
  
  const setDebtMinPayment = ( scenarioIndex: number, debtIndex: number, val: number ) =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.debts[debtIndex].minPayment = val;
    });
  }
  
  const setDebtIsMortgage = ( scenarioIndex: number, debtIndex: number, val: boolean ) =>
  {
    setScenarios((draftState): void => {
      draftState[scenarioIndex].forecastInput.debts[debtIndex].isMortgage = val;
    });
  }

  const runSimulation = () => {
    const results = scenarios.map(scenario => {
      return forecast(scenario.forecastInput);
    });

    setScenarios((draftState): void => {
      draftState.forEach((scenario, index) => {
        scenario.forecastResult = results[index];
      })
    })
  }

  return (
    <Container className="App">
      <DataEntryPage
        loadSampleData={ loadSampleData }
        addNewScenario={ addNewScenario }
        scenarioNames={scenarios.map(scenario => scenario.forecastInput.forecastName)}
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
      <br />
      <ResultsPage
        runSimulation={ runSimulation }
        scenarios={ scenarios }
      />
    </Container>
  )
}

export default App;