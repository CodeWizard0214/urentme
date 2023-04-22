import React, { useEffect, useState } from 'react';

import { Modal } from 'react-responsive-modal';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextEditor from "../../../components/editor/TextEditor";

import AppSpinner from '../../../components/loading/AppSpinner';
import * as APIHandler from '../../../apis/APIHandler';

const EditEmailTemplateModal = (props) => {
  const { itemData } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    setOpen(props.open);
    setLoading(false);
  }, [props.open]);

  const onCloseModal = () => {
    setOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  const onSuccess = () => {
    formik.setFieldValue('title', '');
    formik.setFieldValue('subject', '');
    formik.setFieldValue('description', '');
    formik.setFieldValue("status", 1);
    setOpen(false);
    if (props.onSuccess) {
      props.onSuccess();
    }
  };

  const onEditData = (values) => {
    setLoading(true);
    values.id = itemData.id;
    APIHandler.adminEditEmailTemplate(values).then((data) => {
      setLoading(false);
      if (data.result === "true") {
        onSuccess();
        toast.success("Record has been updated successfully");
      } else {
        toast.error("Record has not been updated");
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      title: itemData?.title ?? '',
      subject: itemData?.subject ?? '',
      description: itemData?.description ?? '',
      status: itemData?.status ?? 1,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      subject: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      values["description"] = textContent;
      onEditData(values);
    },
  });

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      showCloseIcon={false}
      center
      classNames={{ root: "z-1050", modal: "border-12 position-relative" }}
    >
      <div className="modal-header">
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">
          {itemData ? "Edit" : "Add"} Email Template
        </span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label fw-500 fs-1p0 dark-gray">Title *</label>
            <input
              type="text"
              id="title"
              placeholder="Title"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.title && formik.errors.title && "app-form-error"}`}
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.title && formik.errors.title &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.title}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="subject" className="form-label fw-500 fs-1p0 dark-gray">Subject *</label>
            <input
              type="text"
              id="subject"
              placeholder="Subject"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.subject && formik.errors.subject && "app-form-error"}`}
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.subject && formik.errors.subject &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.subject}</span>
            }
          </div>
          <div className="form-group mt-3">
            <label htmlFor="description" className="form-label fw-500 fs-1p0 dark-gray">Description *</label>
            <TextEditor contents={formik.values.description} handleTextChange={ (text) => {setTextContent(text)}} />
          </div>
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

export default EditEmailTemplateModal;
