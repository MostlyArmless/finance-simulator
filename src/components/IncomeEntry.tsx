import * as React from 'react';

interface IncomeEntryProps
{

}

interface IncomeEntryState
{

}

const initialState: IncomeEntryState = {

}

export class IncomeEntry extends React.Component<IncomeEntryProps, IncomeEntryState>
{
    constructor( props: IncomeEntryProps )
    {
        super( props );
        this.state = initialState;
    }

    render()
    {
        return (
            <>
                <p>blah</p>
            </>
        );
    }
}