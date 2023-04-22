import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';

const VerifyIdentityModal = (props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onNext = () => {
    setOpen(false);
    if (props.onNext) {
      props.onNext();
    }
  }

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      closeOnOverlayClick={props.closeOnOverlayClick ?? true}
      center
      classNames={{ root: 'z-1050', modal: 'w-480px border-12' }}
    >
      <div className="modal-header">
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Verify</span>
      </div>
      <div className="modal-body">
        <div className="fw-500 fs-1p0 dark-gray mb-4">
          Our insurance rates are the lowest in the business because we validate identities of our renters. Those savings are passed along to you. In order to rent this vehicle we need to do a quick ID verification (&lt; 2 minutes) and you'll be good to go!
        </div>
        <div className="d-flex justify-content-center gap-2">
          <button
            type="button"
            className="btn btn-app-primary fw-500 fs-1p0 midnight py-2 w-75"
            onClick={onNext}
          >OK</button>
        </div>
      </div>
    </Modal>
  );
};

export default VerifyIdentityModal;
