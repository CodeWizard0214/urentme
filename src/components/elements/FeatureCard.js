import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import ReactStars from 'react-rating-stars-component';
import { toast } from 'react-toastify';

import * as Color from '../../constants/color';
import * as APIHandler from '../../apis/APIHandler';
import { getWishItems } from '../../store/actions/itemActions';
import { getTripsString } from '../../utils/stringUtils';
import HeartMark from '../marks/HeartMark';
import AppSpinner from '../loading/AppSpinner';
import styles from './FeatureCard.module.css';
import AppLazyImage from './AppLazyImage';
import noImage from '../../assets/images/noimage.jpg';

const FeatureCard = (props) => {
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
      // setIsFeatured(!isFeatured);
      props.getWishItems(userId);
    });
  }

  return (
    <div className={`${styles.card}`} onClick={onItemClick}>
      <div className={`col-12 col-md-6 position-relative ${styles.itemImage}`}>
        <div className={`d-flex align-items-center w-100`}>
          <AppLazyImage
            src={props.src}
            alt=""
            placeholder={noImage}
            className={styles.imageItem}
            wrapperClassName={styles.imageWrapper}
          />
        </div>
        {loading && <AppSpinner absolute />}
        <HeartMark className={styles.heartCircle} onClick={onHeartClick} checked={featured} />
      </div>
      <div className="col-12 col-md-6 d-md-flex align-items-center ps-md-2 ps-lg-4 ps-xl-5">
        <div className={`row ${styles.caption}`}>
          <div className="col-8 order-1 col-md-12 mb-md-1 mb-lg-3 mb-xl-4">
            <h3 className={styles.itemName}>{props.name}</h3>
          </div>
          {(+props.review) > 0 ?
          <div className="col-4 d-flex flex-row align-items-center justify-content-end order-2 col-md-12 justify-content-md-start order-md-4">
            <span className={styles.itemRate}>{Number(props.rate).toFixed(1)}</span>
            <ReactStars
              value={+props.rate}
              color={Color.DISABLE_COLOR}
              activeColor={Color.PRIMARY_COLOR}
              size={14}
              edit={false}
              isHalf={true}
            />
            <span className="fw-300 fp-12 white ms-2">({getTripsString(props.review)})</span>
          </div>
          :
          <span className="fw-300 fp-12 white">(no trips)</span>
          }
          <div className="col-6 mt-3 order-3 col-md-12 mb-md-1 mb-lg-3 mb-xl-4">
            <h3 className={styles.itemCost}>${props.cost}</h3>
          </div>
          <div className="col-6 mt-3 text-end order-4 col-md-12 text-md-start order-md-2">
            <span className={styles.perDay}>Per Day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps, {getWishItems})(FeatureCard);
