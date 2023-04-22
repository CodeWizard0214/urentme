import React from 'react';
import styles from './CancelationPolicy.module.css';

const CancelationPolicy = () => {
  return (
    <div className={`container ${styles.content}`}>
      <div className="fw-600 fs-1p625 color-primary text-center p-3">CANCELLATION AND REFUNDS</div>
      <ul>
        <li>URentMe's Cancellation policy outlined below is there to protect both Rental Equipment Owners and Renters. Either party may cancel a reservation by cancelling in your Dashboard under "Reservations".</li>
        <li>Reservations canceled 3 days (72 hours) or more prior to the scheduled rental start time will receive a refund of all fees paid less a 5% service fee.</li>
        <li>Cancellations by Renters or Owners within 3 days (72 hours) of scheduled rental start time (local time) will be subject to fees or loss of all funds paid as described below.</li>
      </ul>

      <div className="fw-500 fs-1p375 color-primary text-center p-2">CANCELLATIONS BY RENTER</div>
      <div className="ms-2 mb-1">If the Renter cancels the reservation after deposit, partial or full payment is made, the following will apply:</div>
      <ul>
        <li>Renter Cancellations within 3 days (72 hours) of the scheduled rental start time (local time) will lose all rental fees paid. If a deposit was held it will be released or credited back to your credit card.</li>
        <li>The owner may choose not to collect any part of rental fees forfeited for a Renter's Renter's cancellation within 3 days of rental start time. Should this occur the Renter will be notified, and a 5% service fee will be before any refund.</li>
        <li>Should the Owner cancel your reservation within 3 days (72 hours) of scheduled rental start time (local time) you may receive a credit toward future rentals or be provided another rental day.</li>
        <li>Should a cancellation within 3 days (72 hours) of scheduled rental start time (local time) meet Extenuating Circumstances please contact support@urentme.com</li>
      </ul>

      <div className="fw-500 fs-1p375 color-primary text-center p-2">CANCELLATIONS BY OWNER</div>
      <div className="ms-2 mb-1">If the Owner cancels the reservation after deposit, partial or full payment is made, the following will apply:</div>
      <ul>
        <li>Owner Cancellations within 3 days (72 hours) of scheduled rental start time (local time) will be charged 20% of the scheduled rental fees or a $100.00 cancellation fee, whichever is greater. All rental fees will be refunded to the renter and renter will be provided a credit for future rentals.</li>
        <li>The 20% fee, or $100.00 cancellation fee, may be waived should owners choose to provide a free rental within a reasonable time providing this time works with the renters schedule.</li>
        <li>Should a cancellation within 3 days (72 hours) of the scheduled rental start time (local time) meet Extenuating Circumstances please contact support@urentme.com</li>
      </ul>

      <div className="fw-500 fs-1p375 color-primary text-center p-2">EXTENUATING CIRCUMSTANCES</div>
      <div className="ms-2 mb-1">URentMe can supersede the cancellation and refund policy for Owners or Renters if the following circumstances apply. The Renter will receive a full refund less a 5% service fee and the Owner will not receive payment.</div>
      <ol>
        <li>The Renter feels he or she does not have the ability or skill to safely operate the Rental Equipment.</li>
        <li>The Renter feels the Rental Equipment is unsafe.</li>
        <li>The Renter feels the Rental Equipment offered is not the Rental Equipment that was advertised or is in poor condition.</li>
        <li>The Renter feels the Owner has falsified material aspects of the Rental Listing.</li>
        <li>Any issues with delivery or mechanical operation that end the rental prematurely and determined to be due to negligence of the owner.</li>
        <li>Political Unrest or Natural Disaster</li>
        <li>Owner is unable to make Rental Equipment available due to damage from previous rental.</li>
        <li>Weather related safety issues in the event of snow storms, thunderstorms, lightning, heavy rain, floods or heavy wind within eight (8) hours of the rental start time or within 50 miles of scheduled rental destination.</li>
        <li>Death of immediate family member or serious accident of family member.</li>
      </ol>
    </div>
  );
};

export default CancelationPolicy;