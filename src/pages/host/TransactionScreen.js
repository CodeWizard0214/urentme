import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';

import AppLazyImage from '../../components/elements/AppLazyImage';
import BookingCard from '../../components/elements/BookingCard';
import CircleMark from '../../components/marks/CircleMark';
import AppSpinner from '../../components/loading/AppSpinner';
import { getUserAvatar } from '../../utils/imageUrl';
import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';
import todoIcon from '../../assets/images/mark/todo.svg';

const TransactionScreen = (props) => {
  const { pendingBookings } = props;
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const RENDER_COUNT = 5;

  useEffect(() => {
    const list = pendingBookings.filter((e) => [Constant.STATUS_CANCELLED, Constant.STATUS_COMPLETED, Constant.STATUS_DISPUTED].includes(e.status));
    list.sort((a, b) => moment(b.created) - moment(a.created));
    setTransactions(list);
    setRenderCount(list.length < RENDER_COUNT ? list.length : RENDER_COUNT);
  }, [pendingBookings]);

  const fetchMoreData = () => {
    if (renderCount >= transactions.length) {
      setHasMore(false);
    } else {
      setRenderCount(renderCount + RENDER_COUNT);
    }
  }

  const onProfileInfo = (id) => {
    navigate(`/profile/${id}`);
  }

  const emptyView = (
    <div className="d-flex flex-column align-items-center justify-content-center app-content-height">
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
        No Transactions
      </span>
    </div>
  );

  return (
    <div className="container">
      { transactions.length > 0 ?
      <InfiniteScroll
        dataLength={renderCount}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<AppSpinner />}
        scrollableTarget="app-content-layout"
        className="row g-3 mx-3 my-4"
      >
        { transactions.slice(0, renderCount).map((data, idx) => (
          <BookingCard
            key={data.id}
            cardType={Constant.BOOKING_CARD_TYPE_USER}
            id={data.id}
            mainImage={getUserAvatar(data.user_info?.img)}
            mainTitle={data.user_info?.username}
            onMainImageClick={() => onProfileInfo(data.user_info?.id)}
            subTitle={data.item?.name}
            startDate={data.start_date}
            endDate={data.end_date}
            created={data.created}
            city={data.item?.city}
            state={data.item?.state}
            status={data.status}
            price={data.tripe_price}
          />
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
    pendingBookings: state.pendingBookings,
  }
}

export default connect(mapStateToProps)(TransactionScreen);