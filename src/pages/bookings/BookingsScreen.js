import React, { useState, useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";

import InfiniteScroll from 'react-infinite-scroll-component';

import AppLazyImage from "../../components/elements/AppLazyImage";
import AppSpinner from "../../components/loading/AppSpinner";
import CircleMark from '../../components/marks/CircleMark';
import MyBookingCard from "./MyBookingCard";
import { getPendingBookings } from '../../store/actions/bookingActions';
import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';
import todoIcon from '../../assets/images/mark/todo.svg';

const BookingsScreen = (props) => {
  const { userId, pendingBookings, getPendingBookings } = props;
  const [bookingList, setBookingList] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const RENDER_COUNT = 5;

  useEffect(() => {
    getPendingBookings(userId);
  }, [userId, getPendingBookings]);

  useEffect(() => {
    let data = pendingBookings.filter(
      (e) => [Constant.STATUS_PICKUP, Constant.STATUS_RECEIVED].includes(e.status)
      || (e.status === Constant.STATUS_COMPLETED && e.is_owner_give_review !== 1));
    data.sort((a, b) => b.status - a.status);
    data.sort((a, b) => b.is_owner_receivable_sent - a.is_owner_receivable_sent);
    data.sort((a, b) => moment(b.created) - moment(a.created));
    setBookingList(data);
    setRenderCount(data.length < RENDER_COUNT ? data.length : RENDER_COUNT);
  }, [pendingBookings]);

  const fetchMoreData = () => {
    if (renderCount >= bookingList.length) {
      setHasMore(false);
    } else {
      setRenderCount(renderCount + RENDER_COUNT);
    }
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
        No Bookings
      </span>
    </div>
  );

  return (
    <div className="container position-relative">
      { bookingList.length > 0 ?
      <InfiniteScroll
        dataLength={renderCount}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<AppSpinner />}
        scrollableTarget="app-content-layout"
        className="row g-3 mx-3 my-4"
      >
        {bookingList.slice(0, renderCount).map((data) => (
          <MyBookingCard key={data.id} data={data} />
        ))}
      </InfiniteScroll>
      :
      emptyView
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
    pendingBookings: state.pendingBookings,
  };
};

export default connect(mapStateToProps, { getPendingBookings })(BookingsScreen);