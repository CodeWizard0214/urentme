import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';

import AppLazyImage from '../../components/elements/AppLazyImage';
import CircleMark from '../../components/marks/CircleMark';
import AppSpinner from '../../components/loading/AppSpinner';
import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';
import todoIcon from '../../assets/images/mark/todo.svg';
import BookingCard from '../../components/elements/BookingCard';
import { getDefaultImageUri, getUserAvatar } from '../../utils/imageUrl';

const TripsHistory = (props) => {
  const navigate = useNavigate();
  const [renderCount, setRenderCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const RENDER_COUNT = 5;

  useEffect(() => {
    setRenderCount(props.histories.length < RENDER_COUNT ? props.histories.length : RENDER_COUNT);
  }, [props.histories]);

  const fetchMoreData = () => {
    if (renderCount >= props.histories.length) {
      setHasMore(false);
    } else {
      setRenderCount(renderCount + RENDER_COUNT);
    }
  }

  const onProfileInfo = (id) => {
    navigate(`/profile/${id}`);
  }

  const onTripDetail = (id) => {
    navigate(`/trips/${id}`);
  }

  const emptyView = (
    <div className="d-flex flex-column align-items-center justify-content-center trips-history-height">
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
        No History
      </span>
    </div>
  );

  const renderTrips = (data) => {
    const owner = data.owner_info;

    return (
      <BookingCard
        key={data.id}
        cardType={Constant.BOOKING_CARD_TYPE_HISTORY}
        id={data.id}
        mainImage={getDefaultImageUri(props.itemImages, data.item_id, 130)}
        mainTitle={data.item?.name}
        onMainImageClick={() => onTripDetail(data.item_id)}
        subImage={getUserAvatar(owner?.img)}
        subTitle={owner?.username}
        onSubImageClick={() => onProfileInfo(owner?.id)}
        userid={owner?.id}
        userVerify={owner?.email_verify}
        startDate={data.start_date}
        endDate={data.end_date}
        dateFormat={Constant.DATE_FORMAT}
        created={data.created}
        city={data.item?.city}
        state={data.item?.state}
        price={data.tripe_price}
        status={data.status}
      />
    );
  }

  return (
    <div className="container">
      {props.histories?.length > 0 ?
      <InfiniteScroll
        dataLength={renderCount}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<AppSpinner />}
        scrollableTarget="trips-history-layout"
        className="row g-3 mt-2"
      >
        {props.histories.slice(0, renderCount).map((data) => (
          renderTrips(data)
        ))}
      </InfiniteScroll>
      :
      emptyView
      }
    </div>
  );
};

const mapStateToProps = state => {
  return {
    itemImages: state.allItemImages,
  }
}
export default connect(mapStateToProps)(TripsHistory);