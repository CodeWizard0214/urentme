import React from 'react';
import AppLazyImage from '../../components/elements/AppLazyImage';
import styles from './MemberCard.module.css';

const MemberCard = (props) => {
  return (
    <div className={styles.card} onClick={() => props.onClick(props.text)}>
      <div className={styles.image}>
      <AppLazyImage
        src={props.image}
        alt={props.name}
        width="100%"
        height="auto"
      />
      </div>
      <div className="fw-600 fs-1p125 color-primary mt-2">{props.name}</div>
      <div className="fw-400 fs-1p0 gray-36 text-center mt-2">{props.designation}</div>
    </div>
  );
};

export default MemberCard;