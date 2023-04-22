import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { BsCalendar4 } from 'react-icons/bs';
import { IoLocationOutline } from 'react-icons/io5';
import { FiCheck } from 'react-icons/fi';

import BookMark from '../marks/BookMark';
import CircleMark from '../marks/CircleMark';
import AppLazyImage from './AppLazyImage';
import styles from './BookingCard.module.css';
import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';
import noAvatar from '../../assets/images/logo-small.png';
import noImage from '../../assets/images/noimage.jpg';

const BookingCard = (props) => {
  const { status } = props;
  const [statusText, setStatusText] = useState('');
  
  useEffect(() => {
    setStatusText(status === Constant.STATUS_COMPLETED ? 'Completed'
      : status === Constant.STATUS_CANCELLED ? 'Cancelled' : 'Disputed');
  }, [status]);

  return (
    <div className={`d-flex align-items-center align-items-sm-stretch ${styles.card}`}>
      <div className="d-flex flex-column flex-md-row">
        <AppLazyImage
          src={props.mainImage}
          alt=""
          width={130}
          height={130}
          placeholder={props.cardType === Constant.BOOKING_CARD_TYPE_USER ? noAvatar : noImage}
          className={`${styles.itemImage} ${props.onMainImageClick && "hand"}`}
          onClick={props.onMainImageClick}
        />
        {props.subImage &&
        <div className="d-flex align-items-center justify-content-center">
          <AppLazyImage
            src={props.subImage}
            alt=""
            width={48}
            height={48}
            placeholder={noAvatar}
            className="avatar avatar-border"
            wrapperClassName={`${styles.avatar} ${props.onSubImageClick && "hand"}`}
            onClick={props.onSubImageClick}
          />
        </div>
        }
      </div>
      
      <div className="row w-100">
      <div className="row align-items-center ms-2">
        <div className="col-12 fw-600 fs-1p125 cod-gray">{props.mainTitle}</div>
        <div className="col-5 d-flex flex-wrap flex-sm-nowrap align-items-center">
          {props.cardType === Constant.BOOKING_CARD_TYPE_PENDING || props.cardType === Constant.BOOKING_CARD_TYPE_HISTORY ?
          <>
            <span className="fw-400 fs-0p875 gray-36 me-2">By</span>
            <span className="fw-400 fs-0p875 cod-gray text-ellipsis me-2">{props.subTitle}</span>
            {props.userVerify === 1 &&
            <CircleMark
              width={12}
              height={12}
              bgColor={Color.BLUE_COLOR}
            >
              <FiCheck className="white" />
            </CircleMark>
            }
          </>
          :
          <span className="fw-400 fs-0p875 gray-36 text-ellipsis">{props.subTitle}</span>
          }
        </div>
        <div className="col-7 d-flex flex-wrap flex-sm-nowrap align-items-center">
          <BsCalendar4 />
          <span className="fw-400 fs-0p875 gray-36 ms-2">{moment(props.startDate).format(props.dateFormat ?? Constant.DATE_FORMAT)} ~ {moment(props.endDate).format(props.dateFormat ?? Constant.DATE_FORMAT)}</span>
        </div>
        <div className="col-5 fw-400 fs-0p875 gray-36">{moment(props.created).format(Constant.DATE_FORMAT)}</div>
        <div className="col-7">
          { (props.city || props.state) &&
          <>
            <IoLocationOutline />
            <span className="fw-400 fs-0p875 gray-36 ms-2">{(props.city || '')}, {(props.state || '')}</span>
          </>
          }
        </div>
        {props.cardType === Constant.BOOKING_CARD_TYPE_PENDING ?
        <div className="d-flex justify-content-end">
          {props.menuName ?
          <div disabled={!(props.menuEnabled ?? true)}>
            <span className={`fw-400 ps-0p875 hand ${props.menuEnabled ? "color-primary" : "gray-36"}`} onClick={props.leaveReview}>
              {props.menuName}
            </span>
          </div>
          :
          <div className="ms-2">
            <span className="fw-400 ps-0p875 red-orange hand" onClick={props.onCancel}>Cancel</span>
          </div>
          }
        </div>
        :
        <>
          <div className="col-5 fw-400 fs-0p875 gray-36">#{props.id}</div>
          <div className="col-7 fw-400 fs-0p875 gray-36">{statusText}</div>
        </>
        }
      </div>
      </div>
      <div className={styles.bookmark}>
        <BookMark
          bgColor={status===undefined ? Color.PRIMARY_COLOR : status === 6 ? Color.GREEN_COLOR : Color.RED_COLOR}
          value={props.price}
        />
      </div>
    </div>
  );
};

export default BookingCard;