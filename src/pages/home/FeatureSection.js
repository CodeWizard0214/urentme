
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import FeatureCard from '../../components/elements/FeatureCard';
import { CustomDot } from '../../components/carousel/CustomDot';
import styles from './FeatureSection.module.css';
import { getAllItems } from '../../store/actions/itemActions';
import { Shuffle } from '../../utils/arrayShuffle';
import { getDefaultImageUri } from '../../utils/imageUrl';
import { MAX_FEATURE_COUNT } from '../../constants/constant';

const FeatureSection = (props) => {
  const { allItems, itemImages, wishItems, getAllItems } = props;
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  useEffect(() => {
    const list = allItems?.filter((item) => item.item_review_count > 0);
    setItemList(Shuffle(list).slice(0, MAX_FEATURE_COUNT));
  }, [allItems]);

  const isFeatured = (id) => {
    return (wishItems.length > 0) && wishItems.find((e) => (+e.item_id) === id);
  }

  const responsive = {
    all: {
      breakpoint: { max: 4000, min: 0 },
      items: 1,
    },
  };

  return (
    <div className={styles.container}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-baseline mb-4">
          <h3 className="fw-600 fs-1p875 cod-gray">Featured</h3>
          { itemList.length > 0 &&
          <Link to={`/search?key=Featured&tag=`} className='text-decoration-none'>
            <span className="fw-600 fs-0p875 eerie-black hand">View All</span>
          </Link>
          }
        </div>
        { itemList.length > 0 ?
        <div className="position-relative">
          <Carousel
            responsive={responsive}
            arrows={false}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            showDots={true}
            renderDotsOutside={true}
            customDot={<CustomDot />}
            dotListClass={styles.dotList}
            itemClass={styles.carouselItem}
          >
            { itemList.map((item, idx) => (
              <FeatureCard
                key={`featured-${item.id}`}
                id={item.id}
                src={getDefaultImageUri(itemImages, item.id, 600)}
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
        <div className="fw-500 fs-1p5 gray-77">No featured items</div>
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

export default connect(mapStateToProps, { getAllItems })(FeatureSection);