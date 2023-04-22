import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';

import AppLazyImage from '../../components/elements/AppLazyImage';
import CircleMark from '../../components/marks/CircleMark';
import AppSpinner from '../../components/loading/AppSpinner';
import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';
import * as APIHandler from '../../apis/APIHandler';
import todoIcon from '../../assets/images/mark/todo.svg';
import BookingCard from '../../components/elements/BookingCard';
import ConfirmModal from '../../components/modal/ConfirmModal';
import { getPendingTrips } from '../../store/actions/bookingActions';
import { getDefaultImageUri, getUserAvatar } from '../../utils/imageUrl';
import { convertStringToNumber } from '../../utils/stringUtils';
import ReviewModal from '../../components/modal/ReviewModal';

const TripsPending = (props) => {
  const navigate = useNavigate();
  const { pendings, userId, itemImages, getPendingTrips } = props;
  const [renderCount, setRenderCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingId, setBookingId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({});
  const [ownerInfo, setOwnerInfo] = useState({});
  const RENDER_COUNT = 5;

  useEffect(() => {
    setRenderCount(pendings.length < RENDER_COUNT ? pendings.length : RENDER_COUNT);
    setLoading(false);
  }, [pendings]);

  const fetchMoreData = () => {
    if (renderCount >= pendings.length) {
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

  const onCloseModal = () => {
    setShowModal(false);
  }

  const onConfirmModal = () => {
    setShowModal(false);
    setLoading(true);
    APIHandler.updateBooking(bookingId, Constant.STATUS_CANCELLED, 0, 0, 0, 0).then(data => {
      getPendingTrips(userId);
      // loading status is changed when new data is loaded
      // setLoading(false);
    });
  }

  const onCancelBooking = (id) => {
    setShowModal(true);
    setBookingId(id);
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
        No Pending Trips
      </span>
    </div>
  );

  const reviewProcess = async (data, name) => {
    setReviewData(data);
    setOwnerInfo(data.owner_info);
    if(name === "Leave Review") {
      setReviewModal(true);
    }
  };

  const renderTrips = (data) => {
    const owner = data.owner_info;
    const tripe_price = Number(convertStringToNumber(data.base_rental_amount) * 1.03 + 0.02).toFixed(2);
    let extern_menu = '';
    let menu_enable = true;
    if (data.status === Constant.STATUS_COMPLETED) {
      if (
        data.is_released_security_deposit === 0 ||
        data.is_owner_receivable_sent === 0
      ) {
        extern_menu = 'Processing Payment Release';
        menu_enable = false;
      } else if (data.is_renter_give_review === 0) {
        extern_menu = 'Leave Review';
      }
    }

    return (
      <BookingCard
        key={data.id}
        cardType={Constant.BOOKING_CARD_TYPE_PENDING}
        mainImage={getDefaultImageUri(itemImages, data.item_id, 130)}
        mainTitle={data.item?.name}
        onMainImageClick={() => onTripDetail(data.item_id)}
        subImage={getUserAvatar(owner?.img)}
        subTitle={owner?.username}
        onSubImageClick={() => onProfileInfo(owner?.id)}
        userid={owner?.id}
        userVerify={owner?.email_verify}
        startDate={data.start_date}
        endDate={data.end_date}
        dateFormat="MMM DD, hh:00 A"
        created={data.created}
        city={data.item?.city}
        state={data.item?.state}
        price={tripe_price}
        menuName={extern_menu}
        menuEnabled={menu_enable}
        onCancel={() => onCancelBooking(data.id)}
        leaveReview={() => reviewProcess(data, extern_menu)}
      />
    );
  }

  return (
    <div className="container">
      {loading ? (
        <AppSpinner absolute />
      ): (pendings?.length > 0 ? (
        <InfiniteScroll
          dataLength={renderCount}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<AppSpinner />}
          scrollableTarget="trips-pending-layout"
          className="row g-3 mt-2"
        >
          { pendings.slice(0, renderCount).map((data, idx) => (
            renderTrips(data)
          ))}
        </InfiniteScroll>
      ) :(
        emptyView
      ))}

      <ConfirmModal
        open={showModal}
        onClose={onCloseModal}
        title="Cancel"
        text="Are you sure to cancel this trip?"
        primaryButton="Yes"
        onPrimaryClick={onConfirmModal}
        secondaryButton="No"
      />
      <ReviewModal
        open={reviewModal}
        onClose={() => setReviewModal(false)}
        userToReview={ownerInfo}
        itemId={reviewData.item_id}
        bookingId={reviewData.id}
        isOwner={false}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    userId: state.userId,
    itemImages: state.allItemImages,
  }
}
export default connect(mapStateToProps, { getPendingTrips })(TripsPending);