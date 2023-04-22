import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ReactStars from 'react-rating-stars-component';
import { toast } from 'react-toastify';

import * as Color from '../../constants/color';
import * as APIHandler from '../../apis/APIHandler';
import { getWishItems } from '../../store/actions/itemActions';
import { getTripsString } from '../../utils/stringUtils';
import AppLazyImage from './AppLazyImage';
import HeartMark from '../marks/HeartMark';
import AppSpinner from '../loading/AppSpinner';
import noImage from '../../assets/images/noimage.jpg';
import styles from './ItemHorzCard.module.css';

const ItemHorzCard = (props) => {
  const navigate = useNavigate();
  const { userId, featured } = props;
  const [loading, setLoading] = useState(false);

  const onItemClick = () => {
    navigate(`/items/${props.id}`);
  }

  const onHeartClick = (e) => {
    e.stopPropagation();
    if (!userId) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    APIHandler.setWishItem((+userId), props.id, featured ? 0 : 1).then(data => {
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
    <div className={styles.card} onClick={onItemClick}>
      <div className={`col-6 col-sm-5 col-md-4 ${styles.itemImage}`}>
        <AppLazyImage
          src={props.src}
          alt={""}
          width="200px"
          height="142px"
          placeholder={noImage}
        />
      </div>
      <div className="d-flex flex-column mt-4">
        <span className="fw-400 fs-1p0 cod-gray">{props.name}</span>
        {(+props.review) > 0 ?
        <div className="d-flex align-items-center mt-3 mt-md-2">
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
        <span className="fw-300 fs-0p75 gray-65 mt-3 mt-md-2">(no trips)</span>
        }
        {(+props.cost) &&
        <div className="d-flex align-items-center mt-3 mt-md-2">
          <span className="fw-400 fs-0p875 gray-36 me-3">Per day</span>
          <span className="fw-400 fs-0p875 cod-gray">${Number(props.cost).toFixed(2)}</span>
        </div>
        }
      </div>
      {loading && <AppSpinner absolute />}
      {props.showHeart && <HeartMark className={styles.heartCircle} onClick={onHeartClick} checked={featured} />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps, {getWishItems})(ItemHorzCard);