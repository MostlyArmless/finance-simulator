export function LinSpace( startValue: number, increment: number, endValue: number ): number[]
{
    let result: number[] = [];

    for ( let i = startValue; i < endValue; i += increment )
    {
        result.push( i );
    }

    return result;
}