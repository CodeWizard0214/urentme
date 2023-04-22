import React from 'react';
import { connect } from "react-redux";

import styles from './ItemPriceSection.module.css';

const ItemPriceSection = (props) => {
  const { itemData, tripDays, tripCost, serviceFee, totalPrice, disabled } = props;

  return (
    <div className={`row ${props.className}`}>
      <div className="col-md-6 col-lg-6 col-xl-6">
        <div className={`row align-items-center g-2 p-2 ${styles.priceContainer}`}>
          <div className="col-7 offset-1 fw-600 fs-1p125 gray-36">Trip Price ({tripDays} days)</div>
          <div className="col-4 fw-400 fs-0p875 gray-36">${Number(tripCost).toFixed(2)}</div>
          <div className="col-7 offset-1 fw-600 fs-1p125 gray-36">Security Deposit</div>
          <div className="col-4 fw-400 fs-0p875 gray-36">${Number(itemData.security_deposit).toFixed(2)}</div>
          <div className="col-7 offset-1 fw-600 fs-1p125 gray-36">Rental Services Fee</div>
          <div className="col-4 fw-400 fs-0p875 gray-36">${Number(serviceFee).toFixed(2)}</div>
          <div className="col-7 offset-1 fw-600 fs-1p125 gray-36">Cleaning Fee</div>
          <div className="col-4 fw-400 fs-0p875 gray-36">${Number(itemData.cleaning_fee).toFixed(2)}</div>
          <div className="divider" />
          <div className="col-7 offset-1 fw-600 fs-1p125 gray-36">Total Price</div>
          <div className="col-4 fw-600 fs-1p125 gray-36">${Number(totalPrice).toFixed(2)}</div>
        </div>
      </div>
      <div className="col-md-6 col-lg-6 col-xl-6 mt-4 mt-md-0">
        <textarea
          row="3"
          placeholder={`${props.userInfo.first_name} ${props.userInfo.last_name} - ###### ${props.userInfo.state ? "- " + props.userInfo.state : ""}`}
          className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${styles.textarea}`}
          disabled={disabled}
          onChange={props.onChange}
        />
        <div className={`fw-400 fs-0p875 gray-36 ${styles.comment}`}>* Please type the name, driver license number and state of issuance for all vehicle operators.</div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo,
  };
}

export default connect(mapStateToProps)(ItemPriceSection);