import React from 'react';
import moment from 'moment';

import { FaStar } from 'react-icons/fa';
import { FiUpload, FiCheck, FiRotateCw } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

import CircleMark from '../marks/CircleMark';
import styles from './NotificationCard.module.css';
import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';

const NotificationCard = (props) => {

  const getNotificationMark = (type) => {
    switch (type) {
      case Constant.NOTIFICATION_PICKUP_PHOTO:
      case Constant.NOTIFICATION_RETURN_PHOTO:
        return (
          <CircleMark bgColor={Color.PRIMARY_COLOR}>
            <FiUpload className="white" />
          </CircleMark>
        );
      case Constant.NOTIFICATION_PHOTO_ACCEPTED_PICKUP:
      case Constant.NOTIFICATION_PHOTO_ACCEPTED_RETURN:
        return (
          <CircleMark bgColor={Color.BLUE_COLOR}>
            <FiCheck className="white" />
          </CircleMark>
        );
      case Constant.NOTIFICATION_PHOTO_DECLINED_PICKUP:
      case Constant.NOTIFICATION_PHOTO_DECLINED_RETURN:
        return (
          <CircleMark bgColor={Color.RED_COLOR}>
            <AiOutlineClose className="white" />
          </CircleMark>
        );
      case Constant.NOTIFICATION_IC_PENDING:
        return (
          <CircleMark bgColor={Color.GREEN_COLOR}>
            <FiRotateCw className="white" />
          </CircleMark>
        );
      default:
        return (
          <CircleMark bgColor={Color.PRIMARY_COLOR}>
            <FaStar className="white" />
          </CircleMark>
        );
    }
  }

  const getNotificationTitle = (type) => {
    switch (type) {
      case Constant.NOTIFICATION_PICKUP_PHOTO:
      case Constant.NOTIFICATION_RETURN_PHOTO:
        return 'Upload Photos';
      case Constant.NOTIFICATION_PHOTO_ACCEPTED_PICKUP:
      case Constant.NOTIFICATION_PHOTO_ACCEPTED_RETURN:
        return 'Photos are Accepted';
      case Constant.NOTIFICATION_PHOTO_DECLINED_PICKUP:
      case Constant.NOTIFICATION_PHOTO_DECLINED_RETURN:
        return 'Photos are Declined';
      default:
        return 'New Notification';
    }
  }

  const onClick = () => {
    if (props.onClick) {
      props.onClick(props.id);
    }
  }

  return (
    <div className={styles.card} onClick={onClick}>
      <div className="d-flex flex-row p-2p0">
        {getNotificationMark(props.type)}
        <div className="w-100">
          <div className="d-flex flex-row justify-content-between">
            <span className="fw-600 fs-1p125 black ms-3 mb-2">{getNotificationTitle(props.type)}</span>
            <span className="fw-400 fs-1p0 gray-36">{moment(props.created).format(Constant.DATE_FORMAT)}</span>
          </div>
          <div className="fw-400 fs-0p875 gray-36 ms-3">{props.message}</div>
          <div className="fw-400 fs-1p0 color-primary ms-3 mt-2">#{props.id}</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;