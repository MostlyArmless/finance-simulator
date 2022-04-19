import { IScenarioSummary } from '../../interfacesAndEnums';
import { formatNumberAsDollars } from '../../tools';
import { makeStyles } from '@material-ui/core/styles';
import styles from './ScenarioTable.module.css';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles( {
  table: {
    minWidth: 200,
  },
} );

export function ScenarioTable( props: { summary: IScenarioSummary } )
{
  const classes = useStyles();

  return (
    <div className={ styles.ScenarioTable }>
      <h2>Scenario Summary</h2>
      <h3>{ props.summary.scenarioName }</h3>
      <TableContainer component={ Paper }>
        <Table className={ classes.table } aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Attribute</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Pre-Retirement Budget</TableCell>
              <TableCell align="right">{ formatNumberAsDollars( props.summary.preRetirementSpending ) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Post-Retirement Budget</TableCell>
              <TableCell align="right">{ formatNumberAsDollars( props.summary.postRetirementSpending ) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Required Savings to Retire</TableCell>
              <TableCell align="right">{ formatNumberAsDollars( props.summary.requiredSavingsToRetire ) }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Retirement Date</TableCell>
              <TableCell align="right">{ props.summary.retirementDate }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Months to Reach Retirement</TableCell>
              <TableCell align="right">{ props.summary.numMonthsToReachRetirementGoal }</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div >
  );
}