import React from 'react';

import styles from './ProcessCard.module.css';

const ProcessCard = (props) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconCircle}>
        <img src={props.icon} alt="" className={styles.icon} />
      </div>
      <div className={styles.title}>
        {props.title}
      </div>
      <div className={styles.text}>
        {props.text}
      </div>
    </div>
  );
};

export default ProcessCard;