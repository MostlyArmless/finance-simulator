import styles from './Income.module.css';
import TextField from '@material-ui/core/TextField';
import { Grid, createStyles, makeStyles, Theme } from '@material-ui/core';
import { IncomeEndCondition, IncomeStartCondition } from '../../interfacesAndEnums';
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { nameCharacterLimit } from '../../constants';
import { validateName } from '../../tools';

const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing( 1 ),
        width: `${nameCharacterLimit}ch`,
      },
    },
  } ),
);

interface IIncomeProps
{
  name: string;
  monthlyValue: number;
  startCondition: IncomeStartCondition;
  endCondition: IncomeEndCondition;
  endDate: Date | undefined;

  removeIncome(): void;

  setName( val: string ): void;
  setMonthlyValue( val: number ): void;
  setStartCondition( val: IncomeStartCondition ): void;
  setEndCondition( val: IncomeEndCondition ): void;
  setEndDate( val: Date ): void;

  shouldDisplayDeleteButton: boolean;
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

  const updateStartCondition = ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const selectedCondition = startConditionOptions.filter( elem => String( elem.value ) === event.target.value )[0];
    if ( selectedCondition )
      props.setStartCondition( selectedCondition.value );
  }

  const updateEndCondition = ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const selectedCondition = endConditionOptions.filter( elem => String( elem.value ) === event.target.value )[0];
    if ( selectedCondition )
      props.setEndCondition( selectedCondition.value );
  }

  const updateEndDate = ( date: Date | null ) =>
  {
    props.setEndDate( date === null ? new Date() : date );
  }

  const nameValidationResult = validateName( props.name );

  return (
    <Grid id={ `income-${props.name}` } className={ styles.Income } container direction="row">
      <h2>Income</h2>

      {props.shouldDisplayDeleteButton &&
        <IconButton color="secondary" onClick={ () => { props.removeIncome() } }>
          <DeleteIcon />
        </IconButton>
      }

      <form className={ classes.root } noValidate autoComplete="off">
        <TextField
          required
          id="income-name"
          label="Income Name"
          variant="outlined"
          helperText={ nameValidationResult.errorMessage }
          value={ props.name }
          onChange={ event => props.setName( event.target.value ) }
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
          onChange={ ( event ) => props.setMonthlyValue( parseFloat( event.target.value ) ) }
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
      </form>
    </Grid>
  );
}