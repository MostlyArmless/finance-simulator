import { IForecastInput } from './interfacesAndEnums';

export function throwIfInvalidScenarioNames( forecastScenarios: IForecastInput[] ): void
{
  for ( let i = 0; i < forecastScenarios.length; i++ )
  {
    if ( forecastScenarios[i].forecastName.search( ',' ) !== -1 )
    {
      // This ensures that if/when the scenario names are printed to CSV, the scenario names don't accidentally delimit a new column.
      throw new Error( `Scenario cannot have commas in the name: "${forecastScenarios[i].forecastName}"` );
    }
  }
}