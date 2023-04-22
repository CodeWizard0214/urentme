import React from 'react';
import styles from './AppSpiner.module.css';

const AppSpinner = (props) => {
  return (
    <div className={`${props.absolute ? styles.absolute : "text-center"} ${props.className ?? ""}`}>
      <div className={`spinner-border ${props.color ? "" : "color-primary"}`} style={{ color: props.color }} role="status">
        <span className="sr-only" />
      </div>
    </div>
  );
};

export default AppSpinner;