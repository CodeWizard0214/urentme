import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';

import AppSpinner from '../../../components/loading/AppSpinner';
import * as APIHandler from '../../../apis/APIHandler';

const EditAmountModal = (props) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  useEffect(() => {
    setText(props.amount);
  }, [props.amount]);

  const onUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    APIHandler.adminBookingOwnerReceivable(props.id, text).then(data => {
      setLoading(false);
      if (data.result === 'true') {
        toast.success('Owner Receivable has been updated');
        setOpen(false);
        if (props.onSuccess) {
          props.onSuccess();
        }
      } else {
        toast.error('Could not update owner receivable amount');
      }
    });
  }

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const onChangeText = (e) => {
    setText(e.target.value);
  }

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      closeOnOverlayClick={props.closeOnOverlayClick ?? true}
      center
      classNames={{ root: 'z-1050', modal: 'w-480px border-12 position-relative' }}
    >
      <div className="modal-header">
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Edit Owner Receivable Amount</span>
      </div>
      <div className="modal-body">
        <form onSubmit={onUpdate}>
          <div className="form-group">
            <input
              type="number"
              placeholder=""
              className="form-control fw-400 fs-0p875 oxford-blue app-form-control"
              value={text}
              onChange={onChangeText}
              disabled={loading}
            />
          </div>
          <div className="text-center mt-3">
            <button
              type="submit"
              disabled={text.length === 0 || loading}
              className="btn btn-app-primary fw-400 fs-1p0 white px-5 mx-auto"
            >Update</button>
          </div>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default EditAmountModal;
