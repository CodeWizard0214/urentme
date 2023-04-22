import React, { useEffect, useState } from 'react';

import { Modal } from 'react-responsive-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MdArrowBackIos } from 'react-icons/md';
import { toast } from 'react-toastify';

import AppSpinner from '../../components/loading/AppSpinner';
import * as APIHandler from '../../apis/APIHandler';

const ForgotModal = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const onBack = () => {
    setOpen(false);
    if (props.onBack) {
      props.onBack();
    }
  }

  const sendCode = (email) => {
    setLoading(true);
    APIHandler.sendResetCode(email).then(data => {
      if (data.type === 'Succes' && props.onSentCode) {
        setOpen(false);
        props.onSentCode(email);
      } else {
        toast.error(data.msg);
      }
      setLoading(false);
    });
  }

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    }),
    onSubmit: values => {
      const { email } = values;
      sendCode(email);
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
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Forgot Your Password?</span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <div className="fw-400 fs-1p0 oxford-blue text-center">Don't worry, we have you covered. Please enter the email associated with your account.</div>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group mt-4 mb-3">
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
          <button
            type="submit"
            className="btn btn-app-primary w-100 fw-600 fs-1p0 white py-2"
            disabled={loading}
          >Send</button>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
}

export default ForgotModal;