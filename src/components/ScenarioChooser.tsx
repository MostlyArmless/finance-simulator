import { Button, MenuItem, Select } from "@material-ui/core";

export interface ScenarioChooserProps {
  loadSampleData(): void;
  setCurrentScenarioIndex( scenarioIndex: number ): void;
  scenarioNames: string[];
  addNewScenario(): void;
  selectedScenarioIndex: number;
};

export function ScenarioChooser(props: ScenarioChooserProps) {

  return (
  <>
    <Select
      value={props.selectedScenarioIndex}
      onChange={event => props.setCurrentScenarioIndex(parseInt(event.target.value as string))}
    >
      {
      props.scenarioNames.map((name: string, index: number) => {
        return <MenuItem value={index}>{name}</MenuItem>;
      })
      }
    </Select>
    
    <Button variant="outlined" onClick={props.loadSampleData}>Load Sample Data</Button>
    <Button variant="outlined" color="secondary" onClick={() => props.addNewScenario()}>Add Scenario</Button>
  </>
  );
}