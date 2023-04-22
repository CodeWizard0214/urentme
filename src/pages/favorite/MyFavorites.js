import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';
import { BsHeart } from 'react-icons/bs';

import ItemHorzCard from '../../components/elements/ItemHorzCard';
import CircleMark from '../../components/marks/CircleMark';
import AppSpinner from '../../components/loading/AppSpinner';
import { getDefaultImageUri } from '../../utils/imageUrl';
import * as Color from '../../constants/color';

const MyFavorites = (props) => {
  const { wishItems, itemImages } = props;
  const [itemList, setItemList] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const RENDER_COUNT = 8;

  useEffect(() => {
    setItemList(wishItems);
    setRenderCount(wishItems.length < RENDER_COUNT ? wishItems.length : RENDER_COUNT);
  }, [wishItems]);

  const fetchMoreData = () => {
    if (renderCount >= itemList.length) {
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
        <BsHeart className="fs-3p0 color-primary mt-2" />
      </CircleMark>
      <span className="fw-600 fs-1p125 gray-36 text-center pt-4">
        No Favorites Yet
      </span>
    </div>
  );

  return (
    <div className="container">
      { itemList.length > 0 ?
      <InfiniteScroll
        dataLength={renderCount}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<AppSpinner />}
        scrollableTarget="app-content-layout"
        className="row g-3 mx-3 my-4"
      >
        { itemList.slice(0, renderCount).map((fav, idx) => (
          <div key={fav.id} className="col-xl-6">
            <ItemHorzCard
              src={getDefaultImageUri(itemImages, fav.item?.id, 200)}
              id={fav.item?.id}
              name={fav.item?.name}
              rate={+fav.item?.item_review_rating_avg}
              review={fav.item?.item_review_count}
              cost={fav.item?.rent_per_day}
              featured={true}
              showHeart={true}
            />
          </div>
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
    wishItems: state.wishItems,
    itemImages: state.allItemImages,
  }
}
export default connect(mapStateToProps)(MyFavorites);