import React from 'react';

import { AiOutlineCheck } from 'react-icons/ai';

import OwnerCard from '../../components/elements/OwnerCard';
import { getUserAvatar } from '../../utils/imageUrl';
import { getLocation } from '../../utils/stringUtils';

const ProfileMemoSection = (props) => {
  const { userData, review, rate } = props;

  return (
    <div className={`row ${props.className}`}>
      <div className="mb-2 col-md-4 mb-md-0">
        {/* <div className="fw-600 fs-1p125 cod-gray mb-2">Hosted by</div> */}
        <OwnerCard
          image={getUserAvatar(userData.img)}
          name={userData.username}
          review={review}
          rate={rate}
          verified={+userData.email_verify === 1}
        />
        {userData.about_me && (
          <>
            <div className="fw-600 fs-1p125 cod-gray mt-3 mb-2">About</div>
            <div className="fw-400 fs-1p0 gray-36">{userData.about_me}</div>
          </>
        )}
      </div>
      <div className="mb-2 col-md-4 mb-md-0">
        <div className="fw-600 fs-1p125 cod-gray mb-2">Lives</div>
        <div className="fw-400 fs-1p0 gray-36">{getLocation(userData)}</div>
      </div>
      <div className="col-md-4">
        <div className="fw-600 fs-1p125 cod-gray mb-2">Verified</div>
        {userData.email_verify === 1 &&
          <div>
            <AiOutlineCheck className="color-primary" />
            <span className="fw-400 fs-1p0 gray-36 ms-2">Email Address</span>
          </div>
        }
        {userData.mobile_verify === 1 &&
          <div>
            <AiOutlineCheck className="color-primary" />
            <span className="fw-400 fs-1p0 gray-36 ms-2">Mobile Number</span>
          </div>
        }
        <div>
          <AiOutlineCheck className="color-primary" />
          <span className="fw-400 fs-1p0 gray-36 ms-2">Approved to drive</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileMemoSection;