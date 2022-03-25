import { Button } from '@material-ui/core';
import { IScenarioIoPair } from '../../interfacesAndEnums';
import { ScenarioView } from '../ScenarioView/ScenarioView';
import { SimulationAllResultsComparison } from '../SimulationAllResultsComparison/SimulationAllResultsComparison';

interface ResultsPageProps
{
  runSimulation(): void;
  scenarios: IScenarioIoPair[];
}

export function ResultsPage( props: ResultsPageProps )
{
  return (
    <div>
      { props.scenarios.length > 0 &&
        <>
          <Button onClick={ props.runSimulation } color="primary">Run Simulation</Button>
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