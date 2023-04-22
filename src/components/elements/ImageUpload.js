import React, { useState, useEffect } from 'react';

import AppLazyImage from './AppLazyImage';
import DEFAULT_IMAGE from '../../assets/images/default_image.svg';
import NO_IMAGE from '../../assets/images/noimage.jpg';
import styles from './ImageUpload.module.css';

const ImageUpload = (props) => {
  const { loading } = props;
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setPhoto(props.src);
  }, [props.src]);

  useEffect(() => {
    setError(props.error);
  }, [props.error]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setError(false);
      setPhoto(URL.createObjectURL(e.target.files[0]));
      if (props.onChange) {
        props.onChange(props.id, e.target.files[0]);
      }
    }
  }

  return (
    <div className={`${styles.container} ${error ? styles.error : ""}`}>
      <label htmlFor={`${props.id}-photo`} className={styles.upload}>
        <input
          id={`${props.id}-photo`}
          type="file"
          className="d-none"
          onChange={handleChange}
          disabled={loading}
        />
        <div className={`${styles.upload} ${loading ? "" : "hand"}`}>
          {photo ? (
            <div className="d-flex align-items-center justify-content-center">
              <AppLazyImage
                src={photo}
                alt=""
                width="100%"
                height="auto"
                placeholder={NO_IMAGE}
              />
            </div>
          ) : (
            <>
              <AppLazyImage
                src={DEFAULT_IMAGE}
                alt=""
              />
              <span className="fw-400 fs-0p875 gray-36 mt-3">
                {props.title}
              </span>
            </>
          )}
        </div>
      </label>
    </div>
  );
};

export default ImageUpload;