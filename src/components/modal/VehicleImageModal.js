import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';

import VehicleImage from '../../components/elements/ImageUpload';
import AppSpinner from '../../components/loading/AppSpinner';
import { getReviewPhoto } from '../../utils/imageUrl';
import { getImageBase64Data } from '../../utils/imageUtils';
import * as APIHandler from '../../apis/APIHandler';

const VehicleImageModal = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicleImages, setVehicleImages] = useState([
    { path: "", title: "Front view", data: "" },
    { path: "", title: "Driver side view", data: "" },
    { path: "", title: "Rear view", data: "" },
    { path: "", title: "Rear view", data: "" },
  ]);

  useEffect(() => {
    const review_photos = props.review_photos;
    for (let i = 0; i < 4; i++) {
      if (
        review_photos[`photo_${i}`] == null ||
        review_photos[`photo_${i}`] === ""
      ) {
        vehicleImages[i].path = null;
      } else {
        vehicleImages[i].path = getReviewPhoto(review_photos[`photo_${i}`], false);
      }
    }
  }, [props.review_photos, vehicleImages]);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const resetModal = () => {
    for (var i = 0; i < 4; i++) {
      vehicleImages[i].data = '';
    }
    setOpen(false);
  }

  const onCloseModal = () => {
    resetModal();
    if (props.onClose) {
      props.onClose();
    }
  };

  const onChangePhoto = (id, data) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      vehicleImages[id].data = getImageBase64Data(reader.result);
      setVehicleImages(vehicleImages);
    });
    reader.readAsDataURL(data);
  };

  const onUpload = async () => {
    setLoading(true);
    let flag = true;
    var count = 0;

    for (var i = 0; i < 4; i++) {
      if (flag && vehicleImages[i].data) {
        var ret = await APIHandler.uploadOwnerVehicleImages(
          props.booking_id,
          i,
          vehicleImages[i].data,
          props.type
        );
        if (ret.result === 'True') {
          count ++;
        } else {
          flag = false;
        }
      }
    }

    setLoading(false);
    if (flag) {
      if (count > 0) {
        toast.success('Photo uploaded successfully');
      }
      resetModal();
      if (props.onFinish) {
        props.onFinish();
      }
    } else {
      toast.error('Fail to upload vehicle image');
    }
  };

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      center
      classNames={{ root: "z-1050", modal: "w-480px border-12" }}
    >
      <div className="modal-header">
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">
          Upload Documents
        </span>
      </div>
      <div className="modal-body">
        <div className="fw-500 fs-1p0 dark-gray mb-4">
          We will use these pictures to validate that vehicle doesn't have
          damages before renting
        </div>
        <div className="row g-2 mb-4">
          {loading && <AppSpinner absolute />}
          {vehicleImages.map((data, idx) => (
            <div key={idx} className="col-sm-6">
              <VehicleImage
                id={idx}
                src={data.path}
                title={data.title}
                error={false}
                loading={loading}
                onChange={onChangePhoto}
              />
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-center gap-2">
          <button
            type="button"
            className={`btn btn-app-primary fw-500 fs-1p0 midnight py-2 w-100`}
            onClick={onUpload}
          >
            Upload
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default VehicleImageModal;
