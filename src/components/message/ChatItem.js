import React from 'react';

import { FaCheck } from 'react-icons/fa';

import AppLazyImage from '../elements/AppLazyImage';
import CircleMark from '../marks/CircleMark';
import * as Color from '../../constants/color';
import NO_AVATAR from '../../assets/images/logo-small.png';
import styles from './ChatItem.module.css';

const ChatItem = (props) => {
  return (
    <div className={`${styles.chatItem} ${props.active && styles.chatActive}`} onClick={() => props.onClick(props.id)}>
      <div className={styles.avatar}>
        <AppLazyImage
          src={props.avatar}
          alt={""}
          width={45}
          height={45}
          placeholder={NO_AVATAR}
          className="avatar"
        />
      </div>
      <div className={styles.body}>
        <div className="d-flex align-items-baseline">
          <div className="d-flex flex-1-1 align-items-center">
            <div className="fw-400 fs-0p875 black text-ellipsis">{props.title}</div>
            <CircleMark
              width={16}
              height={16}
              bgColor={Color.BLUE_COLOR}
              className="ms-2"
            >
              <FaCheck className="fs-0p5 white" />
            </CircleMark>
          </div>
          <div className="fw-300 fs-0p5 gray-82">{props.dateString}</div>
        </div>
        <div className="d-flex mt-1">
          <div className={`fw-300 fs-0p75 gray-36 ${styles.subTitle}`}>{props.subtitle}</div>
          { props.unread &&
          <CircleMark
            width={16}
            height={16}
            bgColor={Color.PRIMARY_COLOR}
            className="ms-2"
          >
            <span className="fw-400 fs-0p5 white">{props.unread}</span>
          </CircleMark>
          }
        </div>
      </div>
    </div>
  );
};

export default ChatItem;