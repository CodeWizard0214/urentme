import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoArrowBack } from "react-icons/io5";

import AppLazyImage from "../../../components/elements/AppLazyImage";
import AppSpinner from "../../../components/loading/AppSpinner";
import CropModal from "../../../components/crop/CropModal";
import { getTestimonialImage } from "../../../utils/imageUrl";
import { getImageBase64Data } from "../../../utils/imageUtils";
import * as APIHandler from "../../../apis/APIHandler";
import NO_AVATAR from "../../../assets/images/no_avatar.png";
import TextEditor from "../../../components/editor/TextEditor";
import styles from "./AdminEditTestimonial.module.css";

const AdminEditTestimonial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadImageValue, setUploadImageValue] = useState("");
  const [photo, setPhoto] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [openCrop, setOpenCrop] = useState(false);
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (id) {
      setLoading(true);
      APIHandler.adminIdTestimonials(id).then((data) => {
        if (isMounted) {
          setLoading(false);
          if (data.length === 1) {
            setItemData(data[0]);
            setAvatar({ path: getTestimonialImage(data[0].image) });
          }
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const onBack = () => {
    navigate("/admin/testimonials");
  };

  const onSaveRecord = async (values) => {
    setLoading(true);
    let testimonial_id = id;
    if (!id) {
      const ret = await APIHandler.adminAddTestimonial(values);
      if (ret.result !== "true") {
        setLoading(false);
        toast.error("Record has not been updated");
        return;
      }
      testimonial_id = ret.id;
    } else {
      values['id'] = testimonial_id;
      const ret = await APIHandler.adminEditTestimonial(values);
      if (ret.result !== "true") {
        setLoading(false);
        toast.error("Record has not been updated");
        return;
      }
    }

    if (!!avatar?.data) {
      const fname =
        "post_image_" +
        parseInt(new Date().getTime() / 1000).toString() +
        ".jpeg";
      const ret = await APIHandler.adminImageTestimonial(
        testimonial_id,
        fname,
        avatar.data
      );
      if (ret.result !== "true" && !ret.includes("true")) {
        setLoading(false);
        toast.error("Profile image upload failed");
        return;
      }
    }

    setLoading(false);
    toast.success("Record has been updated successfully");
    navigate("/admin/testimonials");
  };

  const formik = useFormik({
    initialValues: {
      profile_image: itemData?.profile_image ?? "",
      name: itemData?.name ?? "",
      designation: itemData?.designation ?? "",
      listorder: itemData?.list_order ?? "",
      status: itemData?.status ?? 1,
      contents: itemData?.contents ?? "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      designation: Yup.string().required("Required"),
      listorder: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      values["contents"] = textContent;
      onSaveRecord(values);
    },
  });

  const renderAvatar = () => {
    const onChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setPhoto(URL.createObjectURL(e.target.files[0]));
        setOpenCrop(true);
      }
    };

    const onCropped = (url, blob) => {
      if (url && blob) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setAvatar({
            path: URL.createObjectURL(blob),
            data: getImageBase64Data(reader.result),
          });
          setOpenCrop(false);
        });
        reader.readAsDataURL(blob);
      }
    };

    return (
      <div className="d-flex align-items-baseline justify-content-center">
        <span className="fw-500 fs-1p0 dark-gray me-3">Media Image</span>
        <div className={styles.avatarContainer}>
          <label htmlFor="upload_avatar" className={styles.uploadAvatar}>
            <input
              id="upload_avatar"
              type="file"
              className="d-none"
              onChange={onChange}
              disabled={loading}
              value={uploadImageValue}
              onClick={() => setUploadImageValue("")}
            />
            <div className={`${styles.uploadAvatar} ${loading ? "" : "hand"}`}>
              <AppLazyImage
                src={avatar?.path ?? NO_AVATAR}
                alt=""
                placeholder={NO_AVATAR}
                className={styles.imageItem}
                wrapperClassName={styles.imageWrapper}
              />
            </div>
          </label>
        </div>
        <CropModal
          open={openCrop}
          src={photo}
          onClose={() => setOpenCrop(false)}
          onUpload={onCropped}
        />
      </div>
    );
  };

  const renderAdminInfo = () => {
    return (
      <div className="row">
        <div className="form-group col-md-6 col-lg-5 offset-lg-1 col-xl-4 offset-xl-2 mt-3">
          <label htmlFor="name" className="form-label fw-500 fs-1p0 dark-gray">
            Name *
          </label>
          <input
            type="text"
            id="name"
            placeholder=""
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
        <div className="form-group col-md-6 col-lg-5 col-xl-4 mt-3">
          <label
            htmlFor="designation"
            className="form-label fw-500 fs-1p0 dark-gray"
          >
            Designation *
          </label>
          <input
            type="text"
            id="designation"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${
              formik.touched.designation &&
              formik.errors.designation &&
              "app-form-error"
            }`}
            value={formik.values.designation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading}
          />
          {formik.touched.designation && formik.errors.designation && (
            <span className="fw-300 fs-0p75 red-orange">
              {formik.errors.designation}
            </span>
          )}
        </div>
        <div className="form-group col-md-12 col-lg-10 col-xl-8 offset-lg-1 offset-xl-2 mt-3">
          <label
            htmlFor="contents"
            className="form-label fw-500 fs-1p0 dark-gray"
          >
            Content *
          </label>
          <TextEditor
            contents={formik.values.contents}
            handleTextChange={(text) => {
              setTextContent(text);
            }}
          />
        </div>
        <div className="form-group col-md-6 col-lg-5 offset-lg-1 col-xl-4 offset-xl-2 mt-3">
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
        <div className="form-group col-md-6 col-lg-5 col-xl-4 mt-3">
          <label
            htmlFor="listorder"
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
              formik.touched.status && formik.errors.status && "app-form-error"
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
      </div>
    );
  };

  return (
    <div className="container-fluid position-relative px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Testimonial Management</h2>
      </div>
      <div className="d-flex align-items-center gap-2 my-3">
        <Link to="/admin/testimonials">
          <IoArrowBack className="fs-1p25 midnight" />
        </Link>
        <span className="fw-500 fs-1p125 midnight">
          Testimonial {id ? "Edit" : "Add"}
        </span>
      </div>
      <div className="app-container">
        <form onSubmit={formik.handleSubmit}>
          {renderAvatar()}
          {renderAdminInfo()}
          <div className="d-flex align-items-center justify-content-center gap-3 my-4">
            {
              <button
                type="submit"
                className="btn btn-app-primary fw-400 fs-1p0 white px-4"
                disabled={loading}
              >
                Submit
              </button>
            }
            <button
              type="button"
              className="btn btn-outline-app-primary fw-400 fs-1p0 white px-4"
              disabled={loading}
              onClick={onBack}
            >
              {"Cancel"}
            </button>
          </div>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </div>
  );
};

export default AdminEditTestimonial;
