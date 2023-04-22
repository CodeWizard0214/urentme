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
import { getMemberAvatar } from '../../../utils/imageUrl';
import { getImageBase64Data } from '../../../utils/imageUtils';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';
import NO_AVATAR from '../../../assets/images/no_avatar.png';
import styles from './AdminEditMember.module.css';

const AdminEditMember = () => {
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
    APIHandler.adminMemberInfo(id).then(data => {
      if (isMounted) {
        setLoading(false);
        if (data.length === 1) {
          setItemData(data[0]);
          setAvatar({ path: getMemberAvatar(data[0].profile_image) })
        }
      }
    });
    return () => { isMounted = false; };
  }, [id]);

  const onBack = () => {
    navigate('/admin/users');
  }

  const onSaveRecord = async (values) => {
    var sha1 = require('sha1');
    const hashPwd = sha1(Constant.HASHKEY + values.plain_pwd);
    const json = { ...values, id, password: hashPwd };
    let user_id = id;
    setLoading(true);
    if (isAdd) {
      const ret = await APIHandler.adminAddMember(json);
      if (ret.result !== 'true') {
        setLoading(false);
        toast.error(ret.error);
        return;
      }
      user_id = ret.id;
    } else {
      const ret = await APIHandler.adminEditMember(json);
      if (ret.result !== 'true') {
        setLoading(false);
        toast.error(ret.error);
        return;
      }
    }

    if (!!avatar?.data) {
      const fname = user_id + "_" + parseInt(new Date().getTime() / 1000).toString() + '.jpeg';
      const ret = await APIHandler.uploadProfileImage(user_id, fname, avatar.data);
      if (ret.response !== 'True' && !ret.includes('True')) {
        setLoading(false);
        toast.error("Profile image upload failed");
        return;
      }
    }

    setLoading(false);
    toast.success("Record has been updated successfully");
    navigate('/admin/users');
  }

  const formik = useFormik({
    initialValues: {
      profile_image: itemData?.profile_image ?? '',
      first_name: itemData?.first_name ?? '',
      last_name: itemData?.last_name ?? '',
      username: itemData?.username ?? '',
      mobile: itemData?.mobile ?? '',
      email: itemData?.email ?? '',
      age: itemData?.age ?? '',
      street1: itemData?.street1 ?? '',
      street2: itemData?.street2 ?? '',
      city: itemData?.city ?? '',
      state: itemData?.state ?? '',
      zipcode: itemData?.zipcode ?? '',
      urentme_fee: (isAdd || !itemData?.urentme_fee) ? 0 : (Number(itemData?.urentme_fee).toFixed(2) ?? ''),
      status: itemData?.status ?? 1,
      plain_pwd: isAdd ? '' : ' ',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('Required'),
      last_name: Yup.string().required('Required'),
      username: Yup.string().required('Required'),
      mobile: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      urentme_fee: Yup.string().required('Required'),
      plain_pwd: Yup.string().required('Required'),
      status: Yup.string().required('Required'),
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

  const renderUserInfo = () => {
    return (
      <div className="row">
        <div className="form-group col-md-4 mt-3">
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
        <div className="form-group col-md-4 mt-3">
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
        <div className="form-group col-md-4 mt-3">
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
        {!isAdd &&
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="username" className="form-label fw-500 fs-1p0 dark-gray">Username *</label>
          <input
            type="text"
            id="username"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.username && formik.errors.username && "app-form-error"}`}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.username && formik.errors.username &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.username}</span>
          }
        </div>
        }
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="mobile" className="form-label fw-500 fs-1p0 dark-gray">Mobile *</label>
          <input
            type="text"
            id="mobile"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.mobile && formik.errors.mobile && "app-form-error"}`}
            value={formik.values.mobile}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.mobile && formik.errors.mobile &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.mobile}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="age" className="form-label fw-500 fs-1p0 dark-gray">Age</label>
          <input
            type="number"
            id="age"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.age && formik.errors.age && "app-form-error"}`}
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.age && formik.errors.age &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.age}</span>
          }
        </div>
      </div>
    );
  }

  const renderLocation = () => {
    return (
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="street1" className="form-label fw-500 fs-1p0 dark-gray">Street 1</label>
          <input
            type="text"
            id="street1"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.street1 && formik.errors.street1 && "app-form-error"}`}
            value={formik.values.street1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.street1 && formik.errors.street1 &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.street1}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="street2" className="form-label fw-500 fs-1p0 dark-gray">Street 2</label>
          <input
            type="text"
            id="street2"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.street2 && formik.errors.street2 && "app-form-error"}`}
            value={formik.values.street2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.street2 && formik.errors.street2 &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.street2}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="city" className="form-label fw-500 fs-1p0 dark-gray">City</label>
          <input
            type="text"
            id="city"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.city && formik.errors.city && "app-form-error"}`}
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.city && formik.errors.city &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.city}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="state" className="form-label fw-500 fs-1p0 dark-gray">State</label>
          <input
            type="text"
            id="state"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.state && formik.errors.state && "app-form-error"}`}
            value={formik.values.state}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.state && formik.errors.state &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.state}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="zipcode" className="form-label fw-500 fs-1p0 dark-gray">Zip Code</label>
          <input
            type="number"
            id="zipcode"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.zipcode && formik.errors.zipcode && "app-form-error"}`}
            value={formik.values.zipcode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.zipcode && formik.errors.zipcode &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.zipcode}</span>
          }
        </div>
      </div>
    );
  }

  const renderStatus = () => {
    return (
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="urentme_fee" className="form-label fw-500 fs-1p0 dark-gray">URentMe Fee *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="text"
              id="urentme_fee"
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.urentme_fee && formik.errors.urentme_fee && "app-form-error"}`}
              value={formik.values.urentme_fee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={loading || isView}
            />
          </div>
          {formik.touched.urentme_fee && formik.errors.urentme_fee &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.urentme_fee}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="status" className="form-label fw-400 fs-1p0 dark-gray">Status *</label>
          <select
            id="status"
            value={formik.values.status}
            disabled={loading || isView}
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
      </div>
    );
  }

  const renderViewOptions = () => {
    return (
      <div className="row">
        <div className="col-md-4 mt-3">
          <label className="fw-400 fs-1p0 dark-gray me-3">Status:</label>
          <span
            className="fw-400 fs-0p75 white border-12 px-3 py-1"
            style={{
              backgroundColor: (+itemData?.status) === 1 ? "#5cb85c" : "#f0ad4e",
            }}
          >{itemData?.status === 1 ? "Active" : "Deactive"}</span>
        </div>
        <div className="col-md-4 mt-3">
          <label className="fw-400 fs-1p0 dark-gray me-3">Created:</label>
          <span className="fw-400 fs-1p0 oxford-blue">{itemData?.created ? moment(itemData.created).format(Constant.DATE_FORMAT) : ''}</span>
        </div>
        <div className="col-md-4 mt-3">
          <label className="fw-400 fs-1p0 dark-gray me-3">Modified:</label>
          <span className="fw-400 fs-1p0 oxford-blue">{itemData?.modified ? moment(itemData.modified).format(Constant.DATE_FORMAT) : ''}</span>
        </div>
      </div>
    );
  }

  const renderAddOptions = () => {
    return (
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="username" className="form-label fw-500 fs-1p0 dark-gray">Username *</label>
          <input
            type="text"
            id="username"
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.username && formik.errors.username && "app-form-error"}`}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={loading || isView}
          />
          {formik.touched.username && formik.errors.username &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.username}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
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
      </div>
    );
  }

  return (
    <div className="container-fluid position-relative px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Member Management</h2>
      </div>
      <div className="d-flex align-items-center gap-2 my-3">
        <Link to="/admin/users">
          <IoArrowBack className="fs-1p25 midnight" />
        </Link>
        <span className="fw-500 fs-1p125 midnight">User {isView ? "Detail" : isAdd ? "Add" : "Edit"}</span>
      </div>
      <div className="app-container">
        <form onSubmit={formik.handleSubmit}>
          {renderAvatar()}
          {renderUserInfo()}
          {renderLocation()}
          {isView ? renderViewOptions() : isAdd ? renderAddOptions() : renderStatus()}
          <div className="d-flex align-items-center gap-3 my-4">
            {!isView &&
            <button
              type="submit"
              className="btn btn-app-primary fw-400 fs-1p0 white px-3"
              disabled={loading}
            >Submit</button>
            }
            <button
              type="button"
              className="btn btn-outline-app-primary fw-400 fs-1p0 white px-3"
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

export default AdminEditMember;
