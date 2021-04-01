import { Button } from '@material-ui/core';
import React from 'react';
import { IScenarioIoPair } from '../../interfacesAndEnums';
import { ScenarioView } from '../ScenarioView/ScenarioView';
import { SimulationAllResultsComparison } from '../SimulationAllResultsComparison/SimulationAllResultsComparison';
import styles from './ResultsPage.module.css';

interface ResultsPageProps
{
    runAndPlot(): void;
    onClickReturnToDataEntry(): void;
    scenarios: IScenarioIoPair[];
}

interface ResultsPageState
{
    allScenarios: IScenarioIoPair[];
}

const initialState: ResultsPageState = {
    allScenarios: []
}

export class ResultsPage extends React.Component<ResultsPageProps, ResultsPageState>
{
    constructor( props: ResultsPageProps )
    {
        super( props );
        this.state = initialState;
    }

    render()
    {
        return (
            <div className={ styles.ResultsPage } >
                <Button variant="contained" onClick={ this.props.onClickReturnToDataEntry }>Return to Data Entry</Button>
                <Button variant="contained" color="primary" onClick={ this.props.runAndPlot }>Re-run Simulation</Button>

                { this.props.scenarios.length > 0 &&
                    <>
                        <SimulationAllResultsComparison scenarios={ this.props.scenarios } />
                        <table>
                            <tr>
                                <td><ScenarioView scenarios={ this.props.scenarios } /></td>
                                <td><ScenarioView scenarios={ this.props.scenarios } /></td>
                            </tr>
                        </table>
                    </> }
            </div>
        );
    }
}