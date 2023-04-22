import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Modal } from 'react-responsive-modal';
import ReactCodeInput from 'react-verification-code-input';
import { toast } from 'react-toastify';

import { getUserInfo } from '../../store/actions/userActions';
import AppSpinner from '../../components/loading/AppSpinner';
import * as APIHandler from '../../apis/APIHandler';

const VerifyPhoneModal = (props) => {
  const { userId, getUserInfo } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    setOpen(props.open);
    setLoading(false);
  }, [props.open]);

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  const onChangeCode = (val) => {
    setCode(val);
  };

  const onVerify = () => {
    setLoading(true);
    APIHandler.sendPhoneVerifyCode(props.userId, code, props.sessionId).then(data => {
      if (data.result === 'True') {
        setOpen(false);
        if (props.onVerified) {
          props.onVerified();
        }
      } else {
        toast.error('Wrong cde, Please try again');
      }
      getUserInfo(userId);
      setLoading(false);
    });
  };

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      center
      classNames={{root: 'z-1050', modal: 'border-12 w-480px position-relative'}}
    >
      <div className="modal-header">
        <span className="modal-title fw-600 fs-1p25 midnight w-100 text-center">Verify Phone Number</span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body text-center">
        <div className="fw-400 fs-1p0 oxford-blue mb-3">Verification code has been sent to +1{props.phone}. Enter the code below.</div>
        <ReactCodeInput
          type="number"
          fields={6}
          autoFocus
          onChange={onChangeCode}
          className="mx-auto"
          disabled={loading}
        />
        <button
          type="submit"
          className="btn btn-app-primary fw-400 fs-1p0 white px-5 py-2 mt-4"
          disabled={loading || code.length !== 6}
          onClick={onVerify}
        >Verify</button>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps, { getUserInfo })(VerifyPhoneModal);
