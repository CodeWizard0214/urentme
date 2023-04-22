import React from 'react';

import AppLazyImage from '../../components/elements/AppLazyImage';

import styles from './InfoSection.module.css';
import thumbImg from '../../assets/images/insurance/otherfactor.png';

export const InfoSection2 = () => {
  return (
    <div className="row pt-5">
      <div className="d-flex justify-content-center justify-content-lg-end mb-3">
        <div className="order-0 text-end w-lg-55">
          <div className="text-center text-lg-start fw-500 fs-1p625 cod-gray">
            Other factors that further protect<br />both Owners and Renters
          </div>
        </div>
      </div>
      <div className="order-1 order-lg-2 w-lg-55">
        <ul className={styles.contentList}>
          <li>
            URentMe’s minimum age for a registered renter is 21 years.
          </li>
          <li>
            All registered renters have completed profile information and have been fully verified.
          </li>
          <li>
            A fully refundable security deposit is taken from the renter as a safeguard to protect the vehicle rented, as the terms of the vehicle insurance all include a deductible.
          </li>
          <li>
            The Owner must upload pictures at the time of pickup to your account, and notate if necessary the condition of all items and accessories, mileage, etc. When the rented item is returned, its condition is checked against the pictures and if any discrepancy is found then the damage would be deducted from the security deposit.
          </li>
          <li>
            If the rented vehicle is an RV or Trailer of any kind, we do offer Premium 24/7 Roadside Assistance, for $15 a day.
          </li>
        </ul>
      </div>
      <div className="order-2 order-lg-1 w-lg-45">
        <AppLazyImage
          src={thumbImg}
          alt=""
          width="100%"
          height="auto"
        />
      </div>
    </div>
  );
};