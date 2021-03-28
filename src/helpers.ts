export function addNMonthsToDate( date: Date, nMonths: number )
{
    return new Date( date.getFullYear(), date.getMonth() + nMonths, date.getDate() );
}

export function addNYearsToDate( date: Date, nYears: number )
{
    return new Date( date.getFullYear() + nYears, date.getMonth(), date.getDate() );
}

const tzoffset = ( new Date() ).getTimezoneOffset() * 60000; //offset in milliseconds
// Filename friendly (no colons)
export function getDateLocalTime(): string
{
    return ( new Date( Date.now() - tzoffset ) ).toISOString().slice( 0, -1 ).replace( 'T', '_' ).replace( /:/g, '-' );
}

export function findLastDefinedValueInArray( arr: number[] ): number | null
{
    for ( let i = arr.length - 1; i >= 0; i-- )
    {
        if ( arr[i] !== undefined )
        {
            return arr[i];
        }
    }

    return null;
}