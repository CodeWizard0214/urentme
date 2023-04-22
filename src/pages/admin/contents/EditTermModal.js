import React, { useEffect, useState } from "react";

import { Modal } from "react-responsive-modal";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import AppSpinner from "../../../components/loading/AppSpinner";
import * as APIHandler from "../../../apis/APIHandler";
import TextEditor from "../../../components/editor/TextEditor";

const EditTermModal = (props) => {
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
    formik.setFieldValue("name", "");
    formik.setFieldValue("contents", "");
    formik.setFieldValue("list_order", "");
    formik.setFieldValue("status", 1);
    setOpen(false);
    if (props.onSuccess) {
      props.onSuccess();
    }
  };

  const onAddData = (values) => {
    setLoading(true);
    APIHandler.adminAddTerm(values).then((data) => {
      setLoading(false);
      if (data.result === "true") {
        onSuccess();
        toast.success("Record has been created successfully");
      } else {
        toast.error("Record has not been created");
      }
    });
  };

  const onEditData = (values) => {
    setLoading(true);
    values.id = itemData.id;
    APIHandler.adminEditTerm(values).then((data) => {
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
      name: itemData?.name ?? "",
      status: itemData?.status ?? 1,
      listorder: itemData?.list_order ?? "",
      contents: itemData?.contents ?? "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
      listorder: Yup.number().required("Required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      values["contents"] = textContent;
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
      classNames={{ root: "z-1050", modal: "border-12 position-relative" }}
    >
      <div className="modal-header">
        <span className="modal-title fw-600 fs-1p5 midnight w-100 text-center">
          {itemData ? "Edit" : "Add"} Terms &amp; Conditions
        </span>
        <span type="button" className="btn-close" onClick={onCloseModal} />
      </div>
      <div className="modal-body">
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label
              htmlFor="name"
              className="form-label fw-500 fs-1p0 dark-gray"
            >
              Name *
            </label>
            <input
              type="text"
              id="name"
              placeholder="Name"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${
                formik.touched.name && formik.errors.name && "app-form-error"
              }`}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.name && formik.errors.name && (
              <span className="fw-300 fs-0p75 red-orange">
                {formik.errors.name}
              </span>
            )}
          </div>
          <div className="form-group mt-3">
            <label
              htmlFor="contents"
              className="form-label fw-500 fs-1p0 dark-gray"
            >
              Content *
            </label>
            <TextEditor contents={formik.values.contents} handleTextChange={ (text) => {setTextContent(text)}} />
          </div>
          <div className="form-group mt-3">
            <label
              htmlFor="listorder"
              className="form-label fw-500 fs-1p0 dark-gray"
            >
              Display order *
            </label>
            <input
              type="number"
              id="listorder"
              placeholder="Display order"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${
                formik.touched.listorder &&
                formik.errors.listorder &&
                "app-form-error"
              }`}
              value={formik.values.listorder}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading}
            />
            {formik.touched.listorder && formik.errors.listorder && (
              <span className="fw-300 fs-0p75 red-orange">
                {formik.errors.listorder}
              </span>
            )}
          </div>
          {itemData && (
            <div className="form-group mt-3">
              <label
                htmlFor="status"
                className="form-label fw-400 fs-1p0 dark-gray"
              >
                Status *
              </label>
              <select
                id="status"
                value={formik.values.status}
                required
                disabled={loading}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${
                  formik.touched.status &&
                  formik.errors.status &&
                  "app-form-error"
                }`}
              >
                <option value={1}>Active</option>
                <option value={0}>Deactive</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <span className="fw-300 fs-0p75 red-orange">
                  {formik.errors.status}
                </span>
              )}
            </div>
          )}
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-app-primary w-100 fw-500 fs-1p0 white py-2"
              disabled={loading}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-outline-app-primary w-100 fw-500 fs-1p0 midnight py-2"
              onClick={onCloseModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </Modal>
  );
};

export default EditTermModal;
