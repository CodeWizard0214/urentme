import React from "react";
import { Link } from "react-router-dom";

import styles from "./AmountItem.module.css";

const AmountItem = (props) => {
  return (
    <div className={`d-flex justify-content-between px-3 ${styles.tile}`}>
      <div>
        <div className={styles.amount}>{props?.amount}</div>
        <Link to={props?.url} className={`text-decoration-none ${styles.title}`}>
          {props?.title}
        </Link>
      </div>
      <div className={`${styles.icon} accordion-body`}>{props?.icon}</div>
    </div>
  );
};

export default AmountItem;
