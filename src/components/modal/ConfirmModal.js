import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';

const ConfirmModal = (props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onPrimaryClick = () => {
    setOpen(false);
    if (props.onPrimaryClick) {
      props.onPrimaryClick();
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
      {props.title &&
        <div className="modal-header">
          <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">{props.title}</span>
        </div>
      }
      <div className="modal-body">
        {props.customChildren &&
          <div>
            {props.customChildren}
          </div>
        }
        {props.text &&
          <div className="fw-500 fs-1p0 dark-gray mb-4">
            {props.text}
          </div>
        }
        <div className="d-flex justify-content-center gap-2">
          {props.primaryButton &&
            <button
              type="button"
              className={`btn btn-app-primary fw-500 fs-1p0 midnight py-2 ${props.primaryClassName ?? "w-100"}`}
              onClick={onPrimaryClick}
            >{props.primaryButton}</button>
          }
          {props.secondaryButton &&
            <button
              type="button"
              className="btn btn-outline-app-primary w-100 fw-500 fs-1p0 midnight py-2"
              onClick={onCloseModal}
            >{props.secondaryButton}</button>
          }
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;