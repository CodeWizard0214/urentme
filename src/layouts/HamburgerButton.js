import React from 'react';
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from 'react-icons/md';
import styles from './HamburgerButton.module.css';

const HamburgerButton = (props) => {
  return (
    <div className={`${styles.button} ${props.className}`} onClick={props.onClick}>
      {props.collapsed ? 
        <MdOutlineArrowForwardIos className="fp-20 quick-silver" />
      :
        <MdOutlineArrowBackIosNew className="fp-20 quick-silver" />
      }
    </div>
  );
}

export default HamburgerButton;