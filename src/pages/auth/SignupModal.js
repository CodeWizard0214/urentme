import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Modal } from 'react-responsive-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import * as Constant from '../../constants/constant';
import * as APIHandler from '../../apis/APIHandler';
import AppSpinner from '../../components/loading/AppSpinner';
import AppCheckbox from '../../components/elements/AppCheckbox';

const SignupModal = (props) => {
  const [open, setOpen] = useState(false);
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      lastname: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      username: Yup.string()
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .required('Required')
    }),
    onSubmit: values => {
      const { firstname, lastname, username, email, password } = values;
      handleSignup(firstname, lastname, username, email, password);
    },
  });

  useEffect(() => {
    setOpen(props.open);
    setLoading(false);
  }, [props.open])

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const handleSignup = (firstname, lastname, username, email, password) => {
    setLoading(true);
    var sha1 = require('sha1');
    const hashPwd = sha1(Constant.HASHKEY + password);
    APIHandler.signup(firstname, lastname, username, email, hashPwd).then(data => {
      if (data.type === 'success') {
        onCloseModal();
        toast.success('Registered successfully. Please verify your phone number and driver license in account profile.');
      } else {
        toast.error(data.msg);
      }
      setLoading(false);
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
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Create your account</span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstname" className="form-label fw-500 fs-1p0 dark-gray">First name *</label>
            <input
              type="text"
              id="firstname"
              placeholder="John"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.firstname && formik.errors.firstname && "app-form-error"}`}
              value={formik.values.firstname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            { formik.touched.firstname && formik.errors.firstname &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.firstname}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="lastname" className="form-label fw-500 fs-1p0 dark-gray">Last name *</label>
            <input
              type="text"
              id="lastname"
              placeholder="Doe"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.lastname && formik.errors.lastname && "app-form-error"}`}
              value={formik.values.lastname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            { formik.touched.lastname && formik.errors.lastname &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.lastname}</span>
            }
          </div>
          <div className="form-group mt-3">
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
            <label htmlFor="email" className="form-label fw-500 fs-1p0 dark-gray">Email *</label>
            <input
              type="email"
              id="email"
              placeholder="johndoe@gmail.com"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.email && formik.errors.email && "app-form-error"}`}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            { formik.touched.email && formik.errors.email &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.email}</span>
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
          <div className="d-flex mt-3 mb-4 ms-3">
            <AppCheckbox
              label="I have read and agree to the"
              labelClassName="fw-400 fs-0p875 bright-gray ms-2"
              checked={agree}
              onChange={setAgree}
              disabled={loading}
            />
            <Link
              to="/terms"
              className="fw-400 fs-0p875 color-primary decoration-none ms-2"
              onClick={onCloseModal}
            >Terms &amp; Conditions</Link>
          </div>
          <button
            type="submit"
            className="btn btn-app-primary w-100 fw-600 fs-1p0 white py-2"
            disabled={!agree || loading}
          >Sign Up</button>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default SignupModal;