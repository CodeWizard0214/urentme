import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';

import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { FaCheck } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import { toast } from 'react-toastify';

import AppLazyImage from '../elements/AppLazyImage';
import { getUserAvatar } from "../../utils/imageUrl";
import { getPendingBookings, getPendingTrips } from "../../store/actions/bookingActions";
import CircleMark from "../marks/CircleMark";
import AppSpinner from '../loading/AppSpinner';
import noAvatar from '../../assets/images/logo-medium.png';
import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';
import * as APIHandler from "../../apis/APIHandler";

const ReviewModal = (props) => {
  const { userToReview, itemId, bookingId, userId, isOwner, getPendingBookings, getPendingTrips } = props;
  const [open, setOpen] = useState(false);
  const [rate, setRate] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  const onChangeRate = (val) => {
    setRate(val);
  }

  const onChangeFeedback = (e) => {
    setFeedback(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    setLoading(true);
    APIHandler.sendReview(userId, itemId, bookingId, feedback, rate).then(data => {
      if (data.result) {
        const is_renter_give_review = isOwner ? 0 : 1;
        const is_owner_give_review = isOwner ? 1 : 0;
        APIHandler.updateBooking(bookingId, Constant.STATUS_COMPLETED, 1, is_renter_give_review, is_owner_give_review, 0).then(data => {
          setLoading(false);
          if (data.result) {
            if (isOwner) {
              getPendingBookings(userId);
            } else {
              getPendingTrips(userId);
            }
            onCloseModal();
          } else {
            toast.error('Please try again');
          }
        });
      } else {
        setLoading(false);
        toast.error('Please try again');
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      center
      classNames={{ root: "z-1050", modal: "border-12 position-relative" }}
    >
      <div className="modal-body text-center">
        <AppLazyImage
          src={getUserAvatar(userToReview.img)}
          alt=""
          width={100}
          height={100}
          className="avatar"
          placeholder={noAvatar}
        />
        <span
          type="button"
          className="btn-close float-end z-1050"
          onClick={onCloseModal}
        />
        <div className="d-flex justify-content-center align-items-center mt-2">
          <span className="fw-600 fs-1p0 code-gray me-2">{userToReview.username}</span>
          {userToReview.email_verify && (
            <CircleMark
              width={16}
              height={16}
              bgColor={Color.BLUE_COLOR}
              className="ms-1"
            >
              <FaCheck className="fp-10 white" />
            </CircleMark>
          )}
        </div>
        <div className="fw-600 fs-1p25 cod-gray text-center me-2 mt-4">
          Please rate:
        </div>
        <div className="fw-400 fs-1p0 bright-gray text-center">
            Your feedback will help improve driving experience
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group d-flex flex-column align-items-center">
            <textarea
              row="3"
              placeholder="Write your message..."
              className="form-control fw-400 fs-0p875 oxford-blue app-form-control order-2"
              style={{height: "120px"}}
              onChange={onChangeFeedback}
              disabled={loading}
            />
            <div className="order-1">
              <ReactStars
                color={Color.DISABLE_COLOR}
                activeColor={Color.PRIMARY_COLOR}
                value={rate}
                size={56}
                edit={!loading}
                disabled={loading}
                onChange={onChangeRate}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={feedback.length === 0 || loading}
            className="btn btn-app-primary fw-400 fs-1p0 white px-3 mx-auto mt-4"
          >Submit Review</button>
        </form>
      </div>
      { loading && <AppSpinner absolute /> }
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps, { getPendingBookings, getPendingTrips })(ReviewModal);
