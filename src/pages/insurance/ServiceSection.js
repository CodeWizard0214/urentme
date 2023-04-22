import React from 'react';

import ServiceCard from '../../components/elements/ServiceCard';
import usersIcon from '../../assets/images/mark/users.svg';
import safetyIcon from '../../assets/images/mark/safety.svg';
import modification from '../../assets/images/mark/modification.svg';

export const POLICY_LIST = [
  {
    icon: usersIcon,
    title: 'Dont worry you are covered',
    text: 'Insurance is provided to Owners and Renters underwritten by one of the biggest "A" Rated Nationwide carriers.',
  },
  {
    icon: safetyIcon,
    title: 'Terms of the Insurance Policy',
    text: 'Both Owner and Renter agree to and acknowledge that by posting a listing or reserving a rental you are indicating that you have read, understand and agree to be bound by the Terms of the Insurance Policy.',
  },
  {
    icon: modification,
    title: 'Modifications to this Policy',
    text: 'Please note that URentMe may at any time amend or change this policy by providing notice to you through the Service or the Site, under URentMe’s discretion.',
  }
];

export const ServiceSection = () => {
  return (
    <div className="row justify-content-center py-4">
      { POLICY_LIST.map((policy, idx) => (
        <div key={`policy-${idx}`} className="mb-4 col-md-6 col-lg-4">
          <ServiceCard
            icon={policy.icon}
            title={policy.title}
            text={policy.text}
          />
        </div>
      ))}
    </div>
  )
}