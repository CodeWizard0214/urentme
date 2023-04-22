import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const PaymentExistTab = (props) => {
  const { bankData, onEdit } = props;

  const formik = useFormik({
    initialValues: {
      ach_route: bankData.ach_route ?? '',
      ach_account: bankData.ach_number ?? '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      ach_route: Yup.string().required('Required'),
      ach_account: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      onEdit();
    },
  });

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
              disabled={true}
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
              disabled={true}
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

  return (
    <form onSubmit={formik.handleSubmit} className="container px-4 mt-4">
      <div className="fw-400 fs-1p25 black">You are already connected</div>
      {renderBankSection()}
      <button
        type="submit"
        className="btn btn-app-primary fw-400 fs-1p0 white px-5 py-2 my-4"
      >Edit</button>
    </form>
  );
};

export default PaymentExistTab;
