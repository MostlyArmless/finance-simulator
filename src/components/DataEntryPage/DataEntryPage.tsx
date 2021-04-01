import { Button } from '@material-ui/core';
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
                <Button variant="contained" color="primary" onClick={ this.props.onClickDone }>View Results</Button>
            </div>
        );
    }
}