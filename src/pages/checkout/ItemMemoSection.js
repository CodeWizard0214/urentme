import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";

import ReactStars from 'react-rating-stars-component';
import { BsCalendar4 } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { IoLocationOutline } from 'react-icons/io5';

import * as Color from '../../constants/color';
import { getDefaultImageUri, getUserAvatar } from '../../utils/imageUrl';
import { getLocation, getTripsString } from '../../utils/stringUtils';
import AppLazyImage from '../../components/elements/AppLazyImage';
import noImage from '../../assets/images/noimage.jpg';
import noAvatar from '../../assets/images/logo-small.png';
import styles from './ItemMemoSection.module.css';
import CircleMark from '../../components/marks/CircleMark';

const ItemMemoSection = (props) => {
  const { itemData, tripDate, tripDays } = props;
  const navigate = useNavigate();

  const onProfileInfo = (id) => {
    if (id) {
      navigate(`/profile/${id}`);
    }
  }

  return (
    <>
      <div className="fw-600 fs-1p125 cod-gray mt-5 mb-3">{itemData.name}</div>
      <div className={`d-flex flex-column flex-lg-row pb-5 ${styles.container}`}>
        <div className="d-flex flex-column flex-md-row flex-grow-1">
          <div className="d-flex flex-column flex-md-row">
            <AppLazyImage
              src={getDefaultImageUri(props.itemImages, itemData.id, 340)}
              alt=""
              placeholder={noImage}
              className={styles.itemImage}
            />
            <div className="d-flex align-items-center justify-content-center">
              <AppLazyImage
                src={getUserAvatar(itemData.user_img)}
                alt=""
                width={48}
                height={48}
                placeholder={noAvatar}
                className={styles.avatar}
                onClick={() => onProfileInfo(itemData.user_id)}
              />
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center align-items-md-start me-4">
            <div className="d-flex align-items-center">
              <span className="fw-400 fs-1p0 cod-gray text-ellipsis">{itemData.user_name}</span>
              {itemData.user_verify === "1" &&
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
            {(+itemData.renter_review_count) > 0 ?
              <div className="d-flex align-items-center mt-2">
                <span className="fw-500 fs-0p875 gray-36 me-1">{Number(itemData.renter_review_rating_avg).toFixed(1)}</span>
                <ReactStars
                  value={+itemData.renter_review_count}
                  color={Color.DISABLE_COLOR}
                  activeColor={Color.PRIMARY_COLOR}
                  count={1}
                  size={14}
                  edit={false}
                />
                <span className="fw-300 fs-0p75 quick-silver ms-1">({getTripsString(itemData.renter_review_count)})</span>
              </div>
              :
              <div className="fw-300 fs-0p75 quick-silver">(no trips)</div>
            }
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row mt-3 mt-lg-0 flex-grow-1">
          <div className="d-flex flex-column justify-content-center mt-3 mt-md-0 me-4 flex-grow-1">
            <div className="fw-600 fs-1p125 cod-gray">Trip dates</div>
            <div className="d-flex align-items-center mt-2">
              <BsCalendar4 className="fs-0p875 gray-36" />
              <span className="fw-400 fs-0p875 gray-36 ms-1">{tripDate} ({tripDays} days)</span>
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center mt-3 mt-md-0 flex-grow-1">
            <div className="fw-600 fs-1p125 cod-gray">Pickup &amp; Return</div>
            <div className="d-flex align-items-center mt-2">
              <IoLocationOutline className="fs-0p875 gray-36" />
              <span className="fw-400 fs-0p875 gray-36 ms-1">{getLocation(itemData)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    itemImages: state.allItemImages,
  };
}

export default connect(mapStateToProps)(ItemMemoSection);