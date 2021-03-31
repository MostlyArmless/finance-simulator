import React from 'react';
import styles from './DataEntryPage.module.css';

interface DataEntryPageProps
{

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
                <p> Data Entry component! </p>
            </div>
        );
    }
}