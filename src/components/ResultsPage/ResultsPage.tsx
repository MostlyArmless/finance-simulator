import { IScenarioIoPair } from '../../interfacesAndEnums';
import { ScenarioView } from '../ScenarioView/ScenarioView';
import { SimulationAllResultsComparison } from '../SimulationAllResultsComparison/SimulationAllResultsComparison';
import styles from './ResultsPage.module.css';

interface ResultsPageProps
{
    scenarios: IScenarioIoPair[];
}

export function ResultsPage(props: ResultsPageProps)
{
    return (
        <div className={ styles.ResultsPage } >
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