import React from 'react';

import AppLazyImage from './AppLazyImage';
import styles from './FeedbackCard.module.css';
import noImage from '../../assets/images/noimage.jpg'

const FeedbackCard = (props) => {
  return (
    <div className={styles.card}
      style={{width: props.width ?? "380px", height: props.height ?? "420px"}}
    >
      <div className={styles.imageItem}>
        <AppLazyImage
          src={props.image}
          alt={props.name}
          placeholder={noImage}
          width="auto"
          height={56}
        />
      </div>
      <h3 className={styles.title}>{props.name}</h3>
      <div className={styles.summary}>{props.designation}</div>
      <div className={styles.speakBubble}>
        <div className={`${styles.feedback} list-scrollbar list-scrollbar-autohide`}>
          <div className="fw-400 fs-0p875 gray-36 text-center" dangerouslySetInnerHTML={{__html: props.content}} />
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;