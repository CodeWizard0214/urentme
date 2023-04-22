import React, { useEffect, useState } from 'react';

import { Modal } from 'react-responsive-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AppSpinner from '../../../components/loading/AppSpinner';

const PasswordModal = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(props.open);
    setLoading(false);
  }, [props.open]);

  useEffect(() => {
    setLoading(props.loading);
  }, [props.loading]);

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const formik = useFormik({
    initialValues: {
      password: '',
      confirm: '',
      open: open, /// for reinitialize
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Required')
        .min(6, 'Too short. It should have 6 characters or more')
        .matches(/[A-Z]+/, "At least 1 uppercase character"),
      confirm: Yup.string()
        .required('Required')
        .oneOf([Yup.ref('password'), null], 'Password mismatch'),
    }),
    onSubmit: values => {
      props.onChange(values.password);
    },
  });

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      center
      classNames={{root: 'z-1050', modal: 'w-480px border-12 position-relative'}}
    >
      <div className="modal-header">
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Change Password</span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="password" className="form-label fw-500 fs-1p0 dark-gray">New Password *</label>
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
          <div className="form-group mt-4">
            <label htmlFor="confirm" className="form-label fw-500 fs-1p0 dark-gray">Confirm Password *</label>
            <input
              type="password"
              id="confirm"
              placeholder="Confirm password"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.confirm && formik.errors.confirm && "app-form-error"}`}
              value={formik.values.confirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            { formik.touched.confirm && formik.errors.confirm &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.confirm}</span>
            }
          </div>
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-app-primary w-100 fw-500 fs-1p0 white py-2"
              disabled={loading}
            >Submit</button>
            <button
              type="button"
              className="btn btn-outline-app-primary w-100 fw-500 fs-1p0 midnight py-2"
              disabled={loading}
              onClick={onCloseModal}
            >Cancel</button>
          </div>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default PasswordModal;
