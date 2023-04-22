import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { FaTimes } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

import CircleMark from '../../components/marks/CircleMark';
import styles from './ItemFeatureSection.module.css';
import * as Constant from '../../constants/constant';

export const ItemFeatureSection = (props) => {
  const { item, features, courtesies } = props;
  const [itemInfo, setItemInfo] = useState([]);
  
  useEffect(() => {
    setItemInfo([
      {
        title: 'Feet',
        text: item.feet,
      },
      {
        title: 'Maximum People',
        text: item.guest,
      },
      {
        title: 'Weight',
        text: item.weight,
      },
      {
        title: 'Hitch Weight',
        text: item.hitch_weight,
      },
      {
        title: 'Availability',
        text: moment(item.availabile).format(Constant.DATE_FORMAT),
      },
    ]);
  }, [item])

  return (
    <div className={props.className}>
      { itemInfo && itemInfo.length > 0 &&
      <div className="mb-3">
        { itemInfo.filter((info) => info.text).map((info, idx) => (
          <div key={`info-${idx}`} className={`d-flex align-items-center justify-content-between p-0p5 ${styles.infoCaption}`}>
            <span className="fw-600 fs-1p125 black">{info.title}</span>
            <span className="w-400 fs-1p0 gray-36">{info.text}</span>
          </div>
        ))}
      </div>
      }

      { features && features.length > 0 &&
      <div className="mb-3">
        { features.map((feature, idx) => (
          <div key={`feature-${feature.id}`} className="d-flex align-items-center">
            <CircleMark
              width={16}
              height={16}
              bgColor="#219653"
            >
              <FaCheck className="fp-10 white" />
            </CircleMark>
            <span className="fw-400 fs-1p0 gray-36 ms-0p75">{feature.name}</span>
          </div>
        ))}
      </div>
      }

      { courtesies && courtesies.length > 0 &&
      <div className="mb-3">
        { courtesies.map((courtesy, idx) => (
          <div key={`courtesy-${courtesy.id}`} className="d-flex align-items-baseline">
            <FaTimes  className="white fp-18 red-2" />
            <span className="fw-400 fs-1p0 gray-36 ms-0p75">{courtesy.name}</span>
          </div>
        ))}
      </div>
      }
    </div>
  );
};