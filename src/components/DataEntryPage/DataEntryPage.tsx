import React from 'react';
import styles from './DataEntryPage.module.css';

interface DataEntryPageProps
{
    onClickDone(): void;
}

interface DataEntryPageState
{

}

const initialState: DataEntryPageState = {

}

export class DataEntryPage extends React.Component<DataEntryPageProps, DataEntryPageState>
{
    constructor( props: DataEntryPageProps )
    {
        super( props );
        this.state = initialState;
    }

    render()
    {
        return (
            <div className={ styles.DataEntryPage } >
                <h1>Data Entry</h1>
                <button onClick={ this.props.onClickDone }>Finished</button>
            </div>
        );
    }
}