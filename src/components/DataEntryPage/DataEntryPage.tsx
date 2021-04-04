import { Button } from '@material-ui/core';
import { IncomeModel } from '../../IncomeModel';
import { IncomeEndCondition, IncomeStartCondition } from '../../interfacesAndEnums';
import { Income } from '../Income/Income';
import styles from './DataEntryPage.module.css';

interface DataEntryPageProps
{
    onClickDone(): void;
    incomeModels: IncomeModel[];
    addNewIncome(): void;
    setName( index: number, val: string ): void;
    setMonthlyValue( index: number, val: number ): void;
    setStartCondition( index: number, val: IncomeStartCondition ): void;
    setEndCondition( index: number, val: IncomeEndCondition ): void;
    setIncomeEndDate( index: number, val: Date ): void;
}

export function DataEntryPage( props: DataEntryPageProps )
{
    return (
        <div className={ styles.DataEntryPage } >
            <h1>Data Entry</h1>
            <Button variant="contained" color="primary" onClick={ props.onClickDone }>View Results</Button>

            { props.incomeModels.map( ( incomeModel, index ) =>
            {
                return <Income
                    key={ index }
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
                />
            } ) }

            <Button variant="contained" color="secondary" onClick={ props.addNewIncome }>Add Income</Button>
        </div>
    );
}