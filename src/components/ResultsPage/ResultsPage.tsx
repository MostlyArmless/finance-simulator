import React from 'react';
import { IScenarioIoPair } from '../../interfacesAndEnums';
import { ScenarioView } from '../ScenarioView/ScenarioView';
import { SimulationAllResultsComparison } from '../SimulationAllResultsComparison/SimulationAllResultsComparison';
import styles from './ResultsPage.module.css';

interface ResultsPageProps
{
    reset(): void;
    runAndPlot(): void;
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
                <button onClick={ this.props.reset }>Reset</button>
                <button onClick={ this.props.runAndPlot }>Run Simulation</button>

                { this.state.allScenarios.length > 0 &&
                    <>
                        <SimulationAllResultsComparison scenarios={ this.state.allScenarios } />
                        <table>
                            <tr>
                                <td><ScenarioView scenarios={ this.state.allScenarios } /></td>
                                <td><ScenarioView scenarios={ this.state.allScenarios } /></td>
                            </tr>
                        </table>
                    </> }
            </div>
        );
    }
}