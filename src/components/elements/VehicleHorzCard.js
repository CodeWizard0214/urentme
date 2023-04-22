import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { BsCalendar4 } from 'react-icons/bs';
import { IoLocationOutline } from 'react-icons/io5';

import AppLazyImage from './AppLazyImage';
import DateRangeModal from '../modal/DateRangeModal';
import noImage from '../../assets/images/noimage.jpg';
import styles from './VehicleHorzCard.module.css';
import * as APIHandler from '../../apis/APIHandler';
import * as Constant from '../../constants/constant';

const VehicleHorzCard = (props) => {

  const [showCalModal, setShowCalModal] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);

  useEffect(() => {
    let isMounted = true;
    APIHandler.getBlockDateList(props.id).then(data => {
      if (isMounted) {
        const dates = data.map(e => e.block_date);
        setBlockedDates(dates);
      }
    });
    return () => { isMounted = false; };
  }, [props.id]);

  const addBlockDates = () => {    
    setShowCalModal(true);
  }

  const onChangeBlockDates = (dates) => {
    setBlockedDates(dates);
    setShowCalModal(false);
  }

  return (
    <div className={styles.card}>
      <div className={styles.itemImage}>
        <AppLazyImage
          src={props.src}
          alt=""
          width="100%"
          height="100%"
          placeholder={noImage}
        />
      </div>
      <div className="d-flex flex-column justify-content-center w-100 mt-3 mt-lg-0 ms-lg-4">
        <div className="row">
          <div className="d-flex align-items-center justify-content-between mb-xl-3">
            <span className={`fw-600 fs-1p125 cod-gray flex-grow-1 text-ellipsis ${styles.title}`}>{props.name}</span>
            <span className="fw-400 fs-0p875 gray-36 ms-2">#{props.id}</span>
          </div>
          <div className="col-6 mt-2 col-lg-12 align-items-center mb-xl-2">
            <BsCalendar4 className="fs-0p875 gray-36" />
            <span className="fw-400 fs-0p875 gray-36 ms-2">{moment(props.created).format(Constant.DATE_FORMAT)}</span>
          </div>
          <div className="col-6 mt-2 col-lg-12 align-items-center mb-xl-2">
            <IoLocationOutline className="fs-1p25 gray-36" />
            <span className="fw-400 fs-0p875 gray-36 ms-2">{(props.city || '') + ', ' + (props.state || '')}</span>
          </div>
          <span className="col-6 col-lg-4 mt-2 fw-400 fs-0p875 gray-36">{props.status === 0 ? 'Waiting approval' : 'listed'}</span>
          <div className="col-6 mt-2 col-lg-8 text-end">
            <span className="fw-400 fs-1p0 color-primary hand" onClick={addBlockDates}>Add Block out Dates</span>
            <Link to={`/host/${props.id}`} className="fw-400 fs-1p0 gray-36 decoration-none hand ms-3">Edit</Link>
          </div>
        </div>
      </div>
      <DateRangeModal
        itemId={props.id}
        title="Select Block Dates"
        open={showCalModal}
        onClose={() => setShowCalModal(false)}
        initDays={blockedDates}
        onSuccess={onChangeBlockDates}
      />
    </div>
  );
};

export default VehicleHorzCard;