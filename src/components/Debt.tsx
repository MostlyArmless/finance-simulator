import TextField from '@material-ui/core/TextField';
import { Grid, createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { nameCharacterLimit } from '../constants';
import { validateName } from '../tools';
import { Checkbox, FormControlLabel } from '@material-ui/core';

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

export interface IDebtProps
{
  name: string;
  initialBalance: number;
  interestRate: number;
  minPayment: number;
  isMortgage: boolean;

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

  const nameValidationResult = validateName( props.name );

  return (
    <Grid id={ `debt-${props.name}` } container direction="row">
      <h2>Debt</h2>

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
            value={ props.name }
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
            value={ props.initialBalance }
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
            value={ props.interestRate }
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
            value={ props.minPayment }
            onChange={ ( event ) => props.setMinPayment( parseFloat( event.target.value ) ) }
          />
        </Tooltip>
        <br />
      </form>

      <Tooltip title="Mortgages don't have compounding monthly interest, they just have a fixed monthly payment amount.">
        <FormControlLabel
          control={
            <Checkbox
              checked={ props.isMortgage }
              onChange={ () => { props.setIsMortgage( !props.isMortgage ) } }
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