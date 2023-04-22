import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import * as Constant from '../../constants/constant';

const PreviewRisk = (props) => {
  const path = useLocation().pathname;
  let dateFormatter = moment(new Date()).format(Constant.DATE_FORMAT);

  const CONTENT_RISK =
    '<h2><center>PARTICIPANT AGREEMENT, RELEASE AND ASSUMPTION OF RISK</center></h2>' +
    '<p>In consideration of the services of URentMe their agents, owners, officers, volunteers, participants, employees, and all other persons or entities acting in any capacity on their behalf (hereinafter collectively referred to as "URM"), I hereby agree to release, indemnify, and discharge URM, on behalf of myself, my spouse, my children, my parents, my heirs, assigns, personal representative and estate as follows:</p>' +
    '<p>1. I acknowledge that my participation in Rental of Motor Home, Travel Trailer, Camper Trailer, Motorcycle, Boat, Golf Cart, ATV, UTV, Snowmobile, Bicycle, Trailer, Personal Watercraft, activities entails known and unanticipated risks that could result in physical or emotional injury, paralysis, death, or damage to myself, to property, or to third parties. I understand that such risks simply cannot be eliminated without jeopardizing the essential qualities of the activity.</p>' +
    "<p><b>The risks include, among other things:</b> injuries can occur from rough terrain or water; passengers can be jolted, jarred, bounced, thrown about and otherwise shaken during rides; it is possible that riders could be injured if they come into contact with other passengers, vehicles or equipment; injuries can be sustained from the water or trail, equipment from items on the trail such as holes, bumps, ruts, obstacles, tree limbs and branches or rocks or from the water; major injuries are a risk, as are drowning, falling, burns, cuts, bruises and sprains, broken bones; musculoskeletal injuries including head, neck, and back injuries; injuries to internal organs; loss of fingers or other appendages; exhaustion; exposure to the elements of the outdoors and natural surroundings which could cause hypothermia, hyperthermia (heat related illnesses), heat exhaustion, sunburn, frostnip, frostbite, dehydration; and exposure to potentially dangerous wild animals, insect bites, and hazardous plant life; the negligence of other participants or persons who may be present; further, passengers can be thrown off the vehicles which can result in any of the above events occurring; accidents involving other vehicles; collision with fixed or movable objects; collisions, and flipping over; accidents or illness can occur in remote places without medical facilities and emergency treatment or other services rendered; the machine itself may fail; and accidents can occur getting in or out. Furthermore, URM employees have difficult jobs to perform. They seek safety, but they are not infallible. They might be unaware of a participant's fitness or abilities. They might misjudge the weather or other environmental conditions. They may give incomplete warnings or instructions, and the equipment being used might malfunction.</p>" +
    '<p>2. I expressly agree and promise to accept and assume all of the risks existing in this activity. My participation in this activity is purely voluntary, and I elect to participate in spite of the risks. Additionally, I agree to wear a U.S. Coast Guard approved personal flotation device (life jacket) while participating in this activity.</p>' +
    '<p>3. I hereby voluntarily release, forever discharge, and agree to indemnify and hold harmless URM from any and all claims, demands, or causes of action, which are in any way connected with my participation in this activity or my use of URM equipment or facilities, <u>including any such claims which allege negligent acts or omissions of URM.</u></p>' +
    "<p>4. Should URM or anyone acting on their behalf, be required to incur attorney's fees and costs to enforce this agreement, I agree to indemnify and hold them harmless for all such fees and cost.</u></p>" +
    '<p>5. I certify that I have adequate insurance to cover any injury or damage I may cause or suffer while participating, or else I agree to bear the costs of such injury or damage myself. I further certify that I am willing to assume the risk of any medical or physical condition I may have.</p>' +
    '<p>6. In the event that I file a lawsuit against URM, I agree to do so solely in the state of Nevada, and I further agree that the substantive law of that state shall apply in that action without regard to the conflict of law rules of that state. I agree that if any portion of this agreement is found to be void or unenforceable, the remaining document shall remain in full force and effect.</p>' +
    '<center><p><b>By signing this document and requesting this rental, I acknowledge that if anyone is hurt or property is damaged during my participation in this activity, I may be found by a court of law to have waived my right to maintain a lawsuit against URM on the basis of any claim from which I have released them herein. I have had sufficient opportunity to read this entire document. I have read and understood it, and I agree to be bound by its terms.</b></p>' +
    '<br>' +
    '<p><h3>Renter Digital Signature</h3></p></center>';

  const CONTENT_HELMET =
    '<h2><center><u>PROTECTIVE RIDING HEADGEAR REFUSAL AGREEMENT</u></center></h2>' +
    '<p>I, for myself and/or on behalf of my child or legal ward, have been fully warned and advised by URentMe (hereinafter collectively referred to as "URM"), that we should purchase and/or wear a properly fitted and secured DOT or SNELL certified helmet while riding or being around UTVs (whether on the premises of URM or off the premises) in order to reduce the severity of some of our head injuries and to possibly prevent my/our death from happening as the result of a fall(s) or any other occurrence associated with this activity. We realize that we are subject to injury from this activity and that no form of preplanning can remove all of the danger to which we are exposing ourselves. Against the advice of URM, the guide/instructor, numerous court cases and URMs insurance company, we are refusing this critical safety precaution.</p>' +
    '<center><h2>SIGNER STATEMENT OF AWARENESS</h2><center>' +
    '<p><b>I/we undersigned have read the foregoing statement carefully before signing and do understand its warnings and assumption of risks.</b></p>' +
    '<br>' +
    '<p><h3>Renter Digital Signature</h3></p>';

  return (
    <div className="container my-4">
      <div
        dangerouslySetInnerHTML={{ __html: path.endsWith('risk') ? CONTENT_RISK : CONTENT_HELMET }}
      />
      <div className="text-center">
        <p>
          Renter Name: <b>{props.userInfo.first_name} {props.userInfo.last_name}</b>&nbsp;
          Phone: <b>{props.userInfo.mobile}</b>
        </p>
        <p>
          Address: <b>{props.userInfo.street1 || ''}</b>&nbsp;
          City: <b>{props.userInfo.city || ''}</b>&nbsp;
          State: <b>{props.userInfo.state || ''}</b>&nbsp;
          Zip: <b>{props.userInfo.zipcode || ''}</b>
        </p>
        <p>Operators: {props.policyData.note}</p>
        <p><i>This document was digitally signed and all terms agreed to on <b>{dateFormatter}</b> when the user <b>#{props.userInfo.id}</b> requested a rental booking for the URM item <b>#{props.policyData.item_id}</b>.</i></p>
        <Link to={`/items/${props.policyData.item_id}`} className="decoration-none">[<b>https://urentme.com/items/{props.policyData.item_id}</b>]</Link>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    policyData: state.policyData,
    userInfo: state.userInfo,
  };
}

export default connect(mapStateToProps)(PreviewRisk);