import React, { useState } from 'react';
import { BsQuestionCircle } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import { MdPayment } from "react-icons/md";

import CircleMark from '../../components/marks/CircleMark';
import CardInfoModal from './CardInfoModal';
import styles from './CardInfoSection.module.css';
import * as Color from '../../constants/color';

const CardInfoSection = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [last4, setLast4] = useState('');

  const onShowModal = () => {
    setShowModal(true);
  }

  const onCloseModal = () => {
    setShowModal(false);
  }

  const getCardInfo = (cardInfo) => {
    if (cardInfo) {
      setLast4(cardInfo.last4);
      if (props.saveToken) {
        props.saveToken(cardInfo.ip, cardInfo.rent_token, cardInfo.deposit_token)
      }
      setShowModal(false);
    }
  }

  return (
    <>
      <div
        className={`${styles.card} ${props.disabled ? "" : "hand"}`}
        onClick={props.disabled ? null : onShowModal}
      >
        <MdPayment className={`fs-1p5 ${last4 ? "color-primary" : "gray-36"}`} />
        {last4 ?
          <div className="d-flex flex-1-1 align-items-center justify-content-between ms-2">
            <span className="fw-400 fs-1p0 color-primary">Credit Card (**** {last4})</span>
            <CircleMark
              width={16}
              height={16}
              bgColor={Color.PRIMARY_COLOR}
            >
              <FaCheck className="fp-10 white" />
            </CircleMark>
          </div>
          :
          <div className="d-flex flex-1-1 align-items-center justify-content-between ms-2">
            <span className="fw-400 fs-1p0 gray-36">Credit Card</span>
            <BsQuestionCircle className="fp-16 gray-36" />
          </div>
        }
      </div>
      <CardInfoModal
        open={showModal}
        onClose={onCloseModal}
        onSubmit={getCardInfo}
      />
    </>
  );
};

export default CardInfoSection;