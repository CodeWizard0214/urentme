import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';

import { BsCalendar4 } from 'react-icons/bs';
import { IoLocationOutline } from 'react-icons/io5';

import { getUserAvatar } from '../../utils/imageUrl';
import { getLocation } from '../../utils/stringUtils';
import { getPendingBookings, getPendingTrips } from '../../store/actions/bookingActions';
import AppLazyImage from '../../components/elements/AppLazyImage';
import ConfirmModal from '../../components/modal/ConfirmModal';
import VehicleImageModal from '../../components/modal/VehicleImageModal'
import ReviewModal from '../../components/modal/ReviewModal';
import * as Constant from '../../constants/constant';
import * as APIHandler from '../../apis/APIHandler';
import noAvatar from '../../assets/images/logo-small.png';
import AppSpinner from '../../components/loading/AppSpinner';

const MyBookingCard = (props) => {
  const navigate = useNavigate();
  const { data, userId, getPendingBookings, getPendingTrips } = props;
  const [menuText, setMenuText] = useState('');
  const [menuEnable, setMenuEnable] = useState(true);
  const [tripDate, setTripDate] = useState('');
  const [location, setLocation] = useState('');
  const [reviewModal, setReviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [vehicleModal, setVehicleModal] = useState(false);
  const [booking_id, setBookingId] = useState('');
  const [review_photos, setReviewPhotos] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (!data) {
      return;
    }

    let extern_menu = '';
    let menu_enable = true;
    if (data.status === Constant.STATUS_RECEIVED) {
      extern_menu = 'Item Received From Renter';
    } else if (data.status === Constant.STATUS_PICKUP) {
      const dayOffset = moment(data.start_date).diff(moment(new Date()), 'days') + 1;  
      if (dayOffset <= 1) {
        extern_menu = 'Renter Picked Up';
      }
    } else if (data.status === Constant.STATUS_COMPLETED) {
      if (data.is_released_security_deposit === 0
        || data.is_owner_receivable_sent === 0
      ) {
        extern_menu = "Processing Payment Release";
        menu_enable = false;
      } else if (data.is_owner_give_review === 0) {
        extern_menu = "Leave Review";
      }
    }
    setMenuText(extern_menu);
    setMenuEnable(menu_enable);
    setTripDate(`${moment(data.start_date).format(Constant.DATE_TIME_A_FORMAT)} ~ ${moment(data.end_date).format(Constant.DATE_TIME_A_FORMAT)}`);
    setLocation(getLocation(data.item));
  }, [data]);

  const onProfileInfo = (id) => {
    navigate(`/profile/${id}`);
  }
  
  const nextProcess = () => {
    if (menuText === 'Renter Picked Up') {
      setLoading(true);
      APIHandler.updateBooking(data.id, Constant.STATUS_RECEIVED, 0, 0, 0, 0).then(data => {
        setLoading(false);
        if (data.result) {
          getPendingBookings(userId);
          getPendingTrips(userId);
        }
      });
    } else if (menuText === 'Item Received From Renter') {
      setLoading(true);
      APIHandler.updateBooking(data.id, Constant.STATUS_COMPLETED, 1, 0, 0, 0).then(data => {
        setLoading(false);
        if (data.result) {
          getPendingBookings(userId);
          getPendingTrips(userId);
        }
      });
    } else if (menuText === 'Leave Review') {
      setReviewModal(true);
    }
  };

  const uploadVehicleImages = (booking_id, review_photos, type) => {
    if(review_photos !== '') {
      review_photos = JSON.parse(review_photos);
    }
    setBookingId(booking_id);
    setReviewPhotos(review_photos);
    setType(type);
    setVehicleModal(true);
  }

  const onUploaded = () => {
    setVehicleModal(false);
  }

  const renderBookingUploadButton = (id, is_photos_confirmed, review_photos, type) => {
    return (
      <>
        {(is_photos_confirmed === 2 &&
          null
        ) || (is_photos_confirmed === 0 && !review_photos &&
          <div className="fw-400 fs-0p875 color-primary hand me-4"
            onClick={() => uploadVehicleImages(id, review_photos, type)}>Upload {type} Images</div>
        ) || (is_photos_confirmed === 0 && review_photos &&
          <div className="fw-400 fs-0p875 gray-36 hand me-4">Waiting for Confirmation</div>
        ) || (is_photos_confirmed === 1 &&
          <>
            <span className="fw-400 fs-0p875 color-primary hand me-1"
              onClick={() => uploadVehicleImages(id, review_photos, type)}>Upload {type} Images Again</span>
            <span className="fw-400 fs-0p875 gray-36 ms-4">(Declined)</span>
          </> 
        )}
      </>
    )
  }

  const onCloseModal = () => {
    setShowModal(false);
  }

  const onConfirmModal = () => {
    setShowModal(false);
    setLoading(true);
    APIHandler.updateBooking(data.id, Constant.STATUS_CANCELLED, 0, 0, 0, 0).then(data => {
      getPendingBookings(userId);
      getPendingTrips(userId);
      setLoading(false);
    });
  }

  const cancelDiag = async () => {
    setShowModal(true);
  }

  return (
    <div className="d-flex justify-content-between bg-white border p-4 border-12 position-relative">
      <div>
      <div className="fw-600 fs-1p125 cod-gray mb-2">
          {data.user_info?.username}
        </div>
        <div className="fw-400 fs-1p0 cod-gray mb-2">
          {data.item?.name}
        </div>
        <div className="d-flex flex-wrap flex-sm-nowrap align-items-center mb-2">
          <BsCalendar4 className="gray-36" />
          <span className="fw-400 fs-0p875 gray-36 ms-2">
            {tripDate}
          </span>
        </div>
        <div className="mb-2">
          {location && 
            <>
              <IoLocationOutline className="gray-36" />
              <span className="fw-400 fs-0p875 gray-36 ms-2">{location}</span>
            </>
          }
        </div>
        <div className="d-flex">
          { menuText &&
          <div
            onClick={nextProcess}
            className={`fw-400 fs-0p875 me-4 ${menuEnable && !loading ? "color-primary hand" : "gray-36"}`}
            disabled={!menuEnable || loading}
          >
            {menuText}
          </div>
          }

          {(data.status === Constant.STATUS_PICKUP &&
            renderBookingUploadButton(
              data.id,
              +data.is_pickup_photos_confirmed,
              data.pickup_photos,
              'pickup'
            )
          ) || (data.status === Constant.STATUS_RECEIVED &&
            renderBookingUploadButton(
              data.id,
              +data.is_return_photos_confirmed,
              data.return_photos,
              'return',
            )
          ) }{ (data.status !== Constant.STATUS_COMPLETED &&
            <div
              onClick={cancelDiag}
              className={`fw-400 fs-0p875 color-primary hand`}
            >
              Cancel
            </div>
            )
          }
        </div>
      </div>
      <div>
        <AppLazyImage
          src={getUserAvatar(data.user_info?.img)}
          alt=""
          width={50}
          height={50}
          className="avatar hand"
          placeholder={noAvatar}
          onClick={() => onProfileInfo(data.user_info?.id)}
        />
      </div>
      { loading && <AppSpinner absolute /> }
      <ConfirmModal
        open={showModal}
        onClose={onCloseModal}
        title="Delete"
        text="Are you sure to cancel this trip?"
        primaryButton="Yes"
        onPrimaryClick={onConfirmModal}
        secondaryButton="No"
      />
      <VehicleImageModal
        open={vehicleModal}
        onClose={() => setVehicleModal(false)}
        booking_id={booking_id}
        review_photos={review_photos}
        type={type}
        onFinish={onUploaded}
      />
      <ReviewModal
        open={reviewModal}
        onClose={() => setReviewModal(false)}
        userToReview={data.user_info}
        itemId={data.item_id}
        bookingId={data.id}
        isOwner={true}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps, { getPendingBookings, getPendingTrips })(MyBookingCard);