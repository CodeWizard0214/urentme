import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import LocationCard from '../../components/elements/LocationCard';
import { CustomDot } from '../../components/carousel/CustomDot';
import { DEMO_POPULAR_LOCATIONS } from '../../constants/demos';
import { getWindowDimensions } from '../../utils/windowUtils';
import styles from './DestinationSection.module.css';

export const DestinationSection = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const responsive = {
    exxl: {
      breakpoint: { max: 4000, min: 1800 },
      items: 4,
      partialVisibilityGutter: 60,
    },
    exl: {
      breakpoint: { max: 1799, min: 1600 },
      items: 4,
      partialVisibilityGutter: 10,
    },
    xxl: {
      breakpoint: { max: 1599, min: 1400 },
      items: 3,
      partialVisibilityGutter: 80,
    },
    xl: {
      breakpoint: { max: 1399, min: 1200 },
      items: 3,
      partialVisibilityGutter: 20,
    },
    lg: {
      breakpoint: { max: 1199, min: 992 },
      items: 2,
      partialVisibilityGutter: 120,
    },
    md: {
      breakpoint: { max: 991, min: 768 },
      items: 2,
    },
    sm: {
      breakpoint: { max: 767, min: 576 },
      items: 1,
      partialVisibilityGutter: 170,
    },
    xs: {
      breakpoint: { max: 575, min: 360 },
      items: 1,
      partialVisibilityGutter: windowDimensions.width - 370,
    },
    xxs: {
      breakpoint: { max: 354, min: 0 },
      items: 1,
    }
  };

  return (
    <div className={styles.container}>
      <div className="app-container">
        <div className="mb-4">
          <h3 className="fw-600 fs-1p875 cod-gray">Popular Destinations</h3>
        </div>
        <div className="position-relative">
          <Carousel
            responsive={responsive}
            arrows={false}
            partialVisible={true}
            showDots={true}
            renderDotsOutside={true}
            customDot={<CustomDot />}
            dotListClass={styles.dotList}
          >
            { DEMO_POPULAR_LOCATIONS.map((location, idx) => (
              <Link key={`location-${idx}`} to={`/search?key=${location.name}`}>
                <LocationCard
                  src={location.src}
                  name={location.name}
                  // items={location.items}
                  width="320px"
                  height="240px"
                />
              </Link>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
};