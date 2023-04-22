import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Modal } from 'react-responsive-modal';

import { getUserMessages } from "../../store/actions/messageActions";
import OwnerCard from '../../components/elements/OwnerCard';
import AppSpinner from '../../components/loading/AppSpinner';
import { getUserAvatar } from '../../utils/imageUrl';
import { containPhoneNumbers } from "../../utils/stringUtils";
import * as APIHandler from "../../apis/APIHandler";

const MessageModal = (props) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onCloseModal = () => {
    setOpen(false);
    setMessage('');
    if (props.onClose) {
      props.onClose();
    }
  }

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  }

  const sendMessage = (e) => {
    e.preventDefault();

    if (containPhoneNumbers(message)) {
      toast.error('Any phone number can\'t be shared!');
      return;
    }

    if (!props.userId || !props.ownerData?.id) {
      toast.error('User data is incorrect');
      return;
    }

    setLoading(true);
    APIHandler.addMessage(props.ownerData.id, props.userId, message, props.ownerData.itemId).then(data => {
      setLoading(false);
      if (data.result === 'True') {
        toast.success('Message was sent successfully!');
        onCloseModal();
        props.getUserMessages(props.userId);
      } else {
        toast.error('Please try again');
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      center
      classNames={{root: 'z-1050', modal: 'border-12 position-relative'}}
    >
      <div className="modal-header">
        { props.ownerData ?
        <OwnerCard
          image={getUserAvatar(props.ownerData?.avatar)}
          name={props.ownerData?.name}
          review={props.ownerData?.review}
          rate={props.ownerData?.rate}
          verified={props.ownerData?.verified}
        />
        :
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Message</span>
        }
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <form onSubmit={sendMessage}>
          <div className="form-group">
            <textarea
              row="3"
              placeholder="Type your message..."
              className="form-control fw-400 fs-0p875 oxford-blue app-form-control"
              style={{width: "450px", height: "160px"}}
              onChange={onChangeMessage}
              disabled={loading}
            />
          </div>
          <div className="text-center mt-3">
          <button type="submit" disabled={message.length === 0 || loading} className="btn btn-app-primary fw-400 fs-1p0 white px-3 mx-auto">Send Message</button>
          </div>
        </form>
      </div>
      { loading && <AppSpinner absolute /> }
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
  };
};

export default connect(mapStateToProps, { getUserMessages })(MessageModal);