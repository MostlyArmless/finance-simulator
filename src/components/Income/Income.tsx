// import { useState } from 'react';
import styles from './Income.module.css';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { IncomeEndCondition, IncomeStartCondition } from '../../interfacesAndEnums';
// import { formatNumberAsDollars } from '../../tools';
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

const incomeNameCharacterLimit = 25;
const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing( 1 ),
        width: `${incomeNameCharacterLimit}ch`,
      },
    },
  } ),
);

interface IIncomeProps
{
  index: number;

  name: string;
  monthlyValue: number;
  startCondition: IncomeStartCondition;
  endCondition: IncomeEndCondition;
  endDate: Date;

  setName( index: number, val: string ): void;
  setMonthlyValue( index: number, val: number ): void;
  setStartCondition( index: number, val: IncomeStartCondition ): void;
  setEndCondition( index: number, val: IncomeEndCondition ): void;
  setEndDate( index: number, val: Date ): void;
  // setParentState(): void;
}

const startConditionOptions: { value: IncomeStartCondition, label: string }[] = [
  {
    value: IncomeStartCondition.Immediate,
    label: "Immediate"
  },
  {
    value: IncomeStartCondition.Retirement,
    label: "Retirement"
  }
];

const endConditionOptions: { value: IncomeEndCondition, label: string }[] = [
  {
    value: IncomeEndCondition.Date,
    label: "Date"
  },
  {
    value: IncomeEndCondition.Retirement,
    label: "Retirement"
  }
];

export function Income( props: IIncomeProps )
{
  const classes = useStyles();

  const validateName = () =>
  {
    const isValid = props.name.length <= incomeNameCharacterLimit;
    return {
      isValid: isValid,
      errorMessage: isValid ? "" : "Character limit exceeded"
    }
  }

  const updateStartCondition = ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const selectedCondition = startConditionOptions.filter( elem => String( elem.value ) === event.target.value )[0];
    if ( selectedCondition )
      props.setStartCondition( props.index, selectedCondition.value );
  }

  const updateEndCondition = ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const selectedCondition = endConditionOptions.filter( elem => String( elem.value ) === event.target.value )[0];
    if ( selectedCondition )
      props.setEndCondition( props.index, selectedCondition.value );
  }

  const updateEndDate = ( date: Date | null ) =>
  {
    props.setEndDate( props.index, date === null ? new Date() : date );
  }

  const nameValidationResult = validateName();

  return (
    <div id={ `income-${props.index}` } className={ styles.Income } >
      <h2>Income</h2>
      <form className={ classes.root } noValidate autoComplete="off">
        <div>
          <TextField
            required
            id="income-name"
            label="Income Name"
            variant="outlined"
            helperText={ nameValidationResult.errorMessage }
            value={ props.name }
            onChange={ event => props.setName( props.index, event.target.value ) }
            error={ !nameValidationResult.isValid }
          />
          <br />

          <TextField
            id="monthly-value"
            label="Monthly Value"
            type="number"
            InputLabelProps={ {
              shrink: true,
            } }
            variant="outlined"
            value={ props.monthlyValue }
            onChange={ ( event ) => props.setMonthlyValue( props.index, parseFloat( event.target.value ) ) }
          />
          <br />

          <TextField
            id="start-condition"
            label="Start Condition"
            type="text"
            InputLabelProps={ {
              shrink: true,
            } }
            variant="outlined"
            select
            SelectProps={ {
              native: true,
            } }
            value={ props.startCondition }
            onChange={ updateStartCondition }
          >
            { startConditionOptions.map( ( option ) => (
              <option key={ option.value } value={ option.value }>
                { option.label }
              </option>
            ) ) }
          </TextField>
          <br />

          <TextField
            id="end-condition"
            label="End Condition"
            type="text"
            InputLabelProps={ {
              shrink: true,
            } }
            variant="outlined"
            select
            SelectProps={ {
              native: true,
            } }
            value={ props.endCondition }
            onChange={ updateEndCondition }
          >
            { endConditionOptions.map( ( option ) => (
              <option key={ option.value } value={ option.value }>
                { option.label }
              </option>
            ) ) }
          </TextField>
          <br />

          { props.endCondition === IncomeEndCondition.Date &&
            <>
              <h3>End Date:</h3>
              <DayPickerInput onDayChange={ updateEndDate } />
            </>
          }
        </div>
      </form>
    </div >
  );
}