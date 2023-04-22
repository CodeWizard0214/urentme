import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";

import { Modal } from 'react-responsive-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FcGoogle } from 'react-icons/fc';
import { IoLogoFacebook } from 'react-icons/io5';
import { RiLock2Line } from "react-icons/ri";
import { toast } from 'react-toastify';
import GoogleLogin from 'react-google-login';

import * as Constant from '../../constants/constant';
import * as APIHandler from '../../apis/APIHandler';
import { setUserId } from '../../store/actions/userActions';

import AppSpinner from '../../components/loading/AppSpinner';
import AppCheckbox from '../../components/elements/AppCheckbox';

const LoginModal = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    setOpen(props.open);
    setLoading(false);
  }, [props.open]);

  const handleLogin = (username, password) => {
    setLoading(true);
    var sha1 = require('sha1');
    const hashPwd = sha1(Constant.HASHKEY + password);
    APIHandler.login(username, hashPwd).then(data => {
      setLoading(false);
      if (data && data.length > 0) {
        onLogin(data[0].id);
        onCloseModal();
      } else {
        toast.error('Wrong user name or password');
      }
    });
  };

  const onGoogleSuccess = (response) => {
    setLoading(true);
    APIHandler.socialLogin(
      response.profileObj.givenName,
      response.profileObj.familyName,
      response.profileObj.email,
      response.googleId,
      'Google'
    ).then(data => {
      if (data && data.length > 0) {
        onLogin(data[0].id);
        onCloseModal();
      } else {
        toast.error('Failed to login with Google Account');
      }
      setLoading(false);
    });
  }

  const onGoogleFailure = (response) => {
    if (response && response.error) {
      // toast.error(`Google login failure: ${response.error}`);
      console.error(`Google login failure: ${response.error}`);
    }
  }

  const onLogin = (userId) => {
    sessionStorage.setItem(Constant.CURRENT_USER, userId);
    if (remember) {
      localStorage.setItem(Constant.GLOBAL_USER, userId);
    } else {
      localStorage.removeItem(Constant.GLOBAL_USER);
    }
    props.setUserId(userId);
    APIHandler.getUserMessages(userId).then(data => {
      sessionStorage.setItem(Constant.MSG_COUNT, data.length);
    });
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('Required'),
      password: Yup.string()
        .required('Required'),
    }),
    onSubmit: values => {
      const { username, password } = values;
      handleLogin(username, password);
    },
  });

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const onSignUp = () => {
    setOpen(false);
    if (props.onSignUp) {
      props.onSignUp();
    }
  }

  const onForgot = () => {
    setOpen(false);
    if (props.onForgot) {
      props.onForgot();
    }
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
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Login to your account</span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label fw-500 fs-1p0 dark-gray">Username *</label>
            <input
              type="text"
              id="username"
              placeholder="JohnDoe"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.username && formik.errors.username && "app-form-error"}`}
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            { formik.touched.username && formik.errors.username &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.username}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="password" className="form-label fw-500 fs-1p0 dark-gray">Password *</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.password && formik.errors.password && "app-form-error"}`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            { formik.touched.password && formik.errors.password &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.password}</span>
            }
          </div>
          <div className="d-flex align-items-center justify-content-between mt-3 mb-4">
            <AppCheckbox
              label="Remember me"
              labelClassName="fw-400 fs-0p875 bright-gray ms-2"
              checked={remember}
              onChange={setRemember}
              disabled={loading}
            />
            <span
              className={`fw-400 fs-0p875 color-primary ${!loading?"hand":""}`}
              onClick={onForgot}
              disabled={loading}
            >Forgot password?</span>
          </div>
          <button
            type="submit"
            className="btn btn-app-primary w-100 fw-600 fs-1p0 white py-2"
            disabled={loading}
          >
            Log in
          </button>
        </form>

        <div className="divider">
          <span className="p-4 fw-400 fs-0p75 gray-73 midnight">Or</span>
        </div>
        <GoogleLogin
          clientId="187084501157-nh6udnhhe46sdug252mqm9bcn8jd768v.apps.googleusercontent.com"
          render={renderProps => (
            <button
              className="btn btn-outline-app-secondary w-100 fw-500 fs-1p0 midnight py-2"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled || loading}>
              <FcGoogle size="20" className="me-2" />Continue with Google
            </button>
          )}
          buttonText="Google"
          onSuccess={onGoogleSuccess}
          onFailure={onGoogleFailure}
          cookiePolicy={'single_host_origin'}
        />
        <button type="button"
          className="d-none btn btn-outline-app-secondary w-100 fw-500 fs-1p0 midnight py-2"
        >
          <FcGoogle size="20" className="me-2" />Continue with Google
        </button>
        <button type="button"
          className="d-none btn btn-outline-app-secondary w-100 fw-500 fs-1p0 midnight py-2 mt-3"
        >
          <IoLogoFacebook size="20" className="ms-3 me-2" color="#1877f2" />Continue with Facebook
        </button>
        <div className="d-flex align-items-center justify-content-center fw-400 fs-0p75 blueberry-soda mt-4">
          <RiLock2Line className="me-2" />Your Info is safely secured
        </div>
        <div className="d-flex justify-content-center mt-4">
          <span className="fw-400 fs-1p0 bright-gray me-2">Don't have an account?</span>
          <span
            className={`fw-400 fs-1p0 color-primary ${!loading?"hand":""}`}
            onClick={onSignUp}
            disabled={loading}
          >Create account</span>
        </div>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default connect(
  null,
  {
    setUserId,
  }
)(LoginModal);