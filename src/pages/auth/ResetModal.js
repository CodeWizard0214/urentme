import React, { useEffect, useState } from 'react';

import { Modal } from 'react-responsive-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MdArrowBackIos } from 'react-icons/md';
import { toast } from 'react-toastify';

import AppSpinner from '../../components/loading/AppSpinner';
import * as Constant from '../../constants/constant';
import * as APIHandler from '../../apis/APIHandler';

const ResetModal = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    setOpen(props.open);
    setLoading(false);
  }, [props.open])

  useEffect(() => {
    setEmail(props.email);
  }, [props.email])

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const onBack = () => {
    setOpen(false);
    if (props.onBack) {
      props.onBack();
    }
  }

  const resetPassword = (password, code) => {
    if (email === '') {
      toast.error('Internal Error');
      return;
    }

    setLoading(true);
    var sha1 = require('sha1');
    const hashPwd = sha1(Constant.HASHKEY + password);
    APIHandler.resetPassword(email, hashPwd, code).then(data => {
      if (data.type === 'Succes') {
        onCloseModal();
        toast.success('Your password has been changed successfully.', { autoClose: 8000 });
      } else {
        toast.error(data.msg);
      }
      setLoading(false);
    });
  }

  const formik = useFormik({
    initialValues: {
      password: '',
      code: '',
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required('Required'),
      code: Yup.number()
        .required('Required'),
    }),
    onSubmit: values => {
      const { password, code } = values;
      resetPassword(password, code);
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
        <MdArrowBackIos className="fp-24 gray-36 hand me-3" onClick={onBack} />
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Reset Password</span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <div className="fw-400 fs-1p0 oxford-blue text-center">Please enter new password and verify code.</div>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group mt-4">
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
          <div className="form-group mt-3 mb-4">
            <label htmlFor="code" className="form-label fw-500 fs-1p0 dark-gray">Code *</label>
            <input
              type="number"
              id="code"
              placeholder="Verify code"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.code && formik.errors.code && "app-form-error"}`}
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            { formik.touched.code && formik.errors.code &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.code}</span>
            }
          </div>
          <button
            type="submit"
            className="btn btn-app-primary w-100 fw-600 fs-1p0 white py-2"
            disabled={loading}
          >Reset</button>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
}

export default ResetModal;