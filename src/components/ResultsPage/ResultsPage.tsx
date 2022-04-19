import { useState } from 'react';
import { IScenarioIoPair } from '../../interfacesAndEnums';
import { ScenarioView } from '../ScenarioView/ScenarioView';

interface ResultsPageProps
{
  runSimulation(): void;
  scenarios: IScenarioIoPair[];
}

export function ResultsPage( props: ResultsPageProps )
{
  const [numComparisonPlotsToShow, setNumComparisonPlotsToShow] = useState<number>(2);
  
  return (
    <>
      { props.scenarios.length > 0 &&
        <>
          <input type="number"
            value={ numComparisonPlotsToShow }
            onChange={ (event) => setNumComparisonPlotsToShow(parseInt(event.target.value)) }
          >
          </input>
          <table>
            <tbody>
              <tr>
                { props.scenarios
                  .map((scenario, index) => {
                    return (index < numComparisonPlotsToShow && (
                      <td key={ index }>
                        <ScenarioView
                          key={ index }
                          scenarios={ props.scenarios }
                          index={ index }
                        />
                      </td>
                    ));
                  })
                }
              </tr>
            </tbody>
          </table>
        </> }
    </>
  );
}