import { Button, createStyles, Grid, makeStyles, Paper, Theme } from '@material-ui/core';
import { IDebt, IIncome, IncomeEndCondition, IncomeStartCondition } from '../interfacesAndEnums';
import { Debt } from './Debt';
import { useState } from 'react';
import { Income } from './Income/Income';

const scaleFactor = 0.9;
const cardWidth = 240;
const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
    root: {
      flexGrow: 1,
    },
    incomePaper: {
      zoom: scaleFactor,
      height: 360,
      width: cardWidth,
    },
    debtPaper: {
      zoom: scaleFactor,
      height: 400,
      width: cardWidth,
    },
  } ),
);

interface DataEntryPageProps
{
  loadSampleData(): void;

  scenarioNames: string[];
  addNewScenario(): void;

  // Income
  incomeModels: IIncome[][];
  addNewIncome( scenarioIndex: number ): void;
  removeIncome( scenarioIndex: number, incomeIndex: number ): void;

  setIncomeName( scenarioIndex: number, incomeIndex: number, val: string ): void;
  setIncomeMonthlyValue( scenarioIndex: number, incomeIndex: number, val: number ): void;
  setIncomeStartCondition( scenarioIndex: number, incomeIndex: number, val: IncomeStartCondition ): void;
  setIncomeEndCondition( scenarioIndex: number, incomeIndex: number, val: IncomeEndCondition ): void;
  setIncomeEndDate( scenarioIndex: number, incomeIndex: number, val: Date ): void;

  // Debt
  debtModels: IDebt[][];
  addNewDebt( scenarioIndex: number ): void;
  removeDebt( scenarioIndex: number, debtIndex: number ): void;

  setDebtName( scenarioIndex: number, debtIndex: number, val: string ): void;
  setDebtInitialBalance( scenarioIndex: number, debtIndex: number, val: number ): void;
  setDebtInterestRate( scenarioIndex: number, debtIndex: number, val: number ): void;
  setDebtMinPayment( scenarioIndex: number, debtIndex: number, val: number ): void;
  setDebtIsMortgage( scenarioIndex: number, debtIndex: number, val: boolean ): void;
}

export function DataEntryPage( props: DataEntryPageProps )
{
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>( 0 );
  const classes = useStyles();

  return (
    <div>
      <h1>Data Entry</h1>
      <Button onClick={ props.loadSampleData }>Load Sample Data</Button>

      <select
        name='scenarioSelect'
        onChange={ ( event ) => setCurrentScenarioIndex( parseInt( event.target.value ) ) }
      >
        { props.scenarioNames.map( ( name: string, index: number ) =>
        {
          return <option key={ index } value={ index }>{ name }</option>;
        } ) }
      </select>
      <Button
        variant="outlined"
        color="secondary"
        onClick={ () => props.addNewScenario() }
      >Add Scenario</Button>

      {/* Grid component with border and rounded edges and drop shadow */}
      <Grid key="incomes" container className={ classes.incomePaper } justify="center" spacing={ 2 } direction="row">
        { props.incomeModels[currentScenarioIndex]
          .map( ( incomeModel, incomeIndex ) =>
          {
            return (
              <Grid key={ `grid-${incomeIndex}` } item>
                <Paper key={ `paper-${incomeIndex}` } className={ classes.incomePaper }>
                  <Income
                    key={ `{income-${incomeIndex}` }
                    name={ incomeModel.name }
                    monthlyValue={ incomeModel.monthlyValue }
                    startCondition={ incomeModel.startCondition }
                    endCondition={ incomeModel.endCondition }
                    endDate={ incomeModel.endDate }
                    setName={ ( val: string ) => props.setIncomeName( currentScenarioIndex, incomeIndex, val ) }
                    setMonthlyValue={ ( val: number ) => props.setIncomeMonthlyValue( currentScenarioIndex, incomeIndex, val ) }
                    setStartCondition={ ( val: IncomeStartCondition ) => props.setIncomeStartCondition( currentScenarioIndex, incomeIndex, val ) }
                    setEndCondition={ ( val: IncomeEndCondition ) => props.setIncomeEndCondition( currentScenarioIndex, incomeIndex, val ) }
                    setEndDate={ ( val: Date ) => props.setIncomeEndDate( currentScenarioIndex, incomeIndex, val ) }
                    removeIncome={ () => props.removeIncome( currentScenarioIndex, incomeIndex ) }
                    shouldDisplayDeleteButton={ props.incomeModels.length > 1 }
                  />
                </Paper>
              </Grid>
            )
          } ) }

        { props.incomeModels.length < 4 &&
          <Button
            variant="outlined"
            color="secondary"
            onClick={ () => props.addNewIncome( currentScenarioIndex ) }
          >Add Income</Button>
        }
      </Grid>

      <Grid key="debts" container className={ classes.debtPaper } justify="center" spacing={ 2 } direction="row">
        { props.debtModels[currentScenarioIndex].map( ( debtModel, debtIndex ) =>
        {
          return (
            <Grid key={ `grid-${debtIndex}` } item>
              <Paper key={ `paper-${debtIndex}` } className={ classes.debtPaper }>
                <Debt
                  key={ `{debt-${debtIndex}` }
                  name={ debtModel.name }
                  initialBalance={ debtModel.initialBalance }
                  interestRate={ debtModel.interestRate }
                  minPayment={ debtModel.minPayment }
                  isMortgage={ debtModel.isMortgage }
                  setName={ ( val: string ) => props.setDebtName( currentScenarioIndex, debtIndex, val ) }
                  setInitialBalance={ ( val: number ) => props.setDebtInitialBalance( currentScenarioIndex, debtIndex, val ) }
                  setInterestRate={ ( val: number ) => props.setDebtInterestRate( currentScenarioIndex, debtIndex, val ) }
                  setMinPayment={ ( val: number ) => props.setDebtMinPayment( currentScenarioIndex, debtIndex, val ) }
                  setIsMortgage={ ( val: boolean ) => props.setDebtIsMortgage( currentScenarioIndex, debtIndex, val ) }
                  removeDebt={ () => props.removeDebt( currentScenarioIndex, debtIndex ) }
                  shouldDisplayDeleteButton={ props.debtModels.length > 1 }
                />
              </Paper>
            </Grid>
          )
        } ) }

        { props.incomeModels.length < 4 &&
          <Button variant="outlined" color="secondary" onClick={ () => props.addNewDebt( currentScenarioIndex ) }>Add Debt</Button>
        }
      </Grid>

    </div>
  );
}