import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { encode } from "html-entities";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";

import { getPendingTrips } from '../../store/actions/bookingActions';
import { setPolicyData } from '../../store/actions/miscActions';
import AppCheckbox from "../../components/elements/AppCheckbox";
import ConfirmModal from "../../components/modal/ConfirmModal";
import CardInfoSection from "./CardInfoSection";
import CircleMark from "../../components/marks/CircleMark";
import * as Color from "../../constants/color";
import * as APIHandler from "../../apis/APIHandler";

const ItemAgreementSection = (props) => {
  const navigate = useNavigate();
  const [showAgreeModal, setShowAgreeModal] = useState(false);
  const [showSuccessModal, setShowSuccesseModal] = useState(false);
  const [agreeRisk, setAgreeRisk] = useState(false);
  const [agreeHelmet, setAgreeHelmet] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [note, setNote] = useState("");
  const [clientIP, setClientIP] = useState("");
  const [rentToken, setRentToken] = useState("");
  const [deopsitToken, setDepositToken] = useState("");
  const [loading, setLoading] = useState(false);
  const { itemData, totalPrice, rentalAmount, tripDays, begin, end } = props;

  useEffect(() => {
    setNote(props.note);
  }, [props.note]);

  useEffect(() => {
    setEnabled(
      agreeRisk &&
        (!props.hasHelmet || agreeHelmet) &&
        note &&
        rentToken &&
        !loading
    );
  }, [props.hasHelmet, note, agreeRisk, agreeHelmet, rentToken, loading]);

  const onPreviewRisk = () => {
    props.setPolicyData(props.itemData.id, note);
    navigate("/policy/risk");
  };

  const onPreviewHelmet = () => {
    props.setPolicyData(props.itemData.id, note);
    navigate("/policy/helmet");
  };

  const onAgreeRisk = (value) => {
    setAgreeRisk(value);
    if (value) {
      setShowAgreeModal(true);
    }
  };

  const onCloseAgreeModal = () => {
    setShowAgreeModal(false);
  };

  const onAgreeHelmet = (value) => {
    setAgreeHelmet(value);
  };

  const savePaymentToken = (ip, rent_token, deposit_token) => {
    setClientIP(ip);
    setRentToken(rent_token);
    setDepositToken(deposit_token);
  };

  const onCheckout = () => {
    setLoading(true);
    props.setLoading(true);

    APIHandler.addBooking(
      props.userId,
      itemData.id,
      totalPrice,
      itemData.security_deposit,
      rentToken,
      deopsitToken,
      itemData.user_id,
      clientIP,
      rentalAmount * 0.25,
      rentalAmount,
      +itemData.insurance_rate_per_day * tripDays,
      itemData.insurance_rate_per_day,
      rentalAmount / tripDays,
      rentalAmount * 0.75 + itemData.cleaning_fee || 0.0,
      itemData.insurance_tax_rate_per_day * tripDays,
      begin,
      end,
      encode(note),
      itemData.cleaning_fee || 0.0,
      0.0, //roadside_assistance_fee
      2, //is_roadside_assistance_required
      "", //coupon_code
      0.0 //discount_price
    ).then((data) => {
      setLoading(false);
      props.setLoading(false);
      if (data.result && data.result === true) {
        setShowSuccesseModal(true);
        props.getPendingTrips(props.userId);
      } else if (data.msg) {
        toast.error(data.msg);
      } else {
        toast.error("Please try again");
      }
    });
  };

  const onSuccess = () => {
    setShowSuccesseModal(false);
    navigate("/trips/pending");
  };

  const customBookingSuccess = (
    <div className="d-flex flex-column align-items-center mt-4">
      <CircleMark width={72} height={72} bgColor={Color.PRIMARY_COLOR}>
        <FaCheck className="fp-36 white" />
      </CircleMark>
      <div className="fw-400 fs-1p0 gray-36 text-center my-4">
        Your security deposit and rental funds are securely held by URentMe.
        <br />
        Thank you for using URentMe and we hope you enjoy your rental.
      </div>
    </div>
  );

  return (
    <div className={props.className}>
      <div className="divider" />
      <div className="row mt-3">
        <div className="col-md-12 col-lg-12 col-xl-6 mt-3">
          <div className="d-flex align-items-center">
            <AppCheckbox
              label="I agree to all terms and conditions of the URentMe"
              labelClassName="fw-400 fs-0p875 gray-36 ms-2"
              checked={agreeRisk}
              onChange={onAgreeRisk}
            />
            <span
              className="fw-400 fs-0p875 color-primary hand ms-2"
              onClick={onPreviewRisk}
            >
              Assumption of Risk
            </span>
          </div>
          {props.hasHelmet && (
            <div className="d-flex align-items-center mt-3">
              <AppCheckbox
                label="I agree to all terms and conditions of the URentMe"
                labelClassName="fw-400 fs-0p875 gray-36 ms-2"
                checked={agreeHelmet}
                onChange={onAgreeHelmet}
              />
              <span
                className="fw-400 fs-0p875 color-primary hand ms-2"
                onClick={onPreviewHelmet}
              >
                Helmet Refusal
              </span>
            </div>
          )}
        </div>
        <div className="col-md-12 col-lg-12 col-xl-6 mt-3">
          <div className="d-flex">
            <div>
              <CardInfoSection
                disabled={loading}
                saveToken={savePaymentToken}
              />
            </div>
            <button
              type="button"
              disabled={!enabled}
              onClick={onCheckout}
              className="btn btn-app-primary offset-1"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <ConfirmModal
        open={showAgreeModal}
        closeOnOverlayClick={false}
        onClose={onCloseAgreeModal}
        title="Insurance Agreement"
        text="Please be aware that you are accepting full and total liability for any and all damages caused to the equipment you are renting. Any damage that is claimed by the owner of the equipment shall be deducted from your deposit, without negotiation. By continuing, you acknowledge the foregoing materials and accept full responsibility for the equipment you are renting."
        primaryButton="OK"
        onPrimaryClick={onCloseAgreeModal}
      />
      <ConfirmModal
        open={showSuccessModal}
        closeOnOverlayClick={false}
        onClose={onSuccess}
        customChildren={customBookingSuccess}
        primaryButton="OK"
        primaryClassName="px-5"
        onPrimaryClick={onSuccess}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps, { getPendingTrips, setPolicyData })(
  ItemAgreementSection
);
