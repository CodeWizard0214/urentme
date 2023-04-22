import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import AppLazyImage from '../../components/elements/AppLazyImage';
import CircleMark from '../../components/marks/CircleMark';
import CropModal from '../../components/crop/CropModal';
import styles from './AvatarSection.module.css';
import DEFAULT_AVATAR from '../../assets/images/default_avatar.svg';
import NO_AVATAR from '../../assets/images/logo-small.png';
import { getUserInfo } from '../../store/actions/userActions';
import { getImageBase64Data } from '../../utils/imageUtils';
import * as Color from '../../constants/color';
import * as APIHander from '../../apis/APIHandler';

const AvatarSection = (props) => {
  const { userId } = props;
  const [photo, setPhoto] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openCropModal, setOpenCropModal] = useState(false);
  const [uploadImageValue, setUploadImageValue] = useState('') ;
  let inputElement = null;
  
  useEffect(() => {
    setPhoto(props.src);
    if (props.src) {
      setVerified(true);
    }
  }, [props.src]);

  useEffect(() => {
    setError(props.error);
  }, [props.error]);
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setError(false);
      setPhoto(URL.createObjectURL(e.target.files[0]));
      setOpenCropModal(true);
    }
  }
  
  const onUpload = (url, blob) => {
    if(url && blob) {
      const reader = new FileReader();
      let imgData = "" ;
      reader.addEventListener('load', () => {
        imgData = getImageBase64Data(reader.result);
        if(imgData){
          const fname = userId + "_" + parseInt(new Date().getTime() / 1000).toString() + '.jpeg';
          setLoading(true);
          APIHander.uploadProfileImage(userId, fname, imgData).then(data => {
            if (data.response === 'True') {
              toast.success('Profile image uploaded successfully');
              setPhoto(url);
              props.getUserInfo(userId);
            } else {
              toast.error('Please try again');
            }
            setLoading(false);
            setOpenCropModal(false);
          });
        }
      });
      reader.readAsDataURL(blob);
    }
  }

  return (
    <div className={`${styles.container} ${error ? styles.error : ""}`}>
      <label htmlFor="upload_avatar" className={styles.upload}>
        <input
          id="upload_avatar"
          type="file"
          className="d-none"
          onChange={handleChange}
          value={uploadImageValue}
          onClick={() => setUploadImageValue('')}
          disabled={loading}
          ref={(input) => (inputElement = input)}
        />
        <div className={`${styles.upload} ${loading ? "" : "hand"}`}>
          {photo ? (
            <AppLazyImage
              src={props.src}
              alt=""
              width="92px"
              height="92px"
              className="avatar"
              placeholder={NO_AVATAR}
            />
          ) : (
            <CircleMark
              width="92px"
              height="92px"
              borderColor={Color.PRIMARY_COLOR}
              borderWidth="1px"
              borderStyle="solid"
            >
              <AppLazyImage
                src={DEFAULT_AVATAR}
                alt=""
              />
            </CircleMark>
          )}
        </div>
      </label>
      <div className={`fw-400 fs-0p875 gray-36 mt-3 ${styles.text}`}>Add photo so vehicle owner can recognize you.</div>
      <button
        type="button"
        className="btn btn-outline-app-primary fw-400 fs-0p875 white px-3 py-2 mt-3"
        onClick={() => {inputElement.click()}}
      >Change</button>
      <CropModal
        open={openCropModal}
        src={photo}
        onClose={() => setOpenCropModal(false)}
        aspect={1/1}
        circularCrop={true}
        onUpload={onUpload}
        loading={loading}
      />
      {verified && <span className={`fw-400 fs-0p875 ms-3 ${styles.verified}`} style={{ color: Color.GREEN_COLOR }}>Verified</span>}
    </div>
  );
};

export default connect(null, { getUserInfo })(AvatarSection);
