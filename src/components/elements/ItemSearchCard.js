import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ReactStars from 'react-rating-stars-component';
import { toast } from 'react-toastify';
import { IoLocationOutline } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa';

import * as Color from '../../constants/color';
import * as APIHandler from '../../apis/APIHandler';
import { getWishItems } from '../../store/actions/itemActions';
import { getTripsString } from '../../utils/stringUtils';
import AppLazyImage from './AppLazyImage';
import HeartMark from '../marks/HeartMark';
import CircleMark from '../marks/CircleMark';
import AppSpinner from '../loading/AppSpinner';
import noImage from '../../assets/images/noimage.jpg';
import noAvatar from '../../assets/images/logo-small.png';
import styles from './ItemSearchCard.module.css';

const ItemSearchCard = (props) => {
  const navigate = useNavigate();
  const { userId } = props;
  const [loading, setLoading] = useState(false);

  const onItemDetail = () => {
    if (props.itemId) {
      navigate(`/items/${props.itemId}`);
    }
  }

  const onProfileInfo = () => {
    if (props.ownerId) {
      navigate(`/profile/${props.ownerId}`);
    }
  }

  const onHeartClick = (e) => {
    e.stopPropagation();
    if (!userId) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    APIHandler.setWishItem((+userId), props.itemId, props.featured ? 0 : 1).then(data => {
      if (data.type !== 'success') {
        setLoading(false);
        toast.error(data.response);
        return;
      }
      setLoading(false);
      props.getWishItems(userId);
    });
  }

  return (
    <div className={`${styles.card} ${props.className}`}>
      <div className={styles.imageContainer}>
        <AppLazyImage
          src={props.itemImg}
          alt={""}
          width="200px"
          height="142px"
          className={styles.itemImage}
          placeholder={noImage}
          onClick={onItemDetail}
        />
        <AppLazyImage
          src={props.ownerImg}
          alt=""
          width={48}
          height={48}
          placeholder={noAvatar}
          className="avatar avatar-border"
          wrapperClassName={styles.avatar}
          onClick={onProfileInfo}
        />
      </div>
      <div className={`d-flex flex-column justify-content-center overflow-hidden ${styles.textContainer}`}>
        <div className={`fw-400 fs-1p0 cod-gray text-ellipsis mb-1 mb-lg-3 ${props.showHeart ? styles.itemName : ""}`}>{props.itemName}</div>
        <div className="d-flex align-items-center">
          <span className="fw-400 fs-1p0 cod-gray">{props.ownerName}</span>
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
          <div className="d-flex align-items-center mt-1">
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
          <span className="fw-300 fs-0p75 gray-65 mt-1">(no trips)</span>
        }
        <div className="d-flex align-items-center mt-1 mt-lg-3">
          <span><IoLocationOutline className="fp-16 cod-gray" /></span>
          <span className="fw-300 fs-0p75 cod-gray text-ellipsis ms-1">{props.location}</span>
        </div>
      </div>
      {loading && <AppSpinner absolute />}
      {props.showHeart && <HeartMark className={styles.heartCircle} onClick={onHeartClick} checked={props.featured} />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps, { getWishItems })(ItemSearchCard);