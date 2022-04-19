import { IScenarioIoPair } from '../../interfacesAndEnums';
import { ScenarioView } from '../ScenarioView/ScenarioView';

interface ResultsPageProps
{
  runSimulation(): void;
  scenarios: IScenarioIoPair[];
}

export function ResultsPage( props: ResultsPageProps )
{
  return (
    <>
      { props.scenarios.length > 0 &&
        <>
          <table>
            <tbody>
              <tr>
                <td><ScenarioView scenarios={ props.scenarios } /></td>
                <td><ScenarioView scenarios={ props.scenarios } /></td>
              </tr>
            </tbody>
          </table>
        </> }
    </>
  );
}