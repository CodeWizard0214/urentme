import React from 'react';
import { useNavigate } from 'react-router-dom';

import ReactStars from 'react-rating-stars-component';
import { FaCheck } from 'react-icons/fa';

import AppLazyImage from './AppLazyImage';
import CircleMark from '../marks/CircleMark';
import * as Color from '../../constants/color';
import { getTripsString } from '../../utils/stringUtils';
import noAvatar from '../../assets/images/logo-small.png';

const OwnerCard = (props) => {
  const navigate = useNavigate();

  const onProfileInfo = (id) => {
    if (id) {
      navigate(`/profile/${id}`);
    }
  }

  return (
    <div className="d-flex align-items-center">
      <div className="p-1">
        <AppLazyImage
          src={props.image}
          alt=""
          width={props.width ?? 48}
          height={props.height ?? 48}
          placeholder={noAvatar}
          className={`avatar ${props.id && "hand"}`}
          onClick={() => onProfileInfo(props.id)}
        />
      </div>
      <div className="ms-1">
        <div className="d-flex align-items-center">
          <span className="fw-400 fs-1p0 cod-gray">{props.name}</span>
          {props.verified &&
          <CircleMark
            width={16}
            height={16}
            bgColor={Color.BLUE_COLOR}
            className="ms-1"
          >
            <FaCheck className="fp-10 white" />
          </CircleMark>
          }
        </div>
        { (+props.review) > 0 ?
        <div className="d-flex align-items-center">
          <span className="fw-500 fs-0p875 gray-36 me-1">{Number(props.rate).toFixed(1)}</span>
          <ReactStars
            // value={+props.rate}
            value={1}
            color={Color.DISABLE_COLOR}
            activeColor={Color.PRIMARY_COLOR}
            count={1}
            size={14}
            edit={false}
          />
          <span className="fw-300 fs-0p75 quick-silver ms-1">({getTripsString(props.review)})</span>
        </div>
        :
        <span className="fw-300 fs-0p75 quick-silver">(no trips)</span>
        }
      </div>
    </div>
  );
};

export default OwnerCard;