import styles from './progress-icon.module.css';
export const ProgressIcon = ({value, icon}) => <div className={styles.progressIcon}>
    <div className={styles.positioner}>
        {icon}
    </div>
    <div className={`${styles.positioner} ${styles.foreground}`} style={{height: `${100 - value}%`}}>
        {icon}
    </div>
</div>
