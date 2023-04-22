import React, { useEffect, useState } from "react";

import { Modal } from "react-responsive-modal";
import { toast } from 'react-toastify';

import ImageCrop from "./ImageCrop";
import AppSpinner from '../loading/AppSpinner';

const CropModal = (props) => {
  const [open, setOpen] = useState(props.open);
  const [croppedImageUrl, setCroppedImageUrl] = useState('');
  const [croppedImageBlob, setCroppedImageBlob] = useState('');

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const onCloseModal = () => {
    setOpen(false);
    setCroppedImageUrl('');
    setCroppedImageBlob('');
    if (props.onClose) {
      props.onClose();
    }
  };

  const onUpload = () => {
    if(croppedImageUrl && croppedImageBlob){
      props.onUpload(croppedImageUrl, croppedImageBlob);
    }
    else{
      toast.error('Please crop image');
    }
  }
  
  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      closeOnOverlayClick={false}
      center
      classNames={{ root: "z-1050", modal: "border-12 max-w-480px position-relative" }}
    >
      <div className="modal-body text-center">
        <ImageCrop
          photo={props.src}
          croppedImageUrl={setCroppedImageUrl}
          croppedImageBlob={setCroppedImageBlob}
          aspect={props.aspect}
          circularCrop={props.circularCrop}
        />
        <div className="d-flex justify-content-center gap-2 mt-2">
          <button
            type="button"
            className="btn btn-app-primary fw-500 fs-1p0 midnight py-2 w-100"
            onClick={onUpload}
          >
            Upload
          </button>
          <button
            type="button"
            className="btn btn-outline-app-primary w-100 fw-500 fs-1p0 midnight py-2"
            onClick={onCloseModal}
          >
            Cancel
          </button>
        </div>
      </div>
      {props.loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default CropModal;
