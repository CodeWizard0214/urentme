import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

import AppLazyImage from './AppLazyImage';
import CircleMark from '../marks/CircleMark';
import CropModal from '../../components/crop/CropModal';
import IMAGE_PLUS from '../../assets/images/mark/plus.svg';
import NO_IMAGE from '../../assets/images/noimage.jpg';
import styles from './PhotoItem.module.css';

const PhotoItem = (props) => {
  const { loading, src } = props;
  const [error, setError] = useState(false);
  const [uploadImageValue, setUploadImageValue] = useState('') ;
  const [photo, setPhoto] = useState('');
  const [openCropModal, setOpenCropModal] = useState(false);

  useEffect(() => {
    setError(props.error);
  }, [props.error]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
      setOpenCropModal(true);
    }
  }

  const handleRemove = () => {
    if (props.onRemove) {
      props.onRemove(src);
    }
  }

  const onUpload = (url, blob) => {
    if(url && blob && props.onChange) {
      props.onChange(blob);
      setOpenCropModal(false)
    }
  }

  return (
    <>
      <div className={`${styles.container} ${error ? styles.error : ""}`}>
        {src ? (
          <>
            <AppLazyImage
              src={src}
              alt=""
              width="160px"
              height="160px"
              className={styles.photo}
              placeholder={NO_IMAGE}
            />
            {!loading &&
            <CircleMark
              width={20}
              height={20}
              className={styles.removeButton}
              linkable={true}
              onClick={handleRemove}
            >
              <AiOutlineClose className="white" />
            </CircleMark>
            }
          </>
        ) : (
          <label htmlFor="upload_image">
            <input
              id="upload_image"
              type="file"
              className="d-none"
              onChange={handleChange}
              disabled={loading}
              value={uploadImageValue}
              onClick={() => setUploadImageValue('')}
            />
            <div className={`${styles.addButton} ${loading ? "" : "hand"}`}>
              <AppLazyImage
                src={IMAGE_PLUS}
                alt=""
                className={styles.plus}
              />
            </div>
          </label>
        )}  
      </div>
      <CropModal
        open={openCropModal}
        src={photo}
        onClose={() => setOpenCropModal(false)}
        // aspect={4/3}
        circularCrop={false}
        onUpload={onUpload}
        loading={loading}
      />
    </>
  );
};

export default PhotoItem;