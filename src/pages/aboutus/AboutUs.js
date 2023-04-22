import React, { useEffect, useState } from 'react';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import MemberCard from './MemberCard';
import AppSpinner from '../../components/loading/AppSpinner';
import { ArrowButtonGroup } from '../../components/carousel/ArrowButtonGroup';
import { getProfileImage } from '../../utils/imageUrl';
import * as APIHandler from '../../apis/APIHandler';
import styles from './AboutUs.module.css';

const PRODUCT_DESC = 'URentMe\'s Unlimited Roadside Assistance, RV Technical Assistance Hotline, and Concierge Services provides you with 24/7 premium assistance for only $15/day Renter Process. If you wish to rent a boat, personal watercraft, off road vehicle or trailer, please Sign Up to make a Reservation from the Owners listing.';

const AboutUs = () => {
  const [members, setMembers] = useState([]);
  const [content, setContent] = useState(PRODUCT_DESC);

  useEffect(() => {
    APIHandler.getAboutUsContent().then(data => {
      if (data.length) {
        const list = data.sort((a, b) => (+a.list_order) - (+b.list_order));
        setMembers(list);
      }
    });
  }, []);

  const onMemberClick = (text) => {
    setContent(text);
  }

  const responsive = {
    xxl: {
      breakpoint: { max: 4000, min: 1400 },
      items: 3,
      partialVisibilityGutter: 20,
    },
    xl: {
      breakpoint: { max: 1399, min: 1200 },
      items: 2,
      partialVisibilityGutter: 110,
    },
    lg: {
      breakpoint: { max: 1199, min: 992 },
      items: 2,
      partialVisibilityGutter: 20,
    },
    md: {
      breakpoint: { max: 991, min: 768 },
      items: 1,
      partialVisibilityGutter: 130,
    },
    sm: {
      breakpoint: { max: 767, min: 0 },
      items: 1,
    }
  };

  return (
    <div className="container">
      <div className="fw-600 fs-3p0 black text-center mt-5 mb-4">About Us</div>
      { members.length > 0 ?
      <div className={styles.container}>
        <div className={styles.carousel}>
          <Carousel
            responsive={responsive}
            partialVisible={true}
            infinite={true}
            arrows={false}
            renderButtonGroupOutside={true}
            customButtonGroup={<ArrowButtonGroup type="secondary" />}
          >
            { members.map((member, idx) => (
              <MemberCard
                key={`member-${member.id}`}
                image={getProfileImage(member.image)}
                name={member.name}
                designation={member.designation}
                text={member.contents}
                onClick={onMemberClick}
              />
            ))}
          </Carousel>
        </div>
        <div
          className="fw-400 fs-1p125 white mt-5 mb-3"
          dangerouslySetInnerHTML={{__html:content}}
        />
      </div>
      :
      <AppSpinner absolute />
      }
    </div>
  );
};

export default AboutUs;