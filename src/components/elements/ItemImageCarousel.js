import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { toast } from 'react-toastify';

import * as APIHandler from '../../apis/APIHandler';
import { getWishItems } from '../../store/actions/itemActions';
import AppLazyImage from './AppLazyImage';
import HeartMark from '../marks/HeartMark';
import AppSpinner from '../loading/AppSpinner';
import noImage from '../../assets/images/noimage.jpg';
import styles from './ItemImageCarousel.module.css';

const ItemImageCarousel = (props) => {
  const { id, images, userId } = props;
  const [isFeatured, setIsFeatured]  = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFeatured(props.featured);
  }, [props.featured]);

  const onHeartClick = (e) => {
    e.stopPropagation();
    if (!userId) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    APIHandler.setWishItem((+userId), id, isFeatured ? 0 : 1).then(data => {
      if (data.type !== 'success') {
        setLoading(false);
        toast.error(data.response);
        return;
      }
      setLoading(false);
      setIsFeatured(!isFeatured);
      props.getWishItems(userId);
    });
  }

  const responsive = {
    all: {
      breakpoint: { max: 4000, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="position-relative">
      { images && images.length > 0 ?
      <Carousel
        responsive={responsive}
        infinite={props.infinite ?? false}
        itemClass={styles.carouselItem}
      >
        { images.map((image, idx) => (
        <div key={`image-${idx}`}>
          <AppLazyImage
            src={image}
            alt=""
            width="100%"
            height="100%"
            placeholder={noImage}
            wrapperClassName={styles.image}
          />
        </div>
        ))}
      </Carousel>
      :
      <AppLazyImage
        src={noImage}
        alt=""
        className={styles.image}
      />
      }
      {loading && <AppSpinner absolute />}
      <HeartMark className={styles.heartCircle} onClick={onHeartClick} checked={isFeatured} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps, {getWishItems})(ItemImageCarousel);