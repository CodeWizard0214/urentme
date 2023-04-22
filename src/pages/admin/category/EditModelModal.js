import React, { useEffect, useState } from 'react';

import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import AppSpinner from '../../../components/loading/AppSpinner';
import * as APIHandler from '../../../apis/APIHandler';

const EditModelModal = (props) => {
  const { itemData, categories, allMakes } = props;
  const [makes, setMakes] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOpen(props.open);
    setLoading(false);
  }, [props.open]);

  useEffect(() => {
    if (allMakes.length > 0 && itemData) {
      setMakes(allMakes.filter(item => item.category_id === itemData.category_id));
    }
  }, [allMakes, itemData]);

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  const onSuccess = () => {
    formik.setFieldValue('category', '');
    formik.setFieldValue('make', '');
    formik.setFieldValue('name', '');
    formik.setFieldValue('startyear', '');
    formik.setFieldValue('endyear', '');
    formik.setFieldValue('status', 1);
    setOpen(false);
    if (props.onSuccess) {
      props.onSuccess();
    }
  }

  const onAddData = (values) => {
    setLoading(true);
    APIHandler.adminAddModel(values.make, values.name, values.startyear, values.endyear).then(data => {
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
    APIHandler.adminEditModel(itemData.id, values.make, values.name, values.startyear, values.endyear, values.status).then(data => {
      setLoading(false);
      if (data.result === 'true') {
        onSuccess();
        toast.success('Record has been updated successfully');
      } else {
        toast.error('Record has not been updated');
      }
    });
  }

  const onSelectCategory = (e) => {
    formik.handleChange(e);
    setMakes(allMakes.filter(item => item.category_id === (+e.target.value)));
    formik.setFieldValue('make', '');
  }

  const formik = useFormik({
    initialValues: {
      category: itemData?.category_id ?? '',
      make: itemData?.make_id ?? '',
      name: itemData?.name ?? '',
      status: itemData?.status ?? 1,
      startyear: itemData?.startyear ?? '',
      endyear: itemData?.endyear ?? '',
    },
    validationSchema: Yup.object({
      category: Yup.string().required('Required'),
      make: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      status: Yup.string().required('Required'),
      startyear: Yup.number().required('Required'),
      endyear: Yup.number().required('Required'),
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
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">{itemData ? 'Edit' : 'Add'} Model</span>
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
              onChange={onSelectCategory}
              onBlur={formik.handleBlur}
              className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.category && formik.errors.category && "app-form-error"}`}
            >
              <option value="" hidden>Select Category</option>
              {categories.map((item) => (
                <option key={`category-${item.id}`} value={item.id}>{item.name}</option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category  &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.category}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="make" className="form-label fw-400 fs-1p0 dark-gray">Make *</label>
            <select
              id="make"
              value={formik.values.make}
              required
              disabled={loading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.make && formik.errors.make && "app-form-error"}`}
            >
              <option value="" hidden>Select Make</option>
              {makes.map((item) => (
                <option key={`make-${item.id}`} value={item.id}>{item.name}</option>
              ))}
            </select>
            {formik.touched.make && formik.errors.make  &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.make}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="name" className="form-label fw-500 fs-1p0 dark-gray">Name *</label>
            <input
              type="text"
              id="name"
              placeholder="Model Name"
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
          <div className="form-group mt-3">
            <label htmlFor="startyear" className="form-label fw-500 fs-1p0 dark-gray">Start Year *</label>
            <input
              type="text"
              id="startyear"
              placeholder="Start Year"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.startyear && formik.errors.startyear && "app-form-error"}`}
              value={formik.values.startyear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.startyear && formik.errors.startyear &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.startyear}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="endyear" className="form-label fw-500 fs-1p0 dark-gray">End Year *</label>
            <input
              type="text"
              id="endyear"
              placeholder="End Year"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.endyear && formik.errors.endyear && "app-form-error"}`}
              value={formik.values.endyear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.endyear && formik.errors.endyear &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.endyear}</span>
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

export default EditModelModal;
