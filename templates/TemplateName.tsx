import React, { useState, useEffect } from 'react';
import styles from './TemplateName.module.css';

export function TemplateName()
{
    const [count, setCount] = useState( 0 ); // Initial value

    useEffect( () =>
    {
        console.log( `empty array means this runs only on first component mount` );
    }, [] );

    useEffect( () =>
    {
        console.log( `This side effect will happen every time the count variable changes` );
    }, [count] );

    const increment = () =>
    {
        setCount( prevCount => prevCount + 1 );
    }

    const decrement = () =>
    {
        setCount( prevCount => prevCount - 1 );
    }

    return (
        <div className={ styles.TemplateName } >
            <button onClick={ () => decrement() }>-</button>
            { count }
            <button onClick={ () => increment() }>+</button>
        </div>
    );
}