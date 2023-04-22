import React from 'react';

import ReactStars from 'react-rating-stars-component';
import { FaCheck } from 'react-icons/fa';

import * as Color from '../../constants/color';
import CircleMark from '../marks/CircleMark';
import { getTripsString } from '../../utils/stringUtils';
import styles from './MapItem.module.css';

const MapItem = (props) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <a href={`items/${props.itemId}`} className={styles.itemWrapper}>
          <img
            src={props.itemImg}
            alt=""
            className={styles.itemImage}
          />
        </a>
        <img
          src={props.ownerImg}
          alt=""
          className={styles.avatar}
        />
      </div>
      <div className={`d-flex flex-column justify-content-center ${styles.textContainer}`}>
        <div className="fw-400 fs-1p0 cod-gray text-ellipsis">{props.itemName}</div>
        <div className="d-flex align-items-center mt-3 mt-md-2">
          <span className="fw-400 fs-0p875 cod-gray">{props.ownerName}</span>
          {props.verified &&
          <CircleMark
            width={16}
            height={16}
            bgColor={Color.BLUE_COLOR}
            className="ms-1"
          >
            <FaCheck className="fp-10 white" />
          </CircleMark>
          }
        </div>
        {(+props.review) > 0 ?
        <div className="d-flex align-items-center mt-3 mt-md-2">
          <span className="fw-500 fs-0p875 gray-36 me-2">{Number(props.rate).toFixed(1)}</span>
          <ReactStars
            value={+props.rate}
            color={Color.DISABLE_COLOR}
            activeColor={Color.PRIMARY_COLOR}
            size={20}
            edit={false}
            count={1}
          />
          <span className="fw-300 fs-0p75 gray-65 ms-2">({getTripsString(props.review)})</span>
        </div>
        :
        <span className="fw-300 fs-0p75 gray-65 mt-3 mt-md-2">(no trips)</span>
        }
        {(+props.cost) &&
        <div className="d-flex align-items-center mt-3 mt-md-2">
          <span className="fw-400 fs-0p875 gray-36 me-3">Per day</span>
          <span className="fw-400 fs-0p875 cod-gray">${Number(props.cost).toFixed(2)}</span>
        </div>
        }
      </div>
    </div>
  );
}

export default MapItem;