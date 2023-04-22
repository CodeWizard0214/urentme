import React from 'react';
import moment from 'moment';
import { FaCheck } from 'react-icons/fa';

import AppLazyImage from '../elements/AppLazyImage';
import CircleMark from '../marks/CircleMark';
import NO_AVATAR from '../../assets/images/logo-small.png';
import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';
import styles from './MessageBox.module.css';

const MessageBox = (props) => {
  return (
    <div className={styles.container}>
      <div className={props.position==='left'?"float-left":"float-right"}>
        <div className="d-flex">
          { props.position === 'left' &&
          <div className={styles.avatar}>
            <AppLazyImage
              src={props.avatar}
              alt={""}
              width={24}
              height={24}
              placeholder={NO_AVATAR}
              className="avatar"
            />
          </div>
          }
          { props.position === 'right' && props.sent &&
          <div className="d-flex align-items-end me-1">
            <CircleMark
              width={12}
              height={12}
              bgColor={Color.PRIMARY_COLOR}
            >
              <FaCheck className="fp-6 white" />
            </CircleMark>
          </div>
          }
          <div className={styles.mbox}>
            <div className={`fw-300 fs-0p5 gray-82 mb-1 ${props.position==='left'?"text-start":"text-end"}`}>{moment(props.timestamp).format(Constant.DATE_TIME_FORMAT)}</div>
            <div className={`${styles.textbox} ${props.position==='left'?styles.left:styles.right}`}>
              <div className="fw-300 fs-0p75 word-break">{props.text}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;