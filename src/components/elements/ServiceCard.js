import React from 'react';

import styles from './ServiceCard.module.css';

const ServiceCard = (props) => {
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

export default ServiceCard;