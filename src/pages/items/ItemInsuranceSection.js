import React from 'react';
import AppLazyImage from '../../components/elements/AppLazyImage';
import mark1 from '../../assets/images/insurance/insured_mark1.png';

export const ItemInsuranceSection = (props) => {
  return (
    <div className={props.className}>
      <div className="fw-500 fs-1p375 cod-gray mb-3">Insurance</div>
        <AppLazyImage
          src={mark1}
          alt="INSURED"
        />
    </div>
  );
};