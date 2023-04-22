import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import moment from 'moment';
import { AiOutlineQuestion } from 'react-icons/ai';

import AppSpinner from '../../components/loading/AppSpinner';
import CircleMark from '../../components/marks/CircleMark';
import ProfileMemoSection from './ProfileMemoSection';
import * as Color from '../../constants/color';
import * as APIHandler from '../../apis/APIHandler';
import ProfileItemsSection from './ProfileItemsSection';
import ProfileReviewSection from './ProfileReviewSection';

const ProfileInfo = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewRate, setReviewRate] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    APIHandler.getUserInfo(id).then((data) => {
      setUserData(data);
      setLoading(false);
    });

    APIHandler.getUserItems(id).then((data) => {
      setUserItems(data);
    });

    APIHandler.getOwnerReviews(id).then((data) => {
      const list = data.filter((e) => e.item_review_count !== '0');
      const total = list.reduce((a, b) => a + (+b.item_review_count), 0);
      const sum = list.reduce((a, b) => a + (+b.item_rating_avg), 0);
      const avg = sum / list.length || 0;
      setReviewCount(total);
      setReviewRate(avg);
    });
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      let list = [];
      for (const item of userItems) {
        if (+item.item_review_count) {
          const data = await APIHandler.getItemDetails(item.id);
          if (data.length) {
            list = [...list, ...data[0].reviews];
          }
        }
      }
      list.sort((a, b) => moment(b.modified) - moment(a.modified));
      setReviews(list);
    };

    userItems && userItems.length > 0 && fetchData();
  }, [userItems]);


  const emptyView = (
    <div className="d-flex flex-column align-items-center justify-content-center app-content-height">
      <CircleMark
        width={110}
        height={110}
        borderColor={Color.PRIMARY_COLOR}
        borderWidth="2px"
        borderStyle="solid"
      >
        <AiOutlineQuestion className="fp-42 color-primary" />
      </CircleMark>
      <span className="fw-600 fs-1p125 gray-36 text-center pt-4">
        No User Info
      </span>
    </div>
  );

  return (
    <div className="app-container">
      {loading? (
        <AppSpinner absolute />
      ) : userData ? (
        <>
          <ProfileMemoSection
            userData={userData}
            review={reviewCount}
            rate={reviewRate}
            className="mt-4"
          />

          <ProfileItemsSection
            items={userItems}
            className={`${userItems.length > 0 ? "mt-4" : "mt-5"}`}
          />

          <ProfileReviewSection
            reviews={reviews}
            className={`${reviews.length > 0 ? "mt-4" : "mt-5"}`}
          />
        </>
      ) : (
        emptyView
      )}
    </div>
  );
};

export default ProfileInfo;