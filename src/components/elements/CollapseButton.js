import React from 'react';
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';
import styles from './CollapseButton.module.css';

const CollapseButton = (props) => {
  return (
    <div className={`${styles.button} ${props.className}`} onClick={props.onClick}>
      {props.collapsed ? 
        <MdOutlineArrowForwardIos className="fp-20 gray-77" />
      :
        <MdOutlineArrowBackIosNew className="fp-20 gray-77" />
      }
    </div>
  );
}

export default CollapseButton;