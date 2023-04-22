import React from 'react';

import styles from './CustomDot.module.css';

export const CustomDot = ({ onClick, active }) => {
  return (
    <div
      className={`${styles.dotIcon} ${active ? styles.dotActive : styles.dotInactive}`}
      onClick={onClick}
    />
  );
}