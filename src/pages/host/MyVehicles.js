import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AiOutlineCar } from 'react-icons/ai';

import VehicleHorzCard from '../../components/elements/VehicleHorzCard';
import CircleMark from '../../components/marks/CircleMark';
import AppSpinner from '../../components/loading/AppSpinner';
import { getUserItems } from '../../store/actions/itemActions';
import { getDefaultImageUri } from '../../utils/imageUrl';
import * as Color from '../../constants/color';

const MyVehicles = (props) => {
  const { userId, userItems, itemImages, getUserItems } = props;
  const [myItems, setMyItems] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const RENDER_COUNT = 3;

  useEffect(() => {
    if (userId) {
      getUserItems(userId);
    }
  }, [userId, getUserItems]);

  useEffect(() => {
    setLoading(true);
    if (userItems.length > 0) {
      let items = userItems;
      items.sort((a, b) => moment(b.created) - moment(a.created));
      // items.sort((a, b) => a.status - b.status);
      setMyItems(items);
      setRenderCount(items.length < RENDER_COUNT ? items.length : RENDER_COUNT);
    }
    setLoading(false);
  }, [userItems]);

  const fetchMoreData = () => {
    if (renderCount >= myItems.length) {
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
        <AiOutlineCar className="fs-3p0 color-primary mt-2" />
      </CircleMark>
      <span className="fw-600 fs-1p125 gray-36 text-center pt-4">
        No Vehicles
      </span>
    </div>
  );

  return (
    <div className="container">
      {loading ? (
        <AppSpinner absolute />
      ) : myItems.length > 0 ? (
      <div className="row">
        <InfiniteScroll
          dataLength={renderCount}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<AppSpinner />}
          scrollableTarget="hosts-content-layout"
        >
          {myItems.slice(0, renderCount).map((item) => (
            <div key={item.id} className="p-3">
              <VehicleHorzCard
                id={item.id}
                src={getDefaultImageUri(itemImages, item.id, 320)}
                name={item.name}
                created={item.created}
                city={item.city}
                state={item.state}
                status={item.status}
              />
            </div>
          ))}
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
    useId: state.userId,
    userItems: state.userItems,
    itemImages: state.allItemImages,
  }
}
export default connect(mapStateToProps, { getUserItems })(MyVehicles);