import { Button } from '@material-ui/core';
import { IScenarioIoPair } from '../../interfacesAndEnums';
import { ScenarioView } from '../ScenarioView/ScenarioView';
import { SimulationAllResultsComparison } from '../SimulationAllResultsComparison/SimulationAllResultsComparison';
import styles from './ResultsPage.module.css';

interface ResultsPageProps
{
    onClickReturnToDataEntry(): void;
    scenarios: IScenarioIoPair[];
}

export function ResultsPage(props: ResultsPageProps)
{
    return (
        <div className={ styles.ResultsPage } >
            <Button variant="contained" onClick={ props.onClickReturnToDataEntry }>Return to Data Entry</Button>

            { props.scenarios.length > 0 &&
                <>
                    <SimulationAllResultsComparison scenarios={ props.scenarios } />
                    <table>
                        <tr>
                            <td><ScenarioView scenarios={ props.scenarios } /></td>
                            <td><ScenarioView scenarios={ props.scenarios } /></td>
                        </tr>
                    </table>
                </> }
        </div>
    );
}