import React, { useState, useEffect } from 'react';
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
import styles from './ItemVertCard.module.css';

const ItemVertCard = (props) => {
  const navigate = useNavigate();
  const { userId } = props;
  const [isFeatured, setIsFeatured]  = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFeatured(props.featured);
  }, [props.featured]);

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
    APIHandler.setWishItem((+userId), props.id, isFeatured ? 0 : 1).then(data => {
      if (data.type !== 'success') {
        setLoading(false);
        toast.error(data.response);
        return;
      }
      setLoading(false);
      // setIsFeatured(!isFeatured);
      props.getWishItems(userId);
    });
  }

  return (
    <div
      className={styles.card}
      style={{width: props.width ?? "380px", height: props.height ?? "360px"}}
      onClick={onItemClick}
    >
      <div className={styles.imageWrapper}>
        <AppLazyImage
          src={props.src}
          alt={props.name}
          width="100%"
          height="auto"
          placeholder={noImage}
          className={styles.itemImage}
        />
        {loading && <AppSpinner absolute />}
        <HeartMark className={styles.heartCircle} onClick={onHeartClick} checked={isFeatured} />
      </div>
      <div className="d-flex align-items-baseline justify-content-between mt-3">
        <h3 className="fw-400 fs-1p125 gray-36 flex-1-1 text-ellipsis me-2">{props.name}</h3>
        {(+props.review) > 0 ?
        <div className="d-flex flex-row align-items-center">
          <span className="fw-500 fs-0p875 gray-36 me-2">{Number(props.rate).toFixed(1)}</span>
          <ReactStars
            value={+props.rate}
            color={Color.DISABLE_COLOR}
            activeColor={Color.PRIMARY_COLOR}
            size={14}
            edit={false}
            isHalf={true}
          />
          <span className="fw-300 fs-0p75 gray-65">({getTripsString(props.review)})</span>
        </div>
        :
        <span className="fw-300 fs-0p75 gray-65">(no trips)</span>
        }
      </div>
      {(+props.cost) &&
      <div className="d-flex align-items-baseline justify-content-between mt-2">
        <h3 className="fw-600 fs-1p125 color-primary">${Number(props.cost).toFixed(2)}</h3>
        <span className="fw-300 fs-0p875 gray-65">Per Day</span>
      </div>
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps, {getWishItems})(ItemVertCard);
