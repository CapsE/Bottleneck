import {useState} from 'react'
import evilCowboy from './assets/evil-cowboy.png';
import styles from './App.module.css';
import {ProgressIcon} from './components/progress-icon';

import Money from './icons/money-stack.svg?react';
import Law from './icons/law-star.svg?react';
import Staff from './icons/person.svg?react';
import Fame from './icons/star-struck.svg?react';

function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <h1>Bottleneck Bar</h1>
            <img className={styles.image} src={evilCowboy} />
            <p>A stranger enters the saloon demanding a free drink while making sure to display the polished sixshooter at his hip.</p>
            <div className={styles.iconWrapper}>
                <ProgressIcon value={25} icon={<Money />} />
                <ProgressIcon value={50} icon={<Law />} />
                <ProgressIcon value={75} icon={<Staff />} />
                <ProgressIcon value={100} icon={<Fame />} />
            </div>
        </>
    )
}

export default App
