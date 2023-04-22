import React, { useEffect, useState } from 'react';
import moment from 'moment';

import ReactStars from 'react-rating-stars-component';
import ReadMoreReact from 'read-more-react';

import { getUserAvatar } from '../../utils/imageUrl';
import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';
// import * as APIHandler from '../../apis/APIHandler';
import AppLazyImage from './AppLazyImage';
import styles from './TripReviewCard.module.css';
import noAvatar from '../../assets/images/logo-small.png';

const TripReviewCard = (props) => {
  const { review, readmore } = props;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // let isMounted = true;
    // const fetchData = async () => {
    //   if (isMounted) {
    //     const res = await APIHandler.getUserInfo(review.user_id);
    //     setUserData(res);
    //   }
    // };

    // fetchData();
    // return () => { isMounted = false; };
    setUserData(review.user_info);
  }, [review]);

  return (
    <div className={`${styles.card} ${props.className}`}>
      <div className="d-flex mb-3">
        <AppLazyImage
          src={getUserAvatar(userData.img)}
          alt=""
          width={48}
          height={48}
          placeholder={noAvatar}
          className={`avatar ${props.id && "hand"}`}
        />
        <div className="ms-2 overflow-hidden">
          <div className="fw-400 fs-1p0 cod-gray text-ellipsis">
            {userData.username}
          </div>
          <div className="d-flex">
            {+review.rating > 0 && (
              <>
                <span className="fw-500 fs-0p875 gray-36 me-2">
                  {Number(review.rating).toFixed(1)}
                </span>
                <ReactStars
                  value={+review.rating}
                  color={Color.DISABLE_COLOR}
                  activeColor={Color.PRIMARY_COLOR}
                  size={14}
                  count={1}
                  edit={false}
                />
              </>
            )}
            <div className="fw-300 fs-0p875 gray-36 ms-2">
              {moment(review.modified).format(Constant.DATE_FORMAT)}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.readmore}>
        {readmore ? (
          <ReadMoreReact
          text={review.comment}
          min={20}
          ideal={36}
          max={36}
          readMoreText="Read More"
        />
        ) : (
          <span>{review.comment}</span>
        )}
      </div>
    </div>
  );
};

export default TripReviewCard;