import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { toast } from 'react-toastify';

import AppSpinner from '../../components/loading/AppSpinner';
import * as APIHandler from '../../apis/APIHandler';

const PaymentInputTab = (props) => {
  const { userInfo, bankData, isBusiness } = props;
  const [ssnType, setSsnType] = useState(0);
  const [loading, setLoading] = useState(false);

  const onSave = (values) => {
    const last4num = ssnType === 0 ? ("" + values.ssn) : ("" + values.ssn).slice(-4);
    setLoading(true);
    APIHandler.updateBankAccount(
      userInfo.id,
      values.city,
      values.state,
      values.street,
      '' + values.zipcode,
      values.first_name,
      values.last_name,
      values.email,
      '' + values.phone,
      '',
      last4num,
      values.ach_route,
      values.ach_account,
      moment(values.birthday).date(),
      moment(values.birthday).month() + 1,
      moment(values.birthday).year(),
    ).then(data => {
      if (data.result === true) {
        toast.success('Payment successed');
        if (props.onUpdate) {
          props.onUpdate(true);
        }
      } else {
        toast.error(data.result);
      }
      setLoading(false);
    });
  }

  const formik = useFormik({
    initialValues: {
      first_name: userInfo.first_name ?? '',
      last_name: userInfo.last_name ?? '',
      email: userInfo.email ?? '',
      phone: userInfo.mobile ?? '',
      birthday: '',
      street: userInfo.street1 ?? '',
      city: userInfo.city ?? '',
      state: userInfo.state ?? '',
      zipcode: userInfo.zipcode ?? '',
      ssn: '',
      ach_route: bankData.ach_route ?? '',
      ach_account: bankData.ach_number ?? '',
      business_name: '',
      business_id: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      first_name: Yup.string().required('Required'),
      last_name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      phone: Yup.number().required('Required'),
      birthday: Yup.string().required('Required'),
      street: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      zipcode: Yup.number().required('Required'),
      ssn: Yup.number().required('Required'),
      ach_route: Yup.string().required('Required'),
      ach_account: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      onSave(values);
    },
  });

  const renderAccountSection = () => {
    return (
      <>
        <div className="fw-600 fs-1p125 black">Account Details</div>
        <div className="row">
          <div className="form-group col-md-6 col-lg-4 mt-3">
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
          <div className="form-group col-md-6 col-lg-4 mt-3">
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
          <div className="form-group col-md-6 col-lg-4 mt-3">
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
          <div className="form-group col-md-6 col-lg-4 mt-3">
            <label htmlFor="phone" className="form-label fw-500 fs-1p0 dark-gray">Phone *</label>
            <input
              id="phone"
              type="number"
              maxLength={10}
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.phone && formik.errors.phone && "app-form-error"}`}
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.phone}</span>
            }
          </div>
          <div className="form-group col-md-6 col-lg-4 mt-3">
            <label htmlFor="birthday" className="form-label fw-500 fs-1p0 dark-gray">Date of birth *</label>
            <input
              id="birthday"
              type="date"
              disabled={loading}
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.birthday && formik.errors.birthday && "app-form-error"}`}
              value={formik.values.birthday}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.birthday && formik.errors.birthday &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.birthday}</span>
            }
          </div>
        </div>
      </>
    );
  };

  const renderAddressSection = () => {
    const onChangeSsnType = (e) => {
      setSsnType(+e.currentTarget.value);
    }

    return (
      <div className="mt-4">
        <div className="fw-600 fs-1p125 black">Address Details</div>
        <div className="row">
          <div className="form-group col-md-6 col-lg-4 mt-3">
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
          <div className="form-group col-md-6 col-lg-4 mt-3">
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
          <div className="form-group col-md-6 col-lg-4 mt-3">
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
          <div className="form-group col-md-6 col-lg-4 mt-3">
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
          <div className="form-group col-md-6 col-lg-4 mt-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="form-check">
                <input
                  type="radio"
                  name="ssn_type"
                  id="ssn_last_4"
                  value="0"
                  className="form-check-input app-form-check"
                  onChange={onChangeSsnType}
                  checked={ssnType === 0}
                />
                <label className="form-label fw-500 fs-1p0 dark-gray" htmlFor="ssn_last_4">SSN Last 4</label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  name="ssn_type"
                  id="ssn_full_no"
                  value="1"
                  className="form-check-input app-form-check"
                  onChange={onChangeSsnType}
                  checked={ssnType === 1}
                />
                <label className="form-label fw-500 fs-1p0 dark-gray" htmlFor="ssn_full_no">SSN Full No</label>
              </div>
            </div>
            <input
              id="ssn"
              type="text"
              maxLength={ssnType === 0 ? 4 : 9}
              disabled={loading}
              placeholder={ssnType === 0 ? "Last 4 numbers" : "Full numbers"}
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.ssn && formik.errors.ssn && "app-form-error"}`}
              value={formik.values.ssn}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ssn && formik.errors.ssn &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.ssn}</span>
            }
          </div>
        </div>
      </div>
    );
  };

  const renderBankSection = () => {
    return (
      <div className="mt-4">
        <div className="fw-600 fs-1p125 black">Bank Details</div>
        <div className="fw-400 fs-0p875 gray-36 mt-2">The account you provide must be a checking account. If you'd like to accept currencies other than USD, you must have a bank account set up to be able to accept each currency.</div>
        <div className="row">
          <div className="form-group col-md-6 col-lg-4 mt-3">
            <label htmlFor="ach_route" className="form-label fw-500 fs-1p0 dark-gray">Routing Number *</label>
            <input
              id="ach_route"
              type="text"
              maxLength={9}
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.ach_route && formik.errors.ach_route && "app-form-error"}`}
              value={formik.values.ach_route}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ach_route && formik.errors.ach_route &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.ach_route}</span>
            }
          </div>
          <div className="form-group col-md-6 col-lg-4 mt-3">
            <label htmlFor="ach_account" className="form-label fw-500 fs-1p0 dark-gray">Account Number *</label>
            <input
              id="ach_account"
              type="text"
              maxLength={12}
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.ach_account && formik.errors.ach_account && "app-form-error"}`}
              value={formik.values.ach_account}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.ach_account && formik.errors.ach_account &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.ach_account}</span>
            }
          </div>
        </div>
      </div>
    );
  };

  const renderBusinessSection = () => {
    return (
      <div className="mb-4">
        <div className="fw-600 fs-1p125 black">Stripe Business Details</div>
        <div className="row">
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="business_name" className="form-label fw-500 fs-1p0 dark-gray">Business Name</label>
            <input
              id="business_name"
              type="text"
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.business_name && formik.errors.business_name && "app-form-error"}`}
              value={formik.values.business_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.business_name && formik.errors.business_name &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.business_name}</span>
            }
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="business_id" className="form-label fw-500 fs-1p0 dark-gray">Business Tax ID</label>
            <input
              id="business_id"
              type="text"
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.business_id && formik.errors.business_id && "app-form-error"}`}
              value={formik.values.business_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.business_id && formik.errors.business_id &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.business_id}</span>
            }
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={formik.handleSubmit} className="container px-4 my-4">
      {isBusiness && renderBusinessSection()}
      {renderAccountSection()}
      {renderAddressSection()}
      {renderBankSection()}
      <button
        type="submit"
        className="btn btn-app-primary fw-400 fs-1p0 white px-5 py-2 my-4"
        disabled={loading}
      >Save</button>
      {loading && <AppSpinner absolute />}
    </form>
  );
};

export default PaymentInputTab;
