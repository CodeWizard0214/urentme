import React, { useEffect, useState } from 'react';

import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AppSpinner from '../../../components/loading/AppSpinner';
import AppCheckbox from '../../../components/elements/AppCheckbox';
import * as APIHandler from '../../../apis/APIHandler';

const EditMakeModal = (props) => {
  const { itemData } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generator, setGenerator] = useState(false);
  const [mileageCharge, setMileageCharge] = useState(false);

  useEffect(() => {
    setOpen(props.open);
    setLoading(false);
  }, [props.open]);

  useEffect(() => {
    if (itemData) {
      setGenerator(itemData.generator === 1);
      setMileageCharge(itemData.mileage_charge === 1);
    }
  }, [itemData]);

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const onSuccess = () => {
    formik.setFieldValue('name', '');
    formik.setFieldValue('status', 1);
    setOpen(false);
    if (props.onSuccess) {
      props.onSuccess();
    }
  }

  const onAddData = (values) => {
    setLoading(true);
    APIHandler.adminAddCategory(values.name, generator ? 1 : 0, mileageCharge ? 1 : 0,
      values.success_message, values.min_earning, values.max_earning).then(data => {
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
    APIHandler.adminEditCategory(itemData.id, values.name, generator ? 1 : 0, mileageCharge ? 1 : 0,
      values.success_message, values.min_earning, values.max_earning, values.status).then(data => {
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
      name: itemData?.name ?? '',
      success_message: itemData?.success_message ?? '',
      min_earning: itemData?.min_earning ?? '',
      max_earning: itemData?.max_earning ?? '',
      status: itemData?.status ?? 1,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      min_earning: Yup.number().required('Required'),
      max_earning: Yup.number().required('Required'),
      status: Yup.string().required('Required'),
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
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">{itemData ? 'Edit' : 'Add'} Category</span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label fw-500 fs-1p0 dark-gray">Name *</label>
            <input
              type="text"
              id="name"
              placeholder="Category Name"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.name && formik.errors.name && "app-form-error"}`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.name && formik.errors.name &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.name}</span>
            }
          </div>
          <div className="mt-3">
            <AppCheckbox
              label="Generator"
              labelClassName="fw-400 fs-0p875 bright-gray ms-2"
              checked={generator}
              onChange={setGenerator}
              disabled={loading}
            />
          </div>
          <div className="mt-3">
            <AppCheckbox
              label="Mileage Charge"
              labelClassName="fw-400 fs-0p875 bright-gray ms-2"
              checked={mileageCharge}
              onChange={setMileageCharge}
              disabled={loading}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="success_message" className="form-label fw-500 fs-1p0 dark-gray">Success Message</label>
            <textarea
              id="success_message"
              placeholder="Success Message"
              className="form-control fw-400 fs-0p875 oxford-blue app-form-control"
              value={formik.values.success_message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="min_earning" className="form-label fw-500 fs-1p0 dark-gray">Min Annual Earning *</label>
            <input
              type="text"
              id="min_earning"
              placeholder="$"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.min_earning && formik.errors.min_earning && "app-form-error"}`}
              value={formik.values.min_earning}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.min_earning && formik.errors.min_earning &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.min_earning}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="max_earning" className="form-label fw-500 fs-1p0 dark-gray">Max Annual Earning *</label>
            <input
              type="text"
              id="max_earning"
              placeholder="$"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.max_earning && formik.errors.max_earning && "app-form-error"}`}
              value={formik.values.max_earning}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.max_earning && formik.errors.max_earning &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.max_earning}</span>
            }
          </div>
          {itemData && (
          <div className="form-group mt-3">
            <label htmlFor="status" className="form-label fw-400 fs-1p0 dark-gray">Status *</label>
            <select
              id="status"
              value={formik.values.status}
              required
              disabled={loading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.status && formik.errors.status && "app-form-error"}`}
            >
              <option value={1}>Active</option>
              <option value={0}>Deactive</option>
            </select>
            {formik.touched.status && formik.errors.status  &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.status}</span>
            }
          </div>
          )}
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

export default EditMakeModal;
