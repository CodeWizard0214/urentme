import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import moment from 'moment';
import ReadMoreReact from 'read-more-react';
import ReactStars from 'react-rating-stars-component';
import { toast } from 'react-toastify';
import { BsCalendar4, BsChatText } from 'react-icons/bs';
import { FiEdit } from 'react-icons/fi';
import { IoLocationOutline } from 'react-icons/io5';

import * as Color from '../../constants/color';
import * as APIHandler from '../../apis/APIHandler';
import * as Constant from '../../constants/constant';
import OwnerCard from '../../components/elements/OwnerCard';
import AppSpinner from '../../components/loading/AppSpinner';
import MessageModal from '../message/MessageModal';
import DateTimeModal from '../../components/modal/DateTimeModal';
import { setItemTripDate } from '../../store/actions/itemActions';
import { getUserAvatar } from '../../utils/imageUrl';
import { getLocation, getTripsString } from '../../utils/stringUtils';
import styles from './ItemOverviewSection.module.css';

const ItemOverviewSection = (props) => {
  const navigate = useNavigate();
  const { userId, userVerified, reservedTime, setItemTripDate, itemId, itemData } = props;
  const [beginDate, setBeginDate] = useState(0);
  const [endDate, setEndDate] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [tripDate, setTripDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [showCalModal, setShowCalModal] = useState(false);

  useEffect(() => {
    setBeginDate(reservedTime.beginDate);
    setEndDate(reservedTime.endDate);
    setStartTime(reservedTime.startTime);
    setEndTime(reservedTime.endTime);
  }, [reservedTime]);

  useEffect(() => {
    const begin = moment(beginDate).set('hour', startTime).set('minute', 0);
    const end = moment(endDate).set('hour', endTime).set('minute', 0);
    const selDate =
      moment(begin).format(Constant.DATE_TRIP_PERIOD_FORMAT) +
      ' - ' +
      moment(end).format(Constant.DATE_TRIP_PERIOD_FORMAT);
    setTripDate(selDate);
  }, [beginDate, endDate, startTime, endTime]);

  const onMessage = () => {
    if (!userId) {
      toast.error('Please login first');
      return;
    }

    setShowMsgModal(true);
  }

  const onBooking = () => {
    if (!userId) {
      toast.error('Please login first');
      return;
    }

    if (!userVerified) {
      toast.error('Please verify your phone number and driver license in account profile first');
      return;
    }

    setLoading(true);
    APIHandler.checkBookable(itemId,
      beginDate.format(Constant.DATE_SAVE_FORMAT),
      endDate.format(Constant.DATE_SAVE_FORMAT)
    ).then(data => {
      setLoading(false);
      if (data.result === '0') {
        toast.error("This item isn't available at the dates and times you've selected");
        return;
      }

      setItemTripDate({
        itemId,
        beginDate,
        endDate,
        startTime,
        endTime
      });

      navigate(`/checkout/${itemId}`);
    })
  }

  const changeTripDates = () => {
    setShowCalModal(true);
  }

  const onChangeTripDates = (beginD, endD, startT, endT) => {
    setBeginDate(moment(beginD));
    setEndDate(moment(endD));
    setStartTime(startT);
    setEndTime(endT);
  }

  return (
    <div className="row g-2 position-relative">
      <div className="col-md-6 mb-2 mb-lg-3 mb-xl-4">
        <div className="fw-600 fs-1p125 cod-gray mb-2">{itemData?.name}</div>
        {(+itemData.item_review_count) > 0 ? (
          <div className="d-flex align-items-center">
            <span className="fw-500 fs-0p875 gray-36 me-1">{Number(itemData.item_review_rating_avg).toFixed(1)}</span>
            <ReactStars
              value={+itemData.item_review_rating_avg}
              color={Color.DISABLE_COLOR}
              activeColor={Color.PRIMARY_COLOR}
              count={1}
              size={14}
              edit={false}
            />
            <span className="fw-300 fs-0p75 quick-silver ms-1">({getTripsString(itemData.item_review_count)})</span>
          </div>
        ) : (
          <div className="fw-300 fs-0p75 quick-silver">(no trips)</div>
        )}
        <div className="d-flex align-items-center mt-2">
          <span className="fw-600 fs-1p125 color-primary">${itemData.rent_per_day}</span>
          <span className="fw-400 fs-0p875 quick-silver ms-3">Per Day</span>
        </div>
      </div>
      <div className="col-md-6 mb-2 mb-lg-3 mb-xl-4">
        <div className="fw-600 fs-1p125 cod-gray mb-2">Hosted by</div>
        <OwnerCard
          id={itemData.user_id}
          image={getUserAvatar(itemData.user_img)}
          name={itemData.user_name}
          review={itemData.renter_review_count}
          rate={itemData.renter_review_rating_avg}
          verified={(+itemData.user_verify) === 1}
        />
      </div>
      <div className="col-md-6 mb-2 mb-lg-3 mb-xl-4">
        <div className="d-flex align-items-center mb-2">
          <div className="fw-600 fs-1p125 cod-gray">Trip Dates</div>
          <FiEdit className="fp-20 color-primary hand ms-3" onClick={changeTripDates} />
        </div>
        <div className="d-flex align-items-center">
          <BsCalendar4 className="fp-16 gray-36" />
          <span className="fw-400 fs-0p875 gray-36 ms-2">{tripDate}</span>
        </div>
      </div>
      <div className="col-md-6 mb-2 mb-lg-3 mb-xl-4">
        <div className="fw-600 fs-1p125 cod-gray mb-2">Cancelation Policy</div>
        <Link to="/policy/cancelation" className="fw-400 fs1p0 gray-36 decoration-none">URentMe Cancellation Policy</Link>
      </div>
      <div className="col-md-6 mb-2 mb-lg-3 mb-xl-4">
        <div className="fw-600 fs-1p125 cod-gray mb-2">Pickup &amp; Return</div>
        <div className="d-flex">
          <IoLocationOutline className="fs-1p125 gray-36" />
          <span className="fw-400 fs-1p0 gray-36 ms-1">{getLocation(itemData)}</span>
        </div>
      </div>
      {itemData?.description &&
      <div className="col-md-6 mb-2 mb-lg-3 mb-xl-4">
        <div className="fw-600 fs-1p125 cod-gray mb-2">Overview</div>
        <div className={styles.readmore}>
          <ReadMoreReact
            text={itemData?.description}
            min={20}
            ideal={60}
            max={80}
            readMoreText="Read More"
          />
        </div>
      </div>
      }
      
      {!props.hideButtons &&
      <>
      <div className="col-6 mb-2">
        <button
          className="btn btn-app-primary px-4"
          disabled={itemData && itemData.blocked}
          onClick={onBooking}
        >{itemData && itemData.blocked ? 'Blocked' : 'Book Now'}</button>
      </div>
      <div className="col-6 mb-2">
        <button className="btn btn-outline-app-primary px-3" onClick={onMessage}>
          <BsChatText />
        </button>
      </div>
      </>
      }
      {loading && <AppSpinner absolute />}
      <MessageModal
        open={showMsgModal}
        onClose={() => setShowMsgModal(false)}
        userId={userId}
        ownerData={{
          id: itemData.user_id,
          avatar: itemData.user_img,
          name: itemData.user_name,
          review: itemData.renter_review_count,
          rate: itemData.renter_review_rating_avg,
          verified: (+itemData.user_verify) === 1,
          itemId: itemData.id
        }}
      />
      <DateTimeModal
        itemId={itemId}
        title="Select Dates"
        open={showCalModal}
        onClose={() => setShowCalModal(false)}
        beginDate={beginDate}
        endDate={endDate}
        startTime={startTime}
        endTime={endTime}
        fromMonth={true}
        onChange={onChangeTripDates}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    userId: state.userId,
    userVerified: state.userVerified,
    reservedTime: state.reservedTime,
  };
}

export default connect(mapStateToProps, { setItemTripDate })(ItemOverviewSection);
