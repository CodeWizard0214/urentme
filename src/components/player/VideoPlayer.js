import React from 'react';
import ReactPlayer from 'react-player';
import Modal from 'react-responsive-modal';

const VideoPlayer = (props) => {
  const { open, toggleModal, url } = props;

  return (
    <Modal
      open={open}
      onClose={toggleModal}
      center
      styles={{
        root: {
          zIndex: 1050,
        },
        modal: {
          padding: "unset"
        },
        overlay: {
          background: "rgba(0, 0, 0, 0.5)"
        },
        closeButton: {
          // background: "yellow"
        }
      }}
    >
      <ReactPlayer
        playing={true}
        controls={true}
        url={url}
      />
    </Modal>
  );
}

export default VideoPlayer;
