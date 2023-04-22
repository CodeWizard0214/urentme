import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoArrowBack } from 'react-icons/io5';

import AppLazyImage from '../../../components/elements/AppLazyImage';
import AppSpinner from '../../../components/loading/AppSpinner';
import CropModal from '../../../components/crop/CropModal';
import { getAdminAvatar } from '../../../utils/imageUrl';
import { getImageBase64Data } from '../../../utils/imageUtils';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';
import NO_AVATAR from '../../../assets/images/no_avatar.png';
import styles from './AdminEditAdmin.module.css';

const ROLE_IDS = [
  {
    id: 1,
    name: 'Admin',
  },
  {
    id: 2,
    name: 'User Management',
  },
  {
    id: 3,
    name: 'Item Management',
  },
  {
    id: 4,
    name: 'Content Management',
  },
  {
    id: 5,
    name: 'Account Management',
  },
  {
    id: 6,
    name: 'Publication Management',
  },
];

const AdminEditAdmin = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [uploadImageValue, setUploadImageValue] = useState('') ;
  const [photo, setPhoto] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [openCrop, setOpenCrop] = useState(false);

  useEffect(() => {
    setIsView(pathname.includes('view'));
    setIsAdd(pathname.includes('add'));
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAdminInfo(id).then(data => {
      if (isMounted) {
        setLoading(false);
        if (data.length === 1) {
          setItemData(data[0]);
          setAvatar({ path: getAdminAvatar(data[0].profile_image) })
        }
      }
    });
    return () => { isMounted = false; };
  }, [id]);

  const onBack = () => {
    navigate('/admin/admins');
  }

  const onSaveRecord = async (values) => {
    setLoading(true);
    var sha1 = require('sha1');
    const hashPwd = sha1(Constant.HASHKEY + values.plain_pwd);
    const json = { ...values, id, password: hashPwd };
    let admin_id = id;
    if (isAdd) {
      const ret = await APIHandler.adminAddAdmin(json);
      if (ret.result !== 'true') {
        setLoading(false);
        toast.error("Record has not been updated");
        return;
      }
      admin_id = ret.id;
    } else {
      const ret = await APIHandler.adminEditAdmin(json);
      if (ret.result !== 'true') {
        setLoading(false);
        toast.error("Record has not been updated");
          return;
      }
    }

    if (!!avatar?.data) {
      const fname = "profile_image_" + parseInt(new Date().getTime() / 1000).toString() + '.jpeg';
      const ret = await APIHandler.adminImageAdmin(admin_id, fname, avatar.data);
      if (ret.result !== 'true' && !ret.includes('true')) {
        setLoading(false);
        toast.error("Profile image upload failed");
        return;
      }
    }

    setLoading(false);
    toast.success("Record has been updated successfully");
    navigate('/admin/admins');
  }

  const formik = useFormik({
    initialValues: {
      profile_image: itemData?.profile_image ?? '',
      first_name: itemData?.first_name ?? '',
      last_name: itemData?.last_name ?? '',
      email: itemData?.email ?? '',
      plain_pwd: isAdd ? '' : ' ',
      description: itemData?.description ?? '',
      role_id: itemData?.role_id ?? 1,
      status: itemData?.status ?? 1,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('Required'),
      last_name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      plain_pwd: Yup.string().required('Required'),
      role_id: Yup.number().required('Required'),
    }),
    enableReinitialize: true,
    onSubmit: values => {
      onSaveRecord(values);
    },
  });

  const renderAvatar = () => {
    const onChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setPhoto(URL.createObjectURL(e.target.files[0]));
        setOpenCrop(true);
      }
    }

    const onCropped = (url, blob) => {
      if (url && blob) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setAvatar({ path: URL.createObjectURL(blob), data: getImageBase64Data(reader.result) });
          setOpenCrop(false);
        });
        reader.readAsDataURL(blob);
      }
    }

    return (
      <div className="d-flex align-items-baseline justify-content-center">
        <span className="fw-500 fs-1p0 dark-gray me-3">Profile Image</span>
        <div className={styles.avatarContainer}>
          <label htmlFor="upload_avatar" className={styles.uploadAvatar}>
            <input
              id="upload_avatar"
              type="file"
              className="d-none"
              onChange={onChange}
              disabled={loading || isView}
              value={uploadImageValue}
              onClick={() => setUploadImageValue('')}
            />
            <div className={`${styles.uploadAvatar} ${(loading || isView) ? "" : "hand"}`}>
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
  }

  const renderAdminInfo = () => {
    return (
      <div className="row">
        <div className="form-group col-md-6 col-lg-5 offset-lg-1 col-xl-4 offset-xl-2 mt-3">
          <label htmlFor="first_name" className="form-label fw-500 fs-1p0 dark-gray">First Name *</label>
          <input
            type="text"
            id="first_name"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.first_name && formik.errors.first_name && "app-form-error"}`}
            value={formik.values.first_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.first_name && formik.errors.first_name &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.first_name}</span>
          }
        </div>
        <div className="form-group col-md-6 col-lg-5 col-xl-4 mt-3">
          <label htmlFor="last_name" className="form-label fw-500 fs-1p0 dark-gray">Last Name *</label>
          <input
            type="text"
            id="last_name"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.last_name && formik.errors.last_name && "app-form-error"}`}
            value={formik.values.last_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.last_name && formik.errors.last_name &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.last_name}</span>
          }
        </div>
        <div className="form-group col-md-6 col-lg-5 offset-lg-1 col-xl-4 offset-xl-2 mt-3">
          <label htmlFor="email" className="form-label fw-500 fs-1p0 dark-gray">Email Address *</label>
          <input
            type="email"
            id="email"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.email && formik.errors.email && "app-form-error"}`}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.email && formik.errors.email &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.email}</span>
          }
        </div>
        {isAdd &&
        <div className="form-group col-md-6 col-lg-5 col-xl-4 mt-3">
          <label htmlFor="plain_pwd" className="form-label fw-500 fs-1p0 dark-gray">Password *</label>
          <input
            type="password"
            id="plain_pwd"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.plain_pwd && formik.errors.plain_pwd && "app-form-error"}`}
            value={formik.values.plain_pwd}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.plain_pwd && formik.errors.plain_pwd &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.plain_pwd}</span>
          }
        </div>
        }
        <div className={`form-group col-md-6 col-lg-5 col-xl-4 mt-3 ${isAdd ? "offset-lg-1 offset-xl-2" : ""}`}>
          <label htmlFor="description" className="form-label fw-500 fs-1p0 dark-gray">Description</label>
          <textarea
            id="description"
            row="3"
            disabled={loading || isView}
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.description && formik.errors.description && "app-form-error"}`}
            style={{ height: "90px"}}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          { formik.touched.description && formik.errors.description &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.description}</span>
          }
        </div>
        <div className={`form-group col-md-6 col-lg-5 col-xl-4 mt-3 ${!isAdd ? "offset-lg-1 offset-xl-2" : ""}`}>
          <label htmlFor="role_id" className="form-label fw-400 fs-1p0 dark-gray">Role *</label>
          <select
            id="role_id"
            value={formik.values.role_id}
            // disabled={loading || isView || !isAdd}
            disabled={true}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.role_id && formik.errors.role_id && "app-form-error"}`}
          >
            {ROLE_IDS.map(role => (
              <option key={`role-${role.id}`} value={role.id}>{role.name}</option>
            ))}
          </select>
          {formik.touched.role_id && formik.errors.role_id  &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.role_id}</span>
          }
        </div>
      </div>
    )
  }

  const renderViewOptions = () => {
    return (
      <div className="row mt-3">
        <div className="form-group col-md-4 col-lg-3 col-xl-2 offset-lg-1 offset-xl-2 mt-3">
          <label className="fw-400 fs-1p0 dark-gray me-3">Status:</label>
          <span
            className="fw-400 fs-0p75 white border-12 px-3 py-1"
            style={{
              backgroundColor: (+itemData?.status) === 1 ? "#5cb85c" : "#f0ad4e",
            }}
          >{itemData?.status === 1 ? "Active" : "Deactive"}</span>
        </div>
        <div className="col-md-4 col-lg-3 mt-3">
          <label className="fw-400 fs-1p0 dark-gray me-3">Created:</label>
          <span className="fw-400 fs-1p0 oxford-blue">{itemData?.created ? moment(itemData.created).format(Constant.DATE_FORMAT) : ''}</span>
        </div>
        <div className="col-md-4 col-lg-3 mt-3">
          <label className="fw-400 fs-1p0 dark-gray me-3">Modified:</label>
          <span className="fw-400 fs-1p0 oxford-blue">{itemData?.modified ? moment(itemData.modified).format(Constant.DATE_FORMAT) : ''}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid position-relative px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Admin Management</h2>
      </div>
      <div className="d-flex align-items-center gap-2 my-3">
        <Link to="/admin/admins">
          <IoArrowBack className="fs-1p25 midnight" />
        </Link>
        <span className="fw-500 fs-1p125 midnight">Admin {isView ? "Detail" : "Edit"}</span>
      </div>
      <div className="app-container">
        <form onSubmit={formik.handleSubmit}>
          {renderAvatar()}
          {renderAdminInfo()}
          {isView && renderViewOptions()}
          <div className="d-flex align-items-center justify-content-center gap-3 my-4">
            {!isView &&
            <button
              type="submit"
              className="btn btn-app-primary fw-400 fs-1p0 white px-4"
              disabled={loading}
            >Submit</button>
            }
            <button
              type="button"
              className="btn btn-outline-app-primary fw-400 fs-1p0 white px-4"
              disabled={loading}
              onClick={onBack}
            >{isView ? "Back" : "Cancel"}</button>
          </div>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </div>
  );
};

export default AdminEditAdmin;
