import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import ItemVertCard from '../../components/elements/ItemVertCard';
import { ArrowButtonGroup } from '../../components/carousel/ArrowButtonGroup';
import styles from './NearbySection.module.css';
import { MAX_NEARBY_COUNTS, NEARBY_RADIUS } from '../../constants/constant';
import { Shuffle } from '../../utils/arrayShuffle';
import { getDefaultImageUri } from '../../utils/imageUrl';

const NearbySection = (props) => {
  const [status, setStatus] = useState('');
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        let radius = 0.1;
        let searchedList = [];
        while (
          searchedList.length < MAX_NEARBY_COUNTS
          && radius < NEARBY_RADIUS
        ) {
          const list = props.allItems.filter(
            // eslint-disable-next-line no-loop-func
            (e) =>
              Math.abs(e.longitude - longitude) < radius
              && Math.abs(e.latitude - latitude) < radius
          );
          if (list.length > 0) {
            searchedList = list;
          }
          radius += 0.3;
        }
        if (searchedList.length === 0) {
          setStatus('No Nearby Listings');
        } else {
          setStatus('');
          setItemList(Shuffle(searchedList.slice(0, MAX_NEARBY_COUNTS)));
        }
      });
    }
  }, [props.allItems]);

  const isFeatured = (id) => {
    return  (props.wishItems.length > 0) && props.wishItems.find((e) => (+e.item_id) === id);
  }

  const responsive = {
    exxl: {
      breakpoint: { max: 4000, min: 1800 },
      items: 4,
      partialVisibilityGutter: 0,
    },
    exl: {
      breakpoint: { max: 1799, min: 1600 },
      items: 3,
      partialVisibilityGutter: 80,
    },
    xxl: {
      breakpoint: { max: 1599, min: 1400 },
      items: 3,
      partialVisibilityGutter: 0,
    },
    xl: {
      breakpoint: { max: 1399, min: 1000 },
      items: 2,
      partialVisibilityGutter: 0,
    },
    md: {
      breakpoint: { max: 999, min: 0 },
      items: 1,
      partialVisibilityGutter: 0,
    }
  };

  return (
    <div className={styles.container}>
      <div className="app-container">
        <div className="d-flex justify-content-between align-items-baseline mb-4">
          <h3 className="fw-600 fs-1p875 cod-gray">Nearby Listings</h3>
          { itemList.length > 0 &&
          <Link to={`/search?key=NearBy&tag=`} className='text-decoration-none'>
            <span className="fw-600 fs-0p875 eerie-black hand">View All</span>
          </Link>
          }
        </div>
        { itemList.length > 0 ?
        <div className={styles.carousel}>
          <Carousel
            responsive={responsive}
            partialVisible={true}
            arrows={false}
            renderButtonGroupOutside={true}
            customButtonGroup={<ArrowButtonGroup />}
          >
            { itemList.map((item) => (
              <ItemVertCard
                key={`nearby-${item.id}`}
                id={item.id}
                src={getDefaultImageUri(props.itemImages, item.id, 360)}
                name={item.name}
                rate={+item.item_review_rating_avg}
                review={item.item_review_count}
                cost={item.rent_per_day}
                featured={isFeatured(item.id)}
              />
            ))}
          </Carousel>
        </div>
        :
        <div className="fw-500 fs-1p5 gray-77">{status}</div>
        }
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    allItems: state.allItems,
    itemImages: state.allItemImages,
    wishItems: state.wishItems,
  };
}

export default connect(mapStateToProps)(NearbySection);