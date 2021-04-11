import styles from './Debt.module.css';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import { nameCharacterLimit } from '../../constants';
import { validateName } from '../../tools';
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
    index: number;

    name: string;
    initialBalance: number;
    interestRate: number;
    minPayment: number;
    isMortgage: boolean;

    removeDebt( index: number ): void;

    setName( index: number, val: string ): void;
    setInitialBalance( index: number, val: number ): void;
    setInterestRate( index: number, val: number ): void;
    setMinPayment( index: number, val: number ): void;
    setIsMortgage( index: number, val: boolean ): void;

    shouldDisplayDeleteButton: boolean;
}

export function Debt( props: IDebtProps )
{
    const classes = useStyles();

    const nameValidationResult = validateName( props.name );

    return (
        <Grid id={ `debt-${props.index}` } className={ styles.Debt } container direction="row">
            <h2>Debt</h2>

            { props.shouldDisplayDeleteButton &&
                <IconButton color="secondary" onClick={ () => { props.removeDebt( props.index ) } }>
                    <DeleteIcon />
                </IconButton>
            }

            <form className={ classes.root } noValidate autoComplete="off">
                <TextField
                    required
                    id="debt-name"
                    label="Debt Name"
                    variant="outlined"
                    helperText={ nameValidationResult.errorMessage }
                    value={ props.name }
                    onChange={ event => props.setName( props.index, event.target.value ) }
                    error={ !nameValidationResult.isValid }
                />
                <br />

                <TextField
                    id="initial-balance"
                    label="Initial Balance"
                    type="number"
                    InputLabelProps={ {
                        shrink: true,
                    } }
                    variant="outlined"
                    value={ props.initialBalance }
                    onChange={ ( event ) => props.setInitialBalance( props.index, parseFloat( event.target.value ) ) }
                />
                <br />

                <TextField
                    id="interest-rate"
                    label="Interest Rate"
                    type="number"
                    InputLabelProps={ {
                        shrink: true,
                    } }
                    variant="outlined"
                    value={ props.interestRate }
                    onChange={ ( event ) => props.setInterestRate( props.index, parseFloat( event.target.value ) ) }
                />
                <br />

                <TextField
                    id="minimum-payment"
                    label="Minimum Payment"
                    type="number"
                    InputLabelProps={ {
                        shrink: true,
                    } }
                    variant="outlined"
                    value={ props.minPayment }
                    onChange={ ( event ) => props.setMinPayment( props.index, parseFloat( event.target.value ) ) }
                />
                <br />
            </form>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={ props.isMortgage }
                        onChange={ () => { props.setIsMortgage( props.index, !props.isMortgage ) } }
                        name="checkedB"
                        color="primary"
                    />
                }
                label="Is a Mortgage?"
            />
        </Grid>
    );
}