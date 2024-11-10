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

const GameOver = ({message}) => <div className={styles.app}>
    <div className={styles.content}>
        <h1>Game Over</h1>
        <p>{message}</p>
    </div>
</div>

const App = observer(() => {
    const [loading, setLoading] = useState(false);
    const [outcome, setOutcome] = useState(null);
    const [lastImage, setLastImage] = useState(null);
    const [lastTitle, setLastTitle] = useState(null);
    const audioRef = useRef();
    const active = state.active;

    const handleYes = () => {
        state.updateValues(active.yes);
        setOutcome(active.yesDescription);
        setLastImage(active.image);
        setLastTitle(active.title);
        setLoading(true);
        state.next().then(() => {
            setLoading(false);
        });
    };

    const handleNo = () => {
        state.updateValues(active.no);
        setOutcome(active.noDescription);
        setLastImage(active.image);
        setLastTitle(active.title);
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
        return <GameOver message="Your saloon is famous but for all the wrong reasons. People make sure to keep away from it forcing you to close." />
    }
    if (state.fame >= 100) {
        return <GameOver message="Your saloon is known all around the country and you can't manage all the customers any longer and decide to close." />
    }
    if (state.staff <= 0) {
        return <GameOver message="Your staff has had enough and they all quit leaving you with no choice but to close the saloon." />
    }
    if (state.staff >= 100) {
        return <GameOver message="Your staff earned a lot of money working for you and with all the experience they gathered they decide to persue their own dreams leaving you so understaffed you have to close." />
    }
    if (state.money <= 0) {
        return <GameOver message="Even the most loyal among you staff won't work without pay and you can't even pay for supplies right now and have to close." />
    }
    if (state.money >= 100) {
        return <GameOver message="Word of your fortune has spread to the wrong people and an outlaw steals all your money leaving you with nothing." />
    }
    if (state.law <= 0) {
        return <GameOver message="Your saloon has become the meeting point of the most vicious gangs keeping away the locals. Since the outlaws are not in the habit of paying their bills you have to close." />
    }
    if (state.law >= 100) {
        return <GameOver message="Your saloon is a shining beacon of law and order... which keeps away all customers except the sherrif and you have to close." />
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
                <h1>{outcome ? lastTitle : active.title}</h1>
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
