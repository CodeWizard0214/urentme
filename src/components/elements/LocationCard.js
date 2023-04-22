import React from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import AppLazyImage from './AppLazyImage';
import styles from './LocationCard.module.css';

const LocationCard = (props) => {
  return (
    <div
      className={styles.card}
      style={{width: props.width ?? "320px", height: props.height ?? "240px"}}
    >
      <AppLazyImage
        alt={props.name}
        src={props.src}
        width="100%"
        height="100%"
      />
      <div className={styles.overlay}>
        <div className={styles.caption}>
          { props.name &&
          <div className="d-flex flex-row align-items-center">
            <IoLocationOutline className="fs-1p125 white" />
            <span className="fw-500 fs-1p375 white ms-1">{props.name}</span>
          </div>
          }
          { props.items &&
          <span className="fw-500 fs-1p0 white">{props.items} items</span>
          }
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
