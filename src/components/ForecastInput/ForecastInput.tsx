import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { DebtModel, NullDebtModelInput } from '../../DebtModel';
import { GetDummyScenarioData } from '../../dummyScenariosData';
import { addNYearsToDate } from '../../helpers';
import { IncomeModel, NullIncomeModelInput } from '../../IncomeModel';
import { DebtContributionStrategy, IForecastInput, IncomeEndCondition, IncomeStartCondition } from '../../interfacesAndEnums';
import { Debt } from '../Debt/Debt';
import { Income } from '../Income/Income';

const cardWidth = 240;
const useStyles = makeStyles( ( theme: Theme ) =>
    createStyles( {
        root: {
            flexGrow: 1,
        },
        scenarioPaper: {
            height: 360,
            width: cardWidth,
        },
        incomePaper: {
            height: 360,
            width: cardWidth,
        },
        debtPaper: {
            height: 400,
            width: cardWidth,
        },
    } ),
);

const initialValues: IForecastInput = {
    forecastName: 'My Job',
    initialSavings: 10000,
    startDate: new Date(),
    numMonthsToProject: 60,
    overtimeHoursPerMonth: 0,
    incomes: [],
    debts: [],
    essentialNonDebtSpendingPreRetirement: 5000,
    desiredMonthlyBudgetPostRetirement: 4000,
    deathDate: addNYearsToDate( new Date(), 50 ),
    debtContributionStrategy: DebtContributionStrategy.HighestInterestFirst,
}

export interface IForecastInputProps
{
    handleUpdateForecastInputDepth1(
        scenarioIndex: number,
        key: keyof IForecastInput,
        value: IForecastInput[keyof IForecastInput] ): void;
}

export function ForecastInput( props: IForecastInputProps )
{
    const classes = useStyles();

    const [name, setName] = useState<string>( initialValues.forecastName );
    const [initialSavings, setInitialSavings] = useState<number>( initialValues.initialSavings );
    const [startDate, setStartDate] = useState<Date>( initialValues.startDate );
    const [months, setMonths] = useState<number>( initialValues.numMonthsToProject );
    const [overtimeHours, setOvertimeHours] = useState<number>( 0 );
    const [preRetirementSpending, setPreRetirementSpending] = useState<number>( initialValues.essentialNonDebtSpendingPreRetirement );
    const [postRetirementSpending, setPostRetirementSpending] = useState<number>( initialValues.desiredMonthlyBudgetPostRetirement );
    const [deathDate, setDeathDate] = useState<Date>( initialValues.deathDate );
    const [debtContributionStrategy, setDebtContributionStrategy] = useState<DebtContributionStrategy>( initialValues.debtContributionStrategy );
    const [incomes, setIncomes] = useState<IncomeModel[]>( initialValues.incomes as IncomeModel[] );
    const [debts, setDebts] = useState<DebtModel[]>( initialValues.debts as DebtModel[] );

    const loadDummyData = () =>
    {
        const dummyData = GetDummyScenarioData();
        setName( dummyData[0].forecastName );
        setInitialSavings( dummyData[0].initialSavings );
        setStartDate( dummyData[0].startDate );
        setMonths( dummyData[0].numMonthsToProject );
        setOvertimeHours( dummyData[0].overtimeHoursPerMonth ); // TODO this should be a per-income thing, not per forecastInput
        setPreRetirementSpending( dummyData[0].essentialNonDebtSpendingPreRetirement );
        setPostRetirementSpending( dummyData[0].desiredMonthlyBudgetPostRetirement );
        setDeathDate( dummyData[0].deathDate );
        setDebtContributionStrategy( dummyData[0].debtContributionStrategy );
        setIncomes( dummyData[0].incomes as IncomeModel[] );
        setDebts( dummyData[0].debts as DebtModel[] );
    }

    const reset = () =>
    {
        setIncomes( [] );
        setDebts( [] );
    }

    const setIncomeName = ( index: number, val: string ) =>
    {
        setIncomes( ( prev ) =>
        {
            const newState = [...prev];
            newState[index].name = val;
            return newState;
        } );
    }

    const setIncomeMonthlyValue = ( index: number, val: number ) =>
    {
        setIncomes( ( prev ) =>
        {
            const newState = [...prev];
            newState[index].monthlyValue = val;
            return newState;
        } );
    }

    const setIncomeStartCondition = ( index: number, val: IncomeStartCondition ) =>
    {
        setIncomes( ( prev ) =>
        {
            const newState = [...prev];
            newState[index].startCondition = val;
            return newState;
        } );
    }

    const setIncomeEndCondition = ( index: number, val: IncomeEndCondition ) =>
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

    const updateStartDate = ( date: Date | null ) =>
    {
        setStartDate( date === null ? new Date() : date );
    }

    const updateDeathDate = ( date: Date | null ) =>
    {
        setDeathDate( date === null ? new Date() : date );
    }

    const addNewIncome = () =>
    {
        setIncomes( prev => [...prev, new IncomeModel( new NullIncomeModelInput() )] );
    }

    const addNewDebt = () =>
    {
        setDebts( prev => [...prev, new DebtModel( new NullDebtModelInput() )] );
    }

    return (
        <>
            <h1>Forecast Input Component</h1>
            <Button variant="outlined" color="primary" onClick={ reset }>Reset</Button>
            <Button variant="outlined" color="primary" onClick={ loadDummyData }>Load Dummy Data</Button>
            <Grid
                container
                direction="column"
            >
                <TextField
                    required
                    id="forecast-name"
                    label="Forecast Name"
                    value={ name }
                    onChange={ ( event ) => setName( event.target.value ) }
                />
                <TextField
                    required
                    id="initial-savings"
                    label="Initial Savings"
                    helperText="How much cash savings do you have at the start of this forecast?"
                    value={ initialSavings }
                    onChange={ ( event ) => setInitialSavings( parseInt( event.target.value ) ) }
                />
                <div>
                    <p>Start Date:</p>
                    <DayPickerInput
                        value={ startDate }
                        onDayChange={ updateStartDate }

                    />
                </div>
                <TextField
                    required
                    id="num-months"
                    label="Months"
                    helperText="How long to run the forecast for"
                    value={ months }
                    onChange={ ( event ) => setMonths( parseInt( event.target.value ) ) }
                />
                <TextField
                    required
                    id="overtime-hours"
                    label="Overtime Hours per Month"
                    value={ overtimeHours }
                    onChange={ ( event ) => setOvertimeHours( parseInt( event.target.value ) ) }
                />
                <TextField
                    required
                    id="pre-retirement-spending"
                    label="Pre-retirement Spending"
                    value={ preRetirementSpending }
                    onChange={ ( event ) => setPreRetirementSpending( parseInt( event.target.value ) ) }
                />
                <TextField
                    required
                    id="post-retirement-spending"
                    label="Post-retirement Spending"
                    value={ postRetirementSpending }
                    onChange={ ( event ) => setPostRetirementSpending( parseInt( event.target.value ) ) }
                />
                <div>
                    <p>Death Date:</p>
                    <DayPickerInput
                        value={ deathDate }
                        onDayChange={ updateDeathDate }
                    />
                </div>
                <FormControl fullWidth>
                    <InputLabel id="debt-contribution-strategy">Debt Contribution Strategy</InputLabel>
                    <Select
                        labelId="debt-contribution-strategy"
                        id="demo-simple-select"
                        value={ debtContributionStrategy }
                        label="Debt Contribution Strategy"
                        onChange={ event => setDebtContributionStrategy( event.target.value as DebtContributionStrategy ) }
                    >
                        <MenuItem value={ DebtContributionStrategy.HighestInterestFirst }>Highest Interest First</MenuItem>
                        <MenuItem value={ DebtContributionStrategy.LowestBalanceFirst }>Lowest Balance First</MenuItem>
                    </Select>
                </FormControl>
                <Grid item>
                    <Grid key="incomes" container className={ classes.root } justify="center" spacing={ 2 } direction="row">
                        { incomes.map( ( incomeModel, index ) =>
                        {
                            return (
                                <Grid key={ `grid-${index}` } item>
                                    <Paper key={ `paper-${index}` } className={ classes.incomePaper }>
                                        <Income
                                            key={ `{income-${index}` }
                                            index={ index }
                                            name={ incomeModel.name }
                                            monthlyValue={ incomeModel.monthlyValue }
                                            startCondition={ incomeModel.startCondition }
                                            endCondition={ incomeModel.endCondition }
                                            endDate={ incomeModel.endDate }
                                            setName={ setIncomeName }
                                            setMonthlyValue={ setIncomeMonthlyValue }
                                            setStartCondition={ setIncomeStartCondition }
                                            setEndCondition={ setIncomeEndCondition }
                                            setEndDate={ setIncomeEndDate }
                                            removeIncome={ removeIncome }
                                            shouldDisplayDeleteButton={ incomes.length > 1 }
                                        />
                                    </Paper>
                                </Grid>
                            )
                        } ) }

                        { incomes.length < 4 &&
                            <Button variant="outlined" color="secondary" onClick={ addNewIncome }>Add Income</Button>
                        }
                    </Grid>

                    <Grid key="debts" container className={ classes.root } justify="center" spacing={ 2 } direction="row">
                        { debts.map( ( debtModel, index ) =>
                        {
                            return (
                                <Grid key={ `grid-${index}` } item>
                                    <Paper key={ `paper-${index}` } className={ classes.debtPaper }>
                                        <Debt
                                            key={ `{debt-${index}` }
                                            index={ index }
                                            name={ debtModel.name }
                                            initialBalance={ debtModel.initialBalance }
                                            interestRate={ debtModel.interestRate }
                                            minPayment={ debtModel.minPayment }
                                            isMortgage={ debtModel.getIsMortgage() }
                                            setName={ setDebtName }
                                            setInitialBalance={ setDebtInitialBalance }
                                            setInterestRate={ setDebtInterestRate }
                                            setMinPayment={ setDebtMinPayment }
                                            setIsMortgage={ setDebtIsMortgage }
                                            removeDebt={ removeDebt }
                                            shouldDisplayDeleteButton={ debts.length > 1 }
                                        />
                                    </Paper>
                                </Grid>
                            )
                        } ) }

                        { incomes.length < 4 &&
                            <Button variant="outlined" color="secondary" onClick={ addNewDebt }>Add Debt</Button>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}