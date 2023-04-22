import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FiBell } from 'react-icons/fi';

import * as APIHandler from '../../apis/APIHandler';
import * as Constant from '../../constants/constant';
import * as Color from '../../constants/color';
import NotificationCard from '../../components/elements/NotificationCard';
import VehicleImageModal from '../../components/modal/VehicleImageModal';
import AppSpinner from '../../components/loading/AppSpinner';
import CircleMark from '../../components/marks/CircleMark';

const BookingNotifications = (props) => {
  const { userId } = props;
  const [notifications, setNotifications] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [vehicleModal, setVehicleModal] = useState(false);
  const [notiId, setNotiId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [loading, setLoading] = useState(false);
  const RENDER_COUNT = 4;

  useEffect(() => {
    let isMounted = true;
    if (userId) {
      setLoading(true);
      APIHandler.getNotificationList(userId).then(data => {
        if (isMounted) {
          setLoading(false);
          setNotifications(data);
          setRenderCount(data.length < RENDER_COUNT ? data.length : RENDER_COUNT);
        }
      });
    }
    return () => { isMounted = false; };
  }, [userId]);

  const onClickNotification = (id) => {
    const item = notifications.find((e) => e.id === id);
    setNotiId(id);
    if (item.type === Constant.NOTIFICATION_PICKUP_PHOTO
      || item.type === Constant.NOTIFICATION_PHOTO_DECLINED_PICKUP) {
      setBookingId(item.item_id);
      setReviewPhotos(item.pickup_photos);
      setUploadType('pickup');
      setVehicleModal(true);
    } else if (item.type === Constant.NOTIFICATION_RETURN_PHOTO
      || item.type === Constant.NOTIFICATION_PHOTO_DECLINED_RETURN) {
      setBookingId(item.item_id);
      setReviewPhotos(item.return_photos);
      setUploadType('return');
      setVehicleModal(true);
    } else {
      APIHandler.markNotificationAsRead(id);
      setNotifications(notifications.filter((e) => e.id !== id));
    }
  }

  const onUploaded = () => {
    APIHandler.markNotificationAsRead(notiId);
    setNotifications(notifications.filter((e) => e.id !== notiId));
    setVehicleModal(false);
  }

  const fetchMoreData = () => {
    if (renderCount >= notifications.length) {
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
        <FiBell className="fs-3p0 color-primary" />
      </CircleMark>
      <span className="fw-600 fs-1p125 gray-36 text-center pt-4">
        No Notifications Yet
      </span>
    </div>
  );

  return (
    <div className="container">
      { loading ? (
        <AppSpinner absolute />
      ) : (notifications.length > 0 ? (
        <>
          <InfiniteScroll
            dataLength={renderCount}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<AppSpinner />}
            scrollableTarget="trips-notification-layout"
            className="row g-3 mt-2 mb-4"
          >
            {notifications.slice(0, renderCount).map((noti) => (
              <div key={noti.id}>
                <NotificationCard
                  id={noti.id}
                  type={noti.type}
                  message={noti.message}
                  onClick={onClickNotification}
                />
              </div>
            ))}
          </InfiniteScroll>
          <VehicleImageModal
            open={vehicleModal}
            onClose={() => setVehicleModal(false)}
            booking_id={bookingId}
            review_photos={reviewPhotos}
            type={uploadType}
            onFinish={onUploaded}
          />
        </>
      ) : (
        emptyView
      ))}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps)(BookingNotifications);