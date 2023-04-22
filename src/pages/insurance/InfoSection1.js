import React from 'react';

import AppLazyImage from '../../components/elements/AppLazyImage';
import thumbImg from '../../assets/images/insurance/renters.png';

export const InfoSection1 = () => {
  return (
    <div className="row py-4">
      <div className="text-center text-lg-start fw-500 fs-1p625 cod-gray mb-4">
        Renter Get Comprehensive<br />Coverage on Every Rental
      </div>
      <div className="w-lg-55">
        <p>URentMe vets renters with document ID and facial biometrics verification - that way you know that the person sitting behind the wheel of your equipment is who they really say they are. And don’t worry renters, we use only the most secure platform for payment processing.</p>
        <p>Renters and additional qualified operators on our exclusive insurance policy receive liability coverage per accident of bodily injury liability coverage, property damage, and collision / physical damage coverage for the owners Vehicle, Vessel or RV, and Trailer. All Rental Equipment is also covered during transport.</p>
        <p>If you have your own personal insurance policy covering you and/or the equipment, that policy will not provide coverage for you and/or the equipment while renting through URentMe. The coverage provided in the URentMe general liability, physical damage and medical coverage, for both the owner and renter, is substantially different from the insurance coverage typically provided in a general personal insurance policy. Every renter will be required to digitally sign at the time of booking the URentMe comprehensive insurance policy, and that you acknowledge to the the terms, conditions, limitations and exclusions of that policy before entering into a transaction either as an owner or a renter.</p>
      </div>
      <div className="w-lg-45">
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