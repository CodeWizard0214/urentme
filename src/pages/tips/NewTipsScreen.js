import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import AppLazyImage from '../../components/elements/AppLazyImage';
import { ArrowButtonGroup } from '../../components/carousel/ArrowButtonGroup';
import * as APIHandler from '../../apis/APIHandler';
import AppSpinner from '../../components/loading/AppSpinner';
import { getTipImage, getTipActiveImage } from '../../utils/imageUrl';
import styles from './NewTipsScreen.module.css';

const NewTripsScreen = () => {
  const { search } = useLocation();
  const [tips, setTips] = useState([]);
  const [index, setIndex] = useState(0);
  const [initialIndex, setInitialIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    APIHandler.getTipsContent().then(data => {
      if (isMounted && data.length > 0) {
        const list = data.sort((a, b) => (+a.list_order) - (+b.list_order));
        setTips(list);
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const params = queryString.parse(search);
    if (params?.tab) {
      setInitialIndex((+params.tab) - 1);
    }
  }, [search]);

  useEffect(() => {
    if (tips.length > 0 && initialIndex > 0 && initialIndex < tips.length) {
      setIndex(initialIndex);
    }
  }, [initialIndex, tips]);

  const onSelectIndex = (idx) => {
    setIndex(idx);
  }

  const renderItem = (idx, tip) => {
    return (
      <div
        key={`tip-${tip.id}`}
        className={`white hand ${styles.item}`}
        onClick={() => onSelectIndex(idx)}
      >
        <div>
          <AppLazyImage
            src={idx !== index ? getTipImage(tip.id) : getTipActiveImage(tip.id)}
            alt={tip.name}
            width={109}
            height={109}
          />
        </div>
        <span className="fw-400 fs-1p0 black text-center mt-2">{tip.name}</span>
      </div>
    );
  }

  const responsive = {
    xxl: {
      breakpoint: { max: 4000, min: 1400 },
      items: 6,
    },
    xl: {
      breakpoint: { max: 1399, min: 1200 },
      items: 5,
    },
    lg: {
      breakpoint: { max: 1199, min: 992 },
      items: 4,
    },
    md: {
      breakpoint: { max: 991, min: 768 },
      items: 3,
    },
    sm: {
      breakpoint: { max: 767, min: 576 },
      items: 2,
    },
    xs: {
      breakpoint: { max: 575, min: 360 },
      items: 1,
    },
    xxs: {
      breakpoint: { max: 354, min: 0 },
      items: 1,
    }
  };

  return (
    <div className="container pt-4">
      {tips.length > 0 ? (
        <>
          <div className={styles.carousel}>
            <Carousel
              responsive={responsive}
              partialVisible={true}
              arrows={false}
              renderButtonGroupOutside={true}
              customButtonGroup={<ArrowButtonGroup />}
            >
              {tips.map((tip, idx) =>
                renderItem(idx, tip)
              )}
            </Carousel>
          </div>
          <div className={`p-4 ${styles.content}`}>
            <div dangerouslySetInnerHTML={{ __html: tips[index].contents }} />
          </div>
        </>
      ) : (
        <AppSpinner absolute />
      )}
    </div>
  );
};

export default NewTripsScreen;