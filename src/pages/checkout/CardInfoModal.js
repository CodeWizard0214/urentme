import React, { useEffect, useState } from 'react';

import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';
import Card from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from '../../utils/creditUtils';

import * as APIHandler from '../../apis/APIHandler';
import AppSpinner from '../../components/loading/AppSpinner';

const CardInfoModal = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [issuer, setIssuer] = useState('');
  const [focused, setFocused] = useState('');

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      setIssuer(issuer);
    }
  }

  const handleInputFocus = ({ target }) => {
    setFocused(target.name);
  }

  const handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value);
      setNumber(target.value);
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value);
      setExpiry(target.value);
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value);
      setCvc(target.value);
    } else {
      setName(target.value);
    }
  }

  const handleSubmit = e => {
    e.preventDefault();

    const cardInfo = [...e.target.elements]
      .filter(d => d.name)
      .reduce((acc, d) => {
        acc[d.name] = d.value;
        return acc;
      }, {});

    setLoading(true);
    APIHandler.getCreditCardToken(cardInfo).then(rent => {
      if (rent.error) {
        toast.error(rent.error.message);
        setLoading(false);
        return;
      }
      APIHandler.getCreditCardToken(cardInfo).then(deposit => {
        if (deposit.error) {
          toast.error(deposit.error.message);
          setLoading(false);
          return;
        }
        setLoading(false);
        if (props.onSubmit) {
          props.onSubmit({last4: rent.card.last4, ip: rent.client_ip, rent_token: rent.id, deposit_token: deposit.id});
        }
      })
    });
  }

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      center
      classNames={{ root: 'z-1050', modal: 'border-12 w-480px' }}
    >
      <div className="modal-header">
        <span className="modal-title fw-600 fs-1p25 midnight w-100 text-center">Card Detail</span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <div className="d-flex justify-content-center mb-3">
          <Card
            number={number}
            name={name}
            expiry={expiry}
            cvc={cvc}
            focused={focused}
            callback={handleCallback}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <input
              type="tel"
              name="number"
              className="form-control fw-400 fs-0p875 oxford-blue app-form-control"
              placeholder="Card Number"
              pattern="[\d| ]{16,22}"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className="form-group mb-2">
            <input
              type="text"
              name="name"
              className="form-control fw-400 fs-0p875 oxford-blue app-form-control"
              placeholder="Name"
              required
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
          </div>
          <div className="row mb-3">
            <div className="col-6">
              <input
                type="tel"
                name="expiry"
                className="form-control fw-400 fs-0p875 oxford-blue app-form-control"
                placeholder="Valid Thru"
                pattern="\d\d/\d\d"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
            <div className="col-6">
              <input
                type="tel"
                name="cvc"
                className="form-control fw-400 fs-0p875 oxford-blue app-form-control"
                placeholder="CVC"
                pattern="\d{3,4}"
                required
                onChange={handleInputChange}
                onFocus={handleInputFocus}
              />
            </div>
          </div>
          <input type="hidden" name="issuer" value={issuer} />
          <div className="text-center">
            <button type="submit" disabled={loading} className="btn btn-app-primary px-5">Save</button>
          </div>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default CardInfoModal;