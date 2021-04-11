import { Button } from '@material-ui/core';
import { IncomeModel } from '../../IncomeModel';
import { IncomeEndCondition, IncomeStartCondition } from '../../interfacesAndEnums';
import { Income } from '../Income/Income';
import styles from './DataEntryPage.module.css';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { DebtModel } from '../../DebtModel';
import { Debt } from '../Debt/Debt';

const cardWidth = 240;
const useStyles = makeStyles( ( theme: Theme ) =>
    createStyles( {
        root: {
            flexGrow: 1,
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

interface DataEntryPageProps
{
    onClickDone(): void;

    // Income
    incomeModels: IncomeModel[];
    addNewIncome(): void;
    removeIncome( index: number ): void;

    setIncomeName( index: number, val: string ): void;
    setIncomeMonthlyValue( index: number, val: number ): void;
    setIncomeStartCondition( index: number, val: IncomeStartCondition ): void;
    setIncomeEndCondition( index: number, val: IncomeEndCondition ): void;
    setIncomeIncomeEndDate( index: number, val: Date ): void;

    // Debt
    debtModels: DebtModel[];
    addNewDebt(): void;
    removeDebt( index: number ): void;

    setDebtName( index: number, val: string ): void;
    setDebtInitialBalance( index: number, val: number ): void;
    setDebtInterestRate( index: number, val: number ): void;
    setDebtMinPayment( index: number, val: number ): void;
    setDebtIsMortgage( index: number, val: boolean ): void;
}

export function DataEntryPage( props: DataEntryPageProps )
{
    const classes = useStyles();

    return (
        <div className={ styles.DataEntryPage } >
            <h1>Data Entry</h1>
            <Button variant="contained" color="primary" onClick={ props.onClickDone }>View Results</Button>

            <Grid key="incomes" container className={ classes.root } justify="center" spacing={ 2 } direction="row">
                { props.incomeModels.map( ( incomeModel, index ) =>
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
                                    setName={ props.setIncomeName }
                                    setMonthlyValue={ props.setIncomeMonthlyValue }
                                    setStartCondition={ props.setIncomeStartCondition }
                                    setEndCondition={ props.setIncomeEndCondition }
                                    setEndDate={ props.setIncomeIncomeEndDate }
                                    removeIncome={ props.removeIncome }
                                    shouldDisplayDeleteButton={ props.incomeModels.length > 1 }
                                />
                            </Paper>
                        </Grid>
                    )
                } ) }

                { props.incomeModels.length < 4 &&
                    <Button variant="outlined" color="secondary" onClick={ props.addNewIncome }>Add Income</Button>
                }
            </Grid>

            <Grid key="debts" container className={ classes.root } justify="center" spacing={ 2 } direction="row">
                { props.debtModels.map( ( debtModel, index ) =>
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
                                    setName={ props.setDebtName }
                                    setInitialBalance={ props.setDebtInitialBalance }
                                    setInterestRate={ props.setDebtInterestRate }
                                    setMinPayment={ props.setDebtMinPayment }
                                    setIsMortgage={ props.setDebtIsMortgage }
                                    removeDebt={ props.removeDebt }
                                    shouldDisplayDeleteButton={ props.debtModels.length > 1 }
                                />
                            </Paper>
                        </Grid>
                    )
                } ) }

                { props.incomeModels.length < 4 &&
                    <Button variant="outlined" color="secondary" onClick={ props.addNewDebt }>Add Debt</Button>
                }
            </Grid>

        </div>
    );
}