import React, { useEffect, useState } from 'react';

import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AppSpinner from '../../../components/loading/AppSpinner';
import * as APIHandler from '../../../apis/APIHandler';

const EditDepositModal = (props) => {
  const { itemData, categories } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(props.open);
    setLoading(false);
  }, [props.open]);

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const onSuccess = () => {
    formik.setFieldValue('category', '');
    formik.setFieldValue('name', '');
    formik.setFieldValue('deposit', '');
    formik.setFieldValue('rate', '');
    formik.setFieldValue('taxRate', '');
    setOpen(false);
    if (props.onSuccess) {
      props.onSuccess();
    }
  }

  const onAddData = (values) => {
    setLoading(true);
    APIHandler.adminAddDeposit(values).then(data => {
      setLoading(false);
      if (data.result === 'true') {
        onSuccess();
        toast.success('Record has been created successfully');
      } else {
        toast.error('Record has not been created');
      }
    });
  }

  const onEditData = (values) => {
    setLoading(true);
    values.id = itemData.id;
    APIHandler.adminEditDeposit(values).then(data => {
      setLoading(false);
      if (data.result === 'true') {
        onSuccess();
        toast.success('Record has been updated successfully');
      } else {
        toast.error('Record has not been updated');
      }
    });
  }

  const formik = useFormik({
    initialValues: {
      category: itemData?.category_id ?? '',
      deposit: itemData?.security_deposit ?? '',
      rate: itemData?.insurance_rate ?? '',
      taxRate: itemData?.insurance_tax_rate ?? '',
    },
    validationSchema: Yup.object({
      category: Yup.number().required('Required'),
      deposit: Yup.number().required('Required'),
      rate: Yup.number().required('Required'),
      taxRate: Yup.number().required('Required'),
    }),
    enableReinitialize: true,
    onSubmit: values => {
      if (itemData) {
        onEditData(values);
      } else {
        onAddData(values);
      }
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
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">{itemData ? 'Edit' : 'Add'} Deposit &amp; Insurance</span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="category" className="form-label fw-400 fs-1p0 dark-gray">Category *</label>
            <select
              id="category"
              value={formik.values.category}
              required
              disabled={loading || itemData}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.category && formik.errors.category && "app-form-error"}`}
            >
              <option value="" hidden>Select Category</option>
              {categories?.map((item) => (
                <option key={`category-${item.id}`} value={item.id}>{item.name}</option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category  &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.category}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="deposit" className="form-label fw-500 fs-1p0 dark-gray">Security Deposit *</label>
            <input
              type="number"
              id="deposit"
              placeholder="Security Deposit"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.deposit && formik.errors.deposit && "app-form-error"}`}
              value={formik.values.deposit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.deposit && formik.errors.deposit &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.deposit}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="rate" className="form-label fw-500 fs-1p0 dark-gray">Insurance Rate Per Day *</label>
            <input
              type="number"
              id="rate"
              placeholder="Insurance Rate Per Day"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.rate && formik.errors.rate && "app-form-error"}`}
              value={formik.values.rate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.rate && formik.errors.rate &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.rate}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="taxRate" className="form-label fw-500 fs-1p0 dark-gray">Insurance Tax Rate Per Day *</label>
            <input
              type="number"
              id="taxRate"
              placeholder="Insurance Tax Rate Per Day"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.taxRate && formik.errors.taxRate && "app-form-error"}`}
              value={formik.values.taxRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.taxRate && formik.errors.taxRate &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.taxRate}</span>
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
              onClick={onCloseModal}
            >Cancel</button>
          </div>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default EditDepositModal;
