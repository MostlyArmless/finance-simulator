import { IForecastInput } from "./interfaces";

export function throwIfInvalidScenarioNames( forecastScenarios: IForecastInput[] ): void
{
    for ( let i = 0; i < forecastScenarios.length; i++ )
    {
        if ( forecastScenarios[i].forecastName.search( ',' ) !== -1 )
        {
            throw new Error( `Scenario cannot have commas in the name: "${forecastScenarios[i].forecastName}"` );
        }
    }
}