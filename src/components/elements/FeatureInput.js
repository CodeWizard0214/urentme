import React, { useState, useEffect } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

import CircleMark from '../marks/CircleMark';
import * as Color from '../../constants/color';
import styles from './FeatureInput.module.css';

const FeatureInput = (props) => {
  const [feature, setFeature] = useState('');

  useEffect(() => {
    setFeature(props.text);
  }, [props.text]);

  const handleChange = (e) => {
    setFeature(e.target.value);
    if (props.onChange) {
      props.onChange(e.target.value);
    }
  }

  const handleClick = () => {
    if (feature !== '' && !props.disabled && props.onClick) {
      props.onClick(feature);
    }
  }

  return (
    <div className={props.className}>
      <div className="form-group position-relative">
        <input
          type="text"
          value={feature}
          readOnly={!props.addable}
          disabled={props.disabled}
          onChange={handleChange}
          className="form-control fw-400 fs-0p875 oxford-blue app-form-control"
        />
        <CircleMark
          width={24}
          height={24}
          bgColor={Color.PRIMARY_COLOR}
          className={styles.button}
          linkable={!props.disabled}
          onClick={handleClick}
        >
          {props.addable ?
            <AiOutlinePlus className="white" />
          :
            <AiOutlineMinus className="white" />
          }
        </CircleMark>
      </div>
      {props.created &&
        <span className="fw-400 fs-0p75 dark-gray">{props.created}</span>
      }
    </div>
  );
};

export default FeatureInput;