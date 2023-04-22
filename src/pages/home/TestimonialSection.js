import React, { useEffect, useState } from 'react';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import FeedbackCard from '../../components/elements/FeedbackCard';
import { ArrowButtonGroup } from '../../components/carousel/ArrowButtonGroup';
import { getTestimonialImage } from '../../utils/imageUrl';
import * as APIHandler from '../../apis/APIHandler';
import styles from './TestimonialSection.module.css';

export const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let isMounted = true;
    APIHandler.getTestimonials().then(data => {
      if (isMounted && data.length) {
        const list = data.sort((a, b) => (+a.list_order) - (+b.list_order));
        setTestimonials(list);
      }
    });
    return () => { isMounted = false; };
  }, []);

  const emptyView = (
    <div className="container">
      <div className="fw-500 fs-1p5 gray-77 text-center pt-4">
        No Testimonials
      </div>
    </div>
  );

  const responsive = {
    exxl: {
      breakpoint: { max: 4000, min: 1800 },
      items: 4,
      partialVisibilityGutter: 1,
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
      breakpoint: { max: 1399, min: 990 },
      items: 2,
      partialVisibilityGutter: 0,
    },
    md: {
      breakpoint: { max: 991, min: 0 },
      items: 1,
      partialVisibilityGutter: 0,
    }
  };

  return (
    <div className={styles.container}>
      <div className="app-container">
        <div className="mb-4">
          <h3 className={styles.title}>Out Client's Say's</h3>
        </div>
        {testimonials.length ?
          <div className={styles.carousel}>
            <Carousel
              responsive={responsive}
              partialVisible={true}
              arrows={false}
              renderButtonGroupOutside={true}
              customButtonGroup={<ArrowButtonGroup />}
            >
              {testimonials.map((data, idx) => (
                <FeedbackCard
                  key={`testimonial-${data.id}`}
                  image={getTestimonialImage(data.image)}
                  name={data.name}
                  designation={data.designation}
                  content={data.contents}
                />
              ))}
            </Carousel>
          </div>
          :
          emptyView
        }
      </div>
    </div>
  );
};