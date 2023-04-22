import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import AvatarSection from './AvatarSection';
import DriverLicenseSection from './DriverLicenseSection';
import VerifyPhoneModal from './VerifyPhoneModal';
import AppSpinner from '../../components/loading/AppSpinner';
import { getUserInfo } from '../../store/actions/userActions';
import { getUserDocuments } from '../../store/actions/documentActions';
import { getUserAvatar } from '../../utils/imageUrl';
import * as APIHandler from '../../apis/APIHandler';
import * as Color from '../../constants/color';

const AccountScreen = (props) => {
  const { userInfo, getUserDocuments } = props;
  const [loading, setLoading] = useState(false);
  const [phoneChange, setPhoneChange] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    if (userInfo?.id) {
      getUserDocuments(userInfo.id);
    }
  }, [userInfo, getUserDocuments]);

  const onUpdateAccount = (values) => {
    setLoading(true);
    APIHandler.updateUser(
      userInfo.id,
      values.city,
      values.state,
      values.street,
      values.zipcode,
      values.first_name,
      values.last_name,
      values.email,
      '',
      '',
      '',
      values.about_me,
    ).then(data => {
      if (data.result === 'True') {
        toast.success('Account setting changed successfully');
        props.getUserInfo(userInfo.id);
      } else {
        toast.error('Please try again');
      }
      setLoading(false);
    });
  };

  const onPhoneClick = () => {
    if (phoneChange) {
      if (formik.values.phone) {
        setLoading(true);
        APIHandler.requestPhoneVerify(userInfo.id, formik.values.phone).then(data => {
          setLoading(false);
          if (data.verification_code) {
            setSessionId(data.session_id);
            setVerifyModal(true);
          } else {
            toast.error('Please try again');
          }
        });
      } else {
        formik.errors.phone = 'Required';
      }
    } else {
      setPhoneChange(true);
    }
  };

  const onVerified = () => {
    setVerifyModal(false);
    setPhoneChange(false);
  }

  const formik = useFormik({
    initialValues: {
      email: userInfo.email ?? '',
      first_name: userInfo.first_name ?? '',
      last_name: userInfo.last_name ?? '',
      about_me: userInfo.about_me ?? '',
      street: userInfo.street1 ?? '',
      city: userInfo.city ?? '',
      state: userInfo.state ?? '',
      zipcode: userInfo.zipcode ?? '',
      phone: userInfo.mobile ?? '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      first_name: Yup.string().required('Required'),
      last_name: Yup.string().required('Required'),
      street: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      zipcode: Yup.number().required('Required'),
      // phone: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      onUpdateAccount(values);
    },
  });

  const renderPersonalSettings = () => {
    return (
      <>
        <div className="fw-600 fs-1p125 black">Personal Settings</div>
        <div className="row">
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="first_name" className="form-label fw-500 fs-1p0 dark-gray">First Name *</label>
            <input
              id="first_name"
              type="text"
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.first_name && formik.errors.first_name && "app-form-error"}`}
              value={formik.values.first_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.first_name && formik.errors.first_name &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.first_name}</span>
            }
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="last_name" className="form-label fw-500 fs-1p0 dark-gray">Last Name *</label>
            <input
              id="last_name"
              type="text"
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.last_name && formik.errors.last_name && "app-form-error"}`}
              value={formik.values.last_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.last_name && formik.errors.last_name &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.last_name}</span>
            }
          </div>
          <div className="col-md-6">
            <div className="form-group mt-3">
              <label htmlFor="email" className="form-label fw-500 fs-1p0 dark-gray">Email *</label>
              <input
                id="email"
                type="email"
                disabled={loading}
                placeholder=""
                className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.email && formik.errors.email && "app-form-error"}`}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email &&
                <span className="fw-300 fs-0p75 red-orange">{formik.errors.email}</span>
              }
            </div>
            <div className="form-group mt-3">
              <div className="d-flex justify-content-between">
                <label htmlFor="phone" className="form-label fw-500 fs-1p0 dark-gray">Phone *</label>
                {userInfo.mobile_verify === 1 && <span className="fw-400 fs-0p875 ms-3" style={{ color: Color.GREEN_COLOR }}>Verified</span>}
              </div>
              <div className="input-group">
                <span className="input-group-text">+1</span>
                <input
                  id="phone"
                  type="text"
                  readOnly={!phoneChange || loading}
                  placeholder=""
                  className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.errors.phone && "app-form-error"}`}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="btn btn-outline-app-primary fw-400 fs-0p875 px-2 px-lg-3 px-xl-4"
                  disabled={loading}
                  onClick={onPhoneClick}
                >{phoneChange ? "Verify" : "Change"}</button>
              </div>
              {formik.errors.phone &&
                <span className="fw-300 fs-0p75 red-orange">{formik.errors.phone}</span>
              }
              <div className="fw-400 fs-0p875 gray-36 mt-2">URentMe will only use this to notify you about your booking updates</div>
            </div>
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="about_me" className="form-label fw-500 fs-1p0 dark-gray">About Me</label>
            <textarea
              id="about_me"
              row="4"
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.about_me && formik.errors.about_me && "app-form-error"}`}
              style={{ height: "130px"}}
              value={formik.values.about_me}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            { formik.touched.about_me && formik.errors.about_me &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.about_me}</span>
            }
          </div>
        </div>
      </>
    );
  };

  const renderBillingAdress = () => {
    return (
      <div className="mt-4">
        <div className="fw-600 fs-1p125 black">Billing Address</div>
        <div className="row">
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="street" className="form-label fw-500 fs-1p0 dark-gray">Street *</label>
            <input
              id="street"
              type="text"
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.street && formik.errors.street && "app-form-error"}`}
              value={formik.values.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.street && formik.errors.street &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.street}</span>
            }
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="city" className="form-label fw-500 fs-1p0 dark-gray">City *</label>
            <input
              id="city"
              type="text"
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.city && formik.errors.city && "app-form-error"}`}
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.city && formik.errors.city &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.city}</span>
            }
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="state" className="form-label fw-500 fs-1p0 dark-gray">State *</label>
            <input
              id="state"
              type="text"
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.state && formik.errors.state && "app-form-error"}`}
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.state && formik.errors.state &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.state}</span>
            }
          </div>
          <div className="form-group col-md-6 mt-3">
            <label htmlFor="zipcode" className="form-label fw-500 fs-1p0 dark-gray">Zip Code *</label>
            <input
              id="zipcode"
              type="text"
              maxLength={5}
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.zipcode && formik.errors.zipcode && "app-form-error"}`}
              value={formik.values.zipcode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.zipcode && formik.errors.zipcode &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.zipcode}</span>
            }
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} className="container">
      <div className="row mx-3 my-4">
        <div className="col-lg-8">
          {renderPersonalSettings()}
          {renderBillingAdress()}
          <button
            type="submit"
            className="btn btn-app-primary fw-400 fs-1p0 white px-5 py-2 mt-4 mb-lg-4"
            disabled={loading}
          >Save</button>
        </div>
        <div className="col-lg-4 my-3 mt-lg-5">
          <AvatarSection
            userId={userInfo.id}
            src={userInfo.img ? getUserAvatar(userInfo.img) : ''}
            error={!userInfo.img}
          />
          <DriverLicenseSection userId={userInfo.id} className="mt-4" />
        </div>
      </div>
      {loading && <AppSpinner absolute />}
      <VerifyPhoneModal
        open={verifyModal}
        onClose={() => setVerifyModal(false)}
        onVerified={onVerified}
        userId={userInfo.id}
        phone={formik.values.phone}
        sessionId={sessionId}
      />
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps, { getUserInfo, getUserDocuments })(AccountScreen);
