import styles from './App.module.css';
import {ProgressIcon} from './components/progress-icon';
import {observer} from 'mobx-react-lite';

import Money from './icons/money-stack.svg?react';
import Law from './icons/law-star.svg?react';
import Staff from './icons/person.svg?react';
import Fame from './icons/star-struck.svg?react';
import Music from './icons/musical-score.svg?react';

import {state} from './state';
import {imageDescriptions} from "./imageList.js";
import {useRef, useState} from "react";

const GameOver = ({message}) => <>
    <h1>Game Over</h1>
    <p>{message}</p>
</>

const App = observer(() => {
    const [loading, setLoading] = useState(false);
    const [outcome, setOutcome] = useState(null);
    const [lastImage, setLastImage] = useState(null);
    const audioRef = useRef();
    const active = state.active;

    const handleYes = () => {
        state.updateValues(active.yes);
        setOutcome(active.yesDescription);
        setLastImage(active.image);
        setLoading(true);
        state.next().then(() => {
            setLoading(false);
        });
    };

    const handleNo = () => {
        state.updateValues(active.no);
        setOutcome(active.noDescription);
        setLastImage(active.image);
        setLoading(true);
        state.next().then(() => {
            setLoading(false);
        });
    }

    const handleOutcome = () => {
        setOutcome(null);
        setLastImage(null);
    }

    const toggleMusic = () => {
        if(audioRef.current.paused) {
            audioRef.current.play();
            return;
        }
        audioRef.current.pause();
    }

    let imageId = imageDescriptions.indexOf(outcome ? lastImage : active.image);
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
        <div className={styles.app}>
            <div className={styles.hidden}>
                <audio ref={audioRef} loop={true}>
                    <source src="/TheEntertainer.ogg" type="audio/ogg"/>
                </audio>
            </div>
            <div className={styles.menu}>
                <Music onClick={toggleMusic}/>
            </div>
            <div className={styles.content}>
                <h1>{active.title}</h1>
                <img className={styles.image} src={`/images/${imageId}.png`}/>
                <p>{outcome ? outcome : active.description}</p>
                <div className={styles.btnWrapper}>
                    {outcome ? <>
                        <button disabled={loading} className={styles.btn} onClick={handleOutcome}>Ok</button>
                    </> : <>
                        <button disabled={loading} className={styles.btn} onClick={handleNo}>No</button>
                        <button disabled={loading} className={styles.btn} onClick={handleYes}>Yes</button>
                    </>}
                </div>
            </div>

            <div className={styles.iconWrapper}>
                <ProgressIcon value={state.money} icon={<Money/>}/>
                <ProgressIcon value={state.law} icon={<Law/>}/>
                <ProgressIcon value={state.staff} icon={<Staff/>}/>
                <ProgressIcon value={state.fame} icon={<Fame/>}/>
            </div>
        </div>
    )
});

export default App
