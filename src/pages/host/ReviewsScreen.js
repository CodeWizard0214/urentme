import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import ReactStars from 'react-rating-stars-component';
import InfiniteScroll from 'react-infinite-scroll-component';

import * as Color from '../../constants/color';
import * as APIHandler from '../../apis/APIHandler';
import AppLazyImage from '../../components/elements/AppLazyImage';
import TripReviewCard from '../../components/elements/TripReviewCard';
import AppSpinner from '../../components/loading/AppSpinner';
import CircleMark from '../../components/marks/CircleMark';
import todoIcon from '../../assets/images/mark/todo.svg';

const ReviewsScreen = (props) => {
  const { userItems } = props;
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [renderCount, setRenderCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const RENDER_COUNT = 5;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      let list = [];
      if (isMounted && userItems.length > 0) {
        for (const item of userItems) {
          if (+item.item_review_count > 0) {
            const data = await APIHandler.getItemDetails(item.id);
            if (data.length) {
              list = [...list, ...data[0].reviews];
            }
          }
        }
        list.sort((a, b) => moment(b.modified) - moment(a.modified));
        setReviews(list);
        const sum = list.reduce((a, b) => a + (+b.rating), 0);
        setAvgRating(sum / list.length);
      }
      setLoading(false);
      setRenderCount(list.length < RENDER_COUNT ? list.length : RENDER_COUNT);
    };

    fetchData();
    return () => { isMounted = false; };
  }, [userItems]);

  const fetchMoreData = () => {
    if (renderCount >= reviews.length) {
      setHasMore(false);
    } else {
      setRenderCount(renderCount + RENDER_COUNT);
    }
  }

  const emptyView = (
    <div className="d-flex flex-column align-items-center justify-content-center app-panel-height">
      <CircleMark
        width={110}
        height={110}
        borderColor={Color.PRIMARY_COLOR}
        borderWidth="2px"
        borderStyle="solid"
      >
        <AppLazyImage
          src={todoIcon}
          alt=""
        />
      </CircleMark>
      <span className="fw-600 fs-1p125 gray-36 text-center pt-4">
        No Reviews
      </span>
    </div>
  );

  return (
    <div className="container">
      {loading ? (
        <AppSpinner absolute />
      ) : reviews.length > 0 ? (
        <div className="row">
          <InfiniteScroll
            dataLength={renderCount}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<AppSpinner />}
            scrollableTarget="hosts-content-layout"
          >
            <div className="col-12 bg-white border my-3 p-4">
              <div className="d-flex align-items-center">
                <span className="fw-600 fs-1p0 cod-gray me-3">{avgRating.toFixed(1)}</span>
                {avgRating > 0 && (
                  <ReactStars
                    value={avgRating}
                    color={Color.DISABLE_COLOR}
                    activeColor={Color.PRIMARY_COLOR}
                    size={30}
                    edit={false}
                    isHalf={true}
                  />
                )}
              </div>
              <div className="fw-400 fs-1p0 gray-36">{reviews.length} reviews</div>
            </div>
            <div className="col-12">
              {reviews.slice(0, renderCount).map((review, idx) => (
                <TripReviewCard
                  key={`review-${idx}`}
                  review={review}
                  className="mb-3"
                />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      ) : (
        emptyView
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    userItems: state.userItems,
  };
};

export default connect(mapStateToProps)(ReviewsScreen);
