import { Button, MenuItem, Select } from '@material-ui/core';

export interface ScenarioChooserProps {
  runSimulation: () => void;
  loadSampleData(): void;
  setCurrentScenarioIndex( scenarioIndex: number ): void;
  scenarioNames: string[];
  addNewScenario(): void;
  selectedScenarioIndex: number;
  className?: string;
}

export function ScenarioChooser(props: ScenarioChooserProps) {

  return (
    <div className={ props.className }>
      <Button variant="outlined"
        onClick={ props.loadSampleData }
      >Load Sample Data
      </Button>
      <Button variant="outlined"
        color="secondary"
        onClick={ props.addNewScenario }
      >Add Scenario
      </Button>
      <Button
        onClick={ props.runSimulation }
        variant="outlined"
        color="primary"
      >Run Simulation
      </Button>

      <Select
        value={ props.selectedScenarioIndex }
        onChange={ event => props.setCurrentScenarioIndex(parseInt(event.target.value as string)) }
      >
        {
          props.scenarioNames.map((name: string, index: number) => {
            return <MenuItem key={ index }
              value={ index }
            >{name}</MenuItem>;
          })
        }
      </Select>
    </div>
  );
}