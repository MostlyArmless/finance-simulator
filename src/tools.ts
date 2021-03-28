export function MatlabArray( start: number, increment: number, end: number ): number[]
{
    let result: number[] = [];

    for ( let i = start; i < end; i += increment )
    {
        result.push( i );
    }

    return result;
}