import React from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { toast } from 'react-toastify';

import TripReviewCard from '../../components/elements/TripReviewCard';
import { CustomDot } from '../../components/carousel/CustomDot';
import styles from './ProfileReviewSection.module.css';

const ProfileReviewSection = (props) => {
  const navigate = useNavigate();
  const { userId, reviews } = props;

  const onReadAll = () => {
    if (!userId) {
      toast.error('Please login first');
      return;
    }

    navigate('/host/reviews');
  }

  const responsive = {
    xxl: {
      breakpoint: { max: 4000, min: 1200},
      items: 3,
    },
    xl: {
      breakpoint: { max: 1199, min: 769},
      items: 2,
    },
    md: {
      breakpoint: { max: 768, min: 0},
      items: 1,
    }
  }

  return (
    <div className={props.className}>
      <div className="fw-600 fs-1p125 cod-gray mb-3">Reviews</div>
      { reviews?.length ?
      <div className={styles.carousel}>
        <Carousel
          responsive={responsive}
          arrows={false}
          showDots={reviews.length > 1}
          renderDotsOutside={true}
          customDot={<CustomDot />}
          dotListClass={styles.dotList}
          itemClass={styles.carouselItem}
        >
          { reviews.map((review, idx) => (
            <TripReviewCard
              key={`trip-review-${idx}`}
              review={review}
              className={styles.card}
              readmore
            />
          ))}
        </Carousel>
        {reviews.length > 1 &&
        <div className={styles.readAll}>
          <span className="fw-600 fs-0p875 color-primary d-none" onClick={onReadAll}>Read All Reviews</span>
        </div>
        }
      </div>
      :
      <div className="fw-500 fs-1p0 gray-36">No reviews</div>
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps)(ProfileReviewSection);