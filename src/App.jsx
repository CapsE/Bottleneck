import {useState} from 'react'
import evilCowboy from './assets/evil-cowboy.png';
import styles from './App.module.css';
import {ProgressIcon} from './components/progress-icon';
import {observer} from 'mobx-react-lite';

import Money from './icons/money-stack.svg?react';
import Law from './icons/law-star.svg?react';
import Staff from './icons/person.svg?react';
import Fame from './icons/star-struck.svg?react';

import {state} from './state';
import {imageDescriptions} from "./imageList.js";

const App = observer(() => {
    const active = state.active;

    const handleYes = () => {
        state.updateValues(active.yes);
        state.next();
    };

    const handleNo = () => {
        state.updateValues(active.no);
        state.next();
    }

    return (
        <>
            <h1>{active.title}</h1>
            <img className={styles.image} src={imageDescriptions[active.image || 'default']} />
            <p>{active.description}</p>
            <button onClick={handleYes}>Yes</button>
            <button onClick={handleNo}>No</button>
            <div className={styles.iconWrapper}>
                <ProgressIcon value={state.money} icon={<Money />} />
                <ProgressIcon value={state.law} icon={<Law />} />
                <ProgressIcon value={state.staff} icon={<Staff />} />
                <ProgressIcon value={state.fame} icon={<Fame />} />
            </div>
        </>
    )
});

export default App
