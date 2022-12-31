import { IDebt, IIncome, IncomeEndCondition, IncomeStartCondition } from '../interfacesAndEnums';
import { Debt } from './Debt';
import { useState } from 'react';
import { Income } from './Income/Income';
import { Theme } from '@emotion/react';
import { makeStyles, createStyles, Grid, Paper, Tooltip, ImageList, ImageListItem } from '@material-ui/core';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { ScenarioChooser } from './ScenarioChooser';

const scaleFactor = 0.75;
const cardWidth = 240;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
    incomePaper: {
      zoom: scaleFactor,
      width: cardWidth,
      padding: 6,
      margin: 12
    },
    debtPaper: {
      zoom: scaleFactor,
      width: cardWidth,
      padding: 6,
      margin: 12
    },
    imageList: {
      flexWrap: 'nowrap',
      margin: 8,
      height: 310,
    },
    verticalCenter: {
      margin: 0,
      position: 'relative',
      top: '50%',
      transform: 'translateY( -50% )',
    },
    leftAlign: {
      textAlign: 'left',
    }
  } ),
);

interface DataEntryPageProps
{
  loadSampleData(): void;
  runSimulation(): void;

  scenarioNames: string[];
  addNewScenario(): void;
  resetScenarios(): void;

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
  const [currentScenarioIndex,
    setCurrentScenarioIndex] = useState<number>( 0 );
  const classes = useStyles();

  return (
    <>
      <h1>Data Entry</h1>
      <ScenarioChooser
        runSimulation={ props.runSimulation }
        resetScenarios={ props.resetScenarios }
        className={ classes.leftAlign }
        selectedScenarioIndex={ currentScenarioIndex }
        loadSampleData={ props.loadSampleData }
        setCurrentScenarioIndex={ setCurrentScenarioIndex }
        scenarioNames={ props.scenarioNames }
        addNewScenario={ props.addNewScenario }
      />

      <div>
        <ImageList
          className={ classes.imageList }
        >
          { props.incomeModels[currentScenarioIndex]
            .map( ( incomeModel, incomeIndex ) =>
            {
              return (
                <ImageListItem key={ `ili-${incomeIndex}` }>
                  <Paper key={ `paper-${incomeIndex}` }
                    className={ classes.incomePaper }
                  >
                    <Income
                      key={ `{income-${incomeIndex}` }
                      index={ incomeIndex }
                      model={ incomeModel }
                      setName={ ( val: string ) => props.setIncomeName( currentScenarioIndex, incomeIndex, val ) }
                      setMonthlyValue={ ( val: number ) => props.setIncomeMonthlyValue( currentScenarioIndex, incomeIndex, val ) }
                      setStartCondition={ ( val: IncomeStartCondition ) => props.setIncomeStartCondition( currentScenarioIndex, incomeIndex, val ) }
                      setEndCondition={ ( val: IncomeEndCondition ) => props.setIncomeEndCondition( currentScenarioIndex, incomeIndex, val ) }
                      setEndDate={ ( val: Date ) => props.setIncomeEndDate( currentScenarioIndex, incomeIndex, val ) }
                      removeIncome={ () => props.removeIncome( currentScenarioIndex, incomeIndex ) }
                      shouldDisplayDeleteButton={ props.incomeModels.length > 1 }
                    />
                  </Paper>
                </ImageListItem>
              );
            } ) }

          <ImageListItem>
            <Tooltip title="Add another source of income">
              <AddBoxIcon
                className={ classes.verticalCenter }
                color="primary"
                onClick={ () => props.addNewIncome( currentScenarioIndex ) }
              >
              </AddBoxIcon>
            </Tooltip>
          </ImageListItem>
        </ImageList>
        
        <hr />
        
        <ImageList
          className={ classes.imageList }
        >
          { props.debtModels[currentScenarioIndex].map( ( debtModel, debtIndex ) =>
          {
            return (
              <Grid key={ `grid-${debtIndex}` }
                item
              >
                <Paper key={ `paper-${debtIndex}` }
                  className={ classes.debtPaper }
                >
                  <Debt
                    key={ `{debt-${debtIndex}` }
                    model={ debtModel }
                    index={ debtIndex }
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
            );
          } ) }

          <Grid item>
            <Tooltip title="Add another source of debt">
              <AddBoxIcon
                color="primary"
                onClick={ () => props.addNewDebt( currentScenarioIndex ) }
              >
              </AddBoxIcon>
            </Tooltip>
          </Grid>
        </ImageList>
      </div>
    </>
  );
}