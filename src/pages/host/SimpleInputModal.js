import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';

import AppSpinner from '../../components/loading/AppSpinner';
import * as APIHandler from '../../apis/APIHandler';

const SimpleInputModal = (props) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onAdd = (e) => {
    e.preventDefault();
    setLoading(true);
    if (props.type === 'Make') {
      addMakeItem();
    } else if (props.type === 'Model') {
      addModelItem();
    }
  }

  const addMakeItem = () => {
    APIHandler.addMakeItem(props.dependencyId, text).then(data => {
      setLoading(false);
      if (data.includes('done')) {
        if (props.onAdd) {
          props.onAdd(text);
        }
        setText('');
        onCloseModal();
      } else {
        toast.error('Fail to add new make');
      }
    });
  }

  const addModelItem = () => {
    APIHandler.addModelItem(props.dependencyId, text).then(data => {
      setLoading(false);
      if (data.includes('done')) {
        if (props.onAdd) {
          props.onAdd(text);
        }
        setText('');
        onCloseModal();
      } else {
        toast.error('Fail to add new model');
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
      {props.type &&
        <div className="modal-header">
          <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Add {props.type}</span>
        </div>
      }
      <div className="modal-body">
        <form onSubmit={onAdd}>
          <div className="form-group">
            <input
              type="text"
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
            >Add</button>
          </div>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default SimpleInputModal;
