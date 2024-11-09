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

    let imageId = imageDescriptions.indexOf(active.image);
    imageId = imageId === -1 ? 0 : imageId;
    return (
        <>
            <h1>{active.title}</h1>
            <img className={styles.image} src={`http://localhost:3000/images/${imageId}.png`} />
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
