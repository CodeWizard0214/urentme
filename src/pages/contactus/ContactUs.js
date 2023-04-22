import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import AppSpinner from '../../components/loading/AppSpinner';
import MapSection from '../../components/map/MapSection';
import * as APIHandler from '../../apis/APIHandler';
import styles from './ContactUs.module.css';

const ContactUs = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      comment: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      mobile: Yup.number().required('Required'),
      comment: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      const { firstName, lastName, email, mobile, comment } = values;
      setLoading(true);
      APIHandler.sendContactMail(firstName, lastName, email, '+1', mobile, comment).then(data => {
        setLoading(false);
        if (data.type === 'success') {
          toast.success(data.msg);
        } else {
          toast.error('Please try again');
        }
      });
    }
  });

  return (
    <div className="container position-relative">
      <div className="fw-600 fs-1p5 midnight py-4">Contact us</div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-lg-6 d-flex flex-1-1 order-1 order-lg-2">
            <div className={styles.mapContainer}>
              <MapSection
                initialCenter={{ lat: 36.114647, lng: -115.172813 }}
                zoom={10}
                items={[{ latitude: 36.114647, longitude: -115.172813 }]}
                logoMarker={true}
              />
            </div>
          </div>
          <div className="col-lg-6 mt-4 mt-lg-0 order-2 order-lg-1">
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="firstName" className="form-label fw-500 fs-1p0 dark-gray">FirstName *</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                  className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.firstName && formik.errors.firstName && "app-form-error"}`}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.firstName && formik.errors.firstName &&
                  <span className="fw-300 fs-0p75 red-orange">{formik.errors.firstName}</span>
                }
              </div>
              <div className="form-group col-md-6 mt-3 mt-md-0">
                <label htmlFor="lastName" className="form-label fw-500 fs-1p0 dark-gray">LastName *</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  required
                  className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.lastName && formik.errors.lastName && "app-form-error"}`}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.lastName && formik.errors.lastName &&
                  <span className="fw-300 fs-0p75 red-orange">{formik.errors.lastName}</span>
                }
              </div>
              <div className="form-group col-md-6 mt-3">
                <label htmlFor="email" className="form-label fw-500 fs-1p0 dark-gray">Email *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.email && formik.errors.email && "app-form-error"}`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.email && formik.errors.email &&
                  <span className="fw-300 fs-0p75 red-orange">{formik.errors.email}</span>
                }
              </div>
              <div className="form-group col-md-6 mt-3">
                <label htmlFor="mobile" className="form-label fw-500 fs-1p0 dark-gray">Mobile *</label>
                <input
                  id="mobile"
                  type="number"
                  placeholder="Mobile"
                  required
                  className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.mobile && formik.errors.mobile && "app-form-error"}`}
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.mobile && formik.errors.mobile &&
                  <span className="fw-300 fs-0p75 red-orange">{formik.errors.mobile}</span>
                }
              </div>
              <div className="form-group mt-3">
                <label htmlFor="comment" className="form-label fw-500 fs-1p0 dark-gray">Comments *</label>
                <textarea
                  id="comment"
                  type="text"
                  placeholder="Comments"
                  rows="7"
                  required
                  className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.comment && formik.errors.comment && "app-form-error"}`}
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={loading}
                />
                {formik.touched.comment && formik.errors.comment &&
                  <span className="fw-300 fs-0p75 red-orange">{formik.errors.comment}</span>
                }
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-app-primary px-4 my-3" disabled={loading}>Submit</button>
      </form>
      {loading && <AppSpinner absolute />}
    </div>
  );
};

export default ContactUs;
