import { Button } from '@material-ui/core';
import { IncomeModel } from '../../IncomeModel';
import { IncomeEndCondition, IncomeStartCondition } from '../../interfacesAndEnums';
import { Income } from '../Income/Income';
import styles from './DataEntryPage.module.css';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles( ( theme: Theme ) =>
    createStyles( {
        root: {
            flexGrow: 1,
        },
        paper: {
            height: 350,
            width: 240,
        },
    } ),
);

interface DataEntryPageProps
{
    onClickDone(): void;
    incomeModels: IncomeModel[];
    addNewIncome(): void;
    removeIncome( index: number ): void;

    setName( index: number, val: string ): void;
    setMonthlyValue( index: number, val: number ): void;
    setStartCondition( index: number, val: IncomeStartCondition ): void;
    setEndCondition( index: number, val: IncomeEndCondition ): void;
    setIncomeEndDate( index: number, val: Date ): void;
}

export function DataEntryPage( props: DataEntryPageProps )
{
    const classes = useStyles();

    return (
        <div className={ styles.DataEntryPage } >
            <h1>Data Entry</h1>
            <Button variant="contained" color="primary" onClick={ props.onClickDone }>View Results</Button>
            <Grid container className={ classes.root } justify="center" spacing={ 2 } direction="row">
                { props.incomeModels.map( ( incomeModel, index ) =>
                {
                    return (
                        <Grid key={ `grid-${index}` } item>
                            <Paper key={ `paper-${index}` } className={ classes.paper }>
                                <Income
                                    key={ `{income-${index}` }
                                    index={ index }
                                    name={ incomeModel.name }
                                    monthlyValue={ incomeModel.monthlyValue }
                                    startCondition={ incomeModel.startCondition }
                                    endCondition={ incomeModel.endCondition }
                                    endDate={ incomeModel.endDate }
                                    setName={ props.setName }
                                    setMonthlyValue={ props.setMonthlyValue }
                                    setStartCondition={ props.setStartCondition }
                                    setEndCondition={ props.setEndCondition }
                                    setEndDate={ props.setIncomeEndDate }
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

        </div>
    );
}