import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import * as Constant from '../../../constants/constant';
import styles from "./AdminLogin.module.css";
import AppSpinner from "../../../components/loading/AppSpinner";
import * as APIHandler from "../../../apis/APIHandler";
import LOGO_IMAGE from "../../../assets/images/logo.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      setLoading(true);
      var sha1 = require('sha1');
      const hashPwd = sha1(Constant.HASHKEY + values.password);
      const json = { email: values.email, password: hashPwd };
      APIHandler.adminLogin(json).then((data) => {
        setLoading(false);
        if (data.result === "true") {
          sessionStorage.setItem(Constant.CURRENT_ADMIN_USER, values.email);
          navigate('/admin/dashboard');
        } else {
          toast.error("Invaild Email or Password!");
        }
      });
    },
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1>Admin Login</h1>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <input
            type="text"
            id="email"
            placeholder="Enter Email"
            className={`${styles.input} ${
              formik.touched.email && formik.errors.email && "app-form-error"
            }`}
            value={formik.values.email}
            disabled={loading}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="m-auto w-90">
              <span className="float-left fw-300 fs-0p75 red-orange ">
                {formik.errors.email}
              </span>
            </div>
          )}
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            className={`mt-3 ${styles.input} ${
              formik.touched.password &&
              formik.errors.password &&
              "app-form-error"
            }`}
            value={formik.values.password}
            disabled={loading}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <div className="m-auto w-90">
              <span className="float-left fw-300 fs-0p75 red-orange">
                {formik.errors.password}
              </span>
            </div>
          )}
          <button type="submit" id="login-button" disabled={loading} className={`mt-3 ${styles.button}`}>
            Login
          </button>
          {loading && <AppSpinner color="#8692a6" absolute />}
        </form>
        <div>
          <img src={LOGO_IMAGE} alt="logo" />
          <p>©URentMe All Rights Reserved. URentMe</p>
        </div>
      </div>
      <ul className={styles.bubbles}>
        <li className={styles.animation}></li>
        <li className={styles.animation}></li>
        <li className={styles.animation}></li>
        <li className={styles.animation}></li>
        <li className={styles.animation}></li>
        <li className={styles.animation}></li>
        <li className={styles.animation}></li>
        <li className={styles.animation}></li>
        <li className={styles.animation}></li>
        <li className={styles.animation}></li>
      </ul>
    </div>
  );
};

export default AdminLogin;
