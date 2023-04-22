import React, { useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import AppSpinner from '../../../components/loading/AppSpinner';
import * as APIHandler from '../../../apis/APIHandler';

const EditSecurityDepositModal = (props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fee, setFee] = useState(0);

  useEffect(() => {
    setOpen(props.open);
    setFee(0);
  }, [props.open]);

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const calcFee = (buyer_amount, seller_amount, security_deposit) => {
    const total_amount = buyer_amount + seller_amount;
    if (total_amount > security_deposit) {
      setError('Owner + Renter amount cannot be larger than total security deposit');
    } else {
      setError('');
      setFee(security_deposit - total_amount);
    }
  }

  const onChangeBuyerAmount = (e) => {
    if (e.target.value < 0) {
      return;
    }
    formik.handleChange(e);
    calcFee(+e.target.value, formik.values.seller_amount, +formik.values.security_amount);
  }

  const onChangeSellerAmount = (e) => {
    if (e.target.value < 0) {
      return;
    }
    formik.handleChange(e);
    calcFee(formik.values.buyer_amount, +e.target.value, +formik.values.security_amount);
  }

  const handleRelease = (seller_amount, buyer_amount) => {
    setLoading(true);
    APIHandler.adminBookingReleaseDeposit(props.id, seller_amount, buyer_amount).then(data => {
      setLoading(false);
      if (data.result === 'true') {
        toast.success('Security deposit has been released between renter and owner');
        setOpen(false);
        if (props.onSuccess) {
          props.onSuccess();
        }
      } else {
        toast.error(data.error);
      }
    });
  }

  const formik = useFormik({
    initialValues: {
      security_amount: props.amount,
      buyer_amount: props.amount,
      seller_amount: 0,
      open: open, /// for reinitialize
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      security_amount: Yup.number().required('Required'),
      buyer_amount: Yup.number().required('Required').min(0, 'Amount must be integer'),
      seller_amount: Yup.number().required('Required').min(0, 'Amount must be integer'),
    }),
    onSubmit: values => {
      handleRelease(values.seller_amount, values.buyer_amount);
    },
  });

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      closeOnOverlayClick={props.closeOnOverlayClick ?? true}
      center
      classNames={{ root: 'z-1050', modal: 'w-480px border-12 position-relative' }}
    >
      <div className="modal-header">
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">Security Deposit Distribution</span>
      </div>
      <div className="modal-body">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="security_amount" className="form-label fw-500 fs-1p0 dark-gray">Security *</label>
            <input
              type="number"
              id="security_amount"
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control`}
              value={formik.values.security_amount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={true}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="buyer_amount" className="form-label fw-500 fs-1p0 dark-gray">To Renter *</label>
            <input
              type="number"
              id="buyer_amount"
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.buyer_amount && formik.errors.buyer_amount && "app-form-error"}`}
              value={formik.values.buyer_amount}
              onChange={onChangeBuyerAmount}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.buyer_amount && formik.errors.buyer_amount &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.buyer_amount}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="seller_amount" className="form-label fw-500 fs-1p0 dark-gray">To Owner *</label>
            <input
              type="number"
              id="seller_amount"
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.seller_amount && formik.errors.seller_amount && "app-form-error"}`}
              value={formik.values.seller_amount}
              onChange={onChangeSellerAmount}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.seller_amount && formik.errors.seller_amount &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.seller_amount}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="urentme_amount" className="form-label fw-500 fs-1p0 dark-gray">To UrentMe *</label>
            <input
              type="number"
              id="urentme_amount"
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control`}
              value={fee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={true}
            />
          </div>
          {error && (
            <div className="fw-300 fs-0p75 red-orange mt-3">{error}</div>
          )}
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-app-primary fw-500 fs-1p0 midnight py-2 w-100"
              disabled={loading || error}
            >Release</button>
            <button
              type="button"
              className="btn btn-outline-app-primary w-100 fw-500 fs-1p0 midnight py-2"
              onClick={onCloseModal}
              disabled={loading}
            >Close</button>
          </div>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default EditSecurityDepositModal;
