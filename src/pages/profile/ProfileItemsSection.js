import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import InfiniteScroll from 'react-infinite-scroll-component';

import AppSpinner from '../../components/loading/AppSpinner';
import ItemHorzCard from '../../components/elements/ItemHorzCard';
import { getDefaultImageUri } from '../../utils/imageUrl';

const ProfileItemsSection = (props) => {
  const { items, allItemImages, wishItems } = props;
  const [renderCount, setRenderCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const RENDER_COUNT = 6;

  useEffect(() => {
    setRenderCount(items && items.length < RENDER_COUNT ? items.length : RENDER_COUNT);
  }, [items]);

  const fetchData = () => {
    if (renderCount >= items.length) {
      setHasMore(false);
    } else {
      setRenderCount(renderCount + RENDER_COUNT);
    }
  };

  const isFeatured = (id) => {
    return (wishItems.length > 0) && wishItems.find((e) => (+e.item_id) === id);
  }

  return (
    <div className={props.className}>
      <div className="fw-600 fs-1p125 cod-gray mb-3">Listed Vehicles</div>
      {items && items.length > 0 ?
        <div id="listScroll"
          className="list-scrollbar position-relative px-3"
          style={{ maxHeight: "380px" }}
        >
          <InfiniteScroll
            dataLength={renderCount}
            next={fetchData}
            hasMore={hasMore}
            loader={<AppSpinner absolute />}
            scrollableTarget="listScroll"
            className="row g-3"
          >
          {items.slice(0, renderCount).map((data, idx) => (
            <div key={`item-${data.id}`} className="col-lg-6">
              <ItemHorzCard
                src={getDefaultImageUri(allItemImages, data.id, 200)}
                id={data.id}
                name={data.name}
                rate={+data.item_review_rating_avg}
                review={data.item_review_count}
                cost={data.rent_per_day}
                showHeart={true}
                featured={isFeatured(data.id)}
              />
            </div>
          ))}
          </InfiniteScroll>
        </div>
        :
        <div className="fw-400 fs-1p0 gray-36">No items</div>
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    allItemImages: state.allItemImages,
    wishItems: state.wishItems,
  };
};

export default connect(mapStateToProps)(ProfileItemsSection);