import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import DriverLicensePhoto from '../../components/elements/ImageUpload';
import AppSpinner from '../../components/loading/AppSpinner';
import { getDriverLicenseImage } from '../../utils/imageUrl';
import { getImageBase64Data } from '../../utils/imageUtils';
import { getUserDocuments } from '../../store/actions/documentActions';
import * as Color from '../../constants/color';
import * as Constant from '../../constants/constant';
import * as APIHandler from '../../apis/APIHandler';

const DriverLicenseSection = (props) => {
  const { userId, docs, licenseVerified, getUserDocuments } = props;
  const [frontPhoto, setFrontPhoto] = useState('');
  const [backPhoto, setBackPhoto] = useState('');
  const [frontImgData, setFrontImgData] = useState(null);
  const [backImgData, setBackImgData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (docs.length < 2) {
      return;
    }

    const front = docs.slice().reverse().find(data => data.type === Constant.LICENSE_TYPE_FRONT);
    const back = docs.slice().reverse().find(data => data.type === Constant.LICENSE_TYPE_BACK);

    if (front && back) {
      setFrontPhoto(getDriverLicenseImage(front.filename));
      setBackPhoto(getDriverLicenseImage(back.filename));
    }
  }, [docs]);

  const onChangePhoto = (id, data) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (id === 'front') {
        setFrontImgData(getImageBase64Data(reader.result));
      } else {
        setBackImgData(getImageBase64Data(reader.result));
      }
    });
    reader.readAsDataURL(data);
  }

  const onUpload = () => {
    setLoading(true);
    if (frontImgData && backImgData) {
      APIHandler.uploadDriverLicense(userId, frontImgData, Constant.LICENSE_TYPE_FRONT).then(data => {
        setFrontImgData(null);
        if (data.result === 'True') {
          APIHandler.uploadDriverLicense(userId, backImgData, Constant.LICENSE_TYPE_BACK).then(data => {
            if (data.result === 'True') {
              toast.success('Upload success. Please wait for verification');
              getUserDocuments(userId);
            } else {
              toast.error('Back photo upload failed');
            }
            setBackImgData(null);
            setLoading(false);
          });
        } else {
          setLoading(false);
          toast.error('Front photo upload failed');
        }
      });
    } else if (frontImgData) {
      APIHandler.uploadDriverLicense(userId, frontImgData, Constant.LICENSE_TYPE_FRONT).then(data => {
        if (data.result === 'True') {
          toast.success('Upload success. Please wait for verification');
          getUserDocuments(userId);
        } else {
          toast.error('Front photo upload failed');
        }
        setFrontImgData(null);
        setLoading(false);
      });
    } else if (backImgData) {
      APIHandler.uploadDriverLicense(userId, backImgData, Constant.LICENSE_TYPE_BACK).then(data => {
        if (data.result === 'True') {
          toast.success('Upload success. Please wait for verification');
          getUserDocuments(userId);
        } else {
          toast.error('Back photo upload failed');
        }
        setBackImgData(null);
        setLoading(false);
      });
    }
  };

  const renderStatus = () => {
    const text = licenseVerified === Constant.LICENSE_STATUS_PENDING ? 'Pending' : licenseVerified === Constant.LICENSE_STATUS_VERIFIED ? 'Verified' : 'Rejected';
    const color = licenseVerified === Constant.LICENSE_STATUS_PENDING ? Color.PRIMARY_COLOR : licenseVerified === Constant.LICENSE_STATUS_VERIFIED ? Color.GREEN_COLOR : Color.RED_COLOR;

    return (
      <span className="fw-400 fs-0p875 ms-3" style={{ color: color }}>{text}</span>
    );
  };

  return (
    <div className="position-relative">
      <div className={`d-flex justify-content-between ${props.className}`}>
        <span className="fw-600 fs-1p125 black">Driver's License</span>
        {licenseVerified !== Constant.LICENSE_STATUS_NONE && renderStatus()}
      </div>
      <div className="fw-400 fs-0p875 gray-36 my-2">Take front and back photos of your driver's license. This photo is just for verification purposes only and will not be shown publicly.</div>
      <div className="row g-2">
        <div className="col-md-6 col-lg-12 col-xxl-6">
          <DriverLicensePhoto
            id="front"
            src={frontPhoto}
            error={!frontPhoto}
            loading={loading}
            onChange={onChangePhoto}
          />
        </div>
        <div className="col-md-6 col-lg-12 col-xxl-6">
          <DriverLicensePhoto
            id="back"
            src={backPhoto}
            error={!backPhoto}
            loading={loading}
            onChange={onChangePhoto}
          />
        </div>
      </div>
      <button
        type="button"
        className="btn btn-app-primary fw-400 fs-0p875 white px-4 py-2 mt-2 float-lg-right"
        onClick={onUpload}
        disabled={loading || (!frontImgData && !backImgData)}
      >Upload</button>
      {loading && <AppSpinner absolute />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    docs: state.documents,
    licenseVerified: state.licenseVerified,
  };
};

export default connect(mapStateToProps, { getUserDocuments })(DriverLicenseSection);
