import styles from './App.module.css';
import {ProgressIcon} from './components/progress-icon';
import {observer} from 'mobx-react-lite';

import Money from './icons/money-stack.svg?react';
import Law from './icons/law-star.svg?react';
import Staff from './icons/person.svg?react';
import Fame from './icons/star-struck.svg?react';

import {state} from './state';
import {imageDescriptions} from "./imageList.js";
import {useState} from "react";
import { sound } from '@pixi/sound';

sound.add('my-sound', '/TheEntertainer.ogg');
sound.play('my-sound');

const GameOver = ({message}) => <>
    <h1>Game Over</h1>
    <p>{message}</p>
</>

const App = observer(() => {
    const [loading, setLoading] = useState(false);
    const active = state.active;

    const handleYes = () => {
        state.updateValues(active.yes);
        setLoading(true);
        state.next().then(() => {
            setLoading(false);
        });
    };

    const handleNo = () => {
        state.updateValues(active.no);
        setLoading(true);
        state.next().then(() => {
            setLoading(false);
        });
    }

    let imageId = imageDescriptions.indexOf(active.image);
    imageId = imageId === -1 ? 0 : imageId;

    if (state.fame <= 0) {
        return <GameOver message="Too little fame" />
    }
    if (state.fame >= 100) {
        return <GameOver message="Too much fame" />
    }
    if (state.staff <= 0) {
        return <GameOver message="Too much staff" />
    }
    if (state.staff >= 100) {
        return <GameOver message="Too much staff" />
    }
    if (state.money <= 0) {
        return <GameOver message="Too little money" />
    }
    if (state.money >= 100) {
        return <GameOver message="Too much money" />
    }
    if (state.law <= 0) {
        return <GameOver message="Too little law" />
    }
    if (state.law >= 100) {
        return <GameOver message="Too much law" />
    }
    return (
        <>
            <div className={styles.content}>
                <h1>{active.title}</h1>
                <img className={styles.image} src={`/images/${imageId}.png`}/>
                <p>{active.description}</p>
                <div className={styles.btnWrapper}>
                    <button disabled={loading} className={styles.btn} onClick={handleNo}>No</button>
                    <button disabled={loading} className={styles.btn} onClick={handleYes}>Yes</button>
                </div>
            </div>

            <div className={styles.iconWrapper}>
                <ProgressIcon value={state.money} icon={<Money/>}/>
                <ProgressIcon value={state.law} icon={<Law/>}/>
                <ProgressIcon value={state.staff} icon={<Staff/>}/>
                <ProgressIcon value={state.fame} icon={<Fame/>}/>
            </div>
        </>
    )
});

export default App
