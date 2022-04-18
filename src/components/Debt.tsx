import { Theme } from '@emotion/react';
import { makeStyles, createStyles, Grid, Tooltip, TextField, FormControlLabel, Checkbox } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { incomeAndDebtNameCharacterLimit } from '../constants';
import { IDebt } from '../interfacesAndEnums';
import { validateName } from '../tools';

const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
    root: {
      '& .MuiTextField-root': {
        margin: 8,
        width: `${incomeAndDebtNameCharacterLimit}ch`,
      },
    },
  } ),
);

export interface IDebtProps
{
  index: number;
  model: IDebt;

  removeDebt(): void;

  setName( val: string ): void;
  setInitialBalance( val: number ): void;
  setInterestRate( val: number ): void;
  setMinPayment( val: number ): void;
  setIsMortgage( val: boolean ): void;

  shouldDisplayDeleteButton: boolean;
}

export function Debt( props: IDebtProps )
{
  const classes = useStyles();

  const nameValidationResult = validateName( props.model.name );

  return (
    <Grid id={ `debt-${props.model.name}` } container direction="row">
      <h2>Debt #{props.index + 1}</h2>

      { props.shouldDisplayDeleteButton &&
        <IconButton color="secondary" onClick={ () => { props.removeDebt() } }>
          <DeleteIcon />
        </IconButton>
      }

      <form className={ classes.root } noValidate autoComplete="off">
        <Tooltip title="The name of the debt.">
          <TextField
            required
            id="debt-name"
            label="Debt Name"
            variant="outlined"
            helperText={ nameValidationResult.errorMessage }
            value={ props.model.name }
            onChange={ event => props.setName( event.target.value ) }
            error={ !nameValidationResult.isValid }
          />
        </Tooltip>
        <br />

        <Tooltip title="The initial balance of the debt at simulation t=0">
          <TextField
            id="initial-balance"
            label="Initial Balance"
            type="number"
            InputLabelProps={ {
              shrink: true,
            } }
            variant="outlined"
            value={ props.model.initialBalance }
            onChange={ ( event ) => props.setInitialBalance( parseFloat( event.target.value ) ) }
          />
        </Tooltip>
        <br />

        <Tooltip title="The monthly interest rate of the debt.">
          <TextField
            id="interest-rate"
            label="Interest Rate"
            type="number"
            InputLabelProps={ {
              shrink: true,
            } }
            variant="outlined"
            value={ props.model.interestRate }
            onChange={ ( event ) => props.setInterestRate( parseFloat( event.target.value ) ) }
          />
        </Tooltip>
        <br />

        <Tooltip title="The minimum monthly payment of the debt.">
          <TextField
            id="minimum-payment"
            label="Minimum Payment"
            type="number"
            InputLabelProps={ {
              shrink: true,
            } }
            variant="outlined"
            value={ props.model.minPayment }
            onChange={ ( event ) => props.setMinPayment( parseFloat( event.target.value ) ) }
          />
        </Tooltip>
        <br />
      </form>

      <Tooltip title="Mortgages don't have compounding monthly interest, they just have a fixed monthly payment amount.">
        <FormControlLabel
          control={
            <Checkbox
              checked={ props.model.isMortgage }
              onChange={ () => { props.setIsMortgage( !props.model.isMortgage ) } }
              name="checkedB"
              color="primary"
            />
          }
          label="Is a Mortgage?"
        />
      </Tooltip>
    </Grid>
  );
}