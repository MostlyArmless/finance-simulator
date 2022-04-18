import styles from './Income.module.css';
import { IncomeEndCondition, IncomeStartCondition } from '../../interfacesAndEnums';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { incomeAndDebtNameCharacterLimit } from '../../constants';
import { validateName } from '../../tools';
import { Theme } from '@emotion/react';
import { makeStyles, createStyles, Grid, Tooltip, TextField } from '@material-ui/core';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
    form: {
      '& .MuiTextField-root': {
        margin: 8,
        width: `${incomeAndDebtNameCharacterLimit}ch`,
      },
    },
    textField: {
      margin: 8,
    }
  }),
);

interface IIncomeProps
{
  name: string;
  index: number;
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

  const updateEndDate = ( date: Date | undefined ) =>
  {
    props.setEndDate( date ? date : new Date());
  }

  const nameValidationResult = validateName( props.name );

  return (
    <Grid id={ `income-${props.name}` } className={ styles.Income } container direction="row">
      <h2>Income #{props.index + 1}</h2>

      {props.shouldDisplayDeleteButton &&
        <IconButton color="secondary" onClick={ () => { props.removeIncome() } }>
          <DeleteIcon />
        </IconButton>
      }

      <form className={ classes.form } noValidate autoComplete="off">
        <Tooltip title="The name of the income source.">
          <TextField
            className={classes.textField}
            required
            id="income-name"
            label="Income Name"
            variant="outlined"
            helperText={ nameValidationResult.errorMessage }
            value={ props.name }
            onChange={ event => props.setName( event.target.value ) }
            error={ !nameValidationResult.isValid }
          />
        </Tooltip>

        <Tooltip title="The monthly value of the income source.">
          <TextField
            className={classes.textField}
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
        </Tooltip>

        <Tooltip title="When will you start receiving this income?">
          <TextField
            className={classes.textField}
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
        </Tooltip>

        <Tooltip title="When will you stop receiving this income?">
          <TextField
            className={classes.textField}
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
        </Tooltip>

        { props.endCondition === IncomeEndCondition.Date &&
          <>
            <h3>End Date:</h3>
            <DayPicker
              mode="single"
              selected={props.endDate}
              onSelect={updateEndDate}
              />
          </>
        }
      </form>
    </Grid>
  );
}
