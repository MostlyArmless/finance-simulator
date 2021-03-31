import React from 'react';
import styles from './TemplateName.module.css';

interface TemplateNameProps
{

}

interface TemplateNameState
{

}

const initialState: TemplateNameState = {

}

export class TemplateName extends React.Component<TemplateNameProps, TemplateNameState>
{
    constructor( props: TemplateNameProps )
    {
        super( props );
        this.state = initialState;
    }

    render()
    {
        return (
            <div className={ styles.TemplateName } >
                <p> "TemplateName" component! </p>
            </div>
        );
    }
}