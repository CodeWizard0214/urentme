import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import useInterval from 'use-interval';
  
import 'bootstrap/dist/css/bootstrap.min.css';
import AppLayout from "./layouts/AppLayout";
import NotFound from './pages/error/NotFound';
import { frontRoutes, innerRoutes, adminRoutes } from './routes/routes';
import * as Constant from './constants/constant';
import {
  getAllItems,
  getItemCourtesies,
  getItemFeatures,
  getItemImages,
  getWishItems,
  getUserItems,
} from './store/actions/itemActions';
import { setUserId, getUserInfo, setUserVerified, setLicenseVerified } from './store/actions/userActions';
import { getUserMessages } from './store/actions/messageActions';
import { getPendingTrips, getPendingBookings } from './store/actions/bookingActions';
import { getUserDocuments } from './store/actions/documentActions';

const App = (props) => {
  const routes = [...frontRoutes, ...innerRoutes, ...adminRoutes];
  const { getAllItems, getItemImages, getItemFeatures, getItemCourtesies,
    userId, setUserId, getUserInfo, getWishItems, getUserItems,
    getUserMessages, getPendingTrips, getPendingBookings, getUserDocuments,
    userInfo, docs, setUserVerified, setLicenseVerified,
  } = props;
  const [currentUser, setCurrentUser] = useState('');
  const MESSAGE_INTERVAL = 10000;

  useEffect(() => {
    getAllItems();
  }, [getAllItems]);

  useEffect(() => {
    getItemImages();
  }, [getItemImages]);

  useEffect(() => {
    getItemFeatures();
  }, [getItemFeatures]);

  useEffect(() => {
    getItemCourtesies();
  }, [getItemCourtesies]);

  useEffect(() => {
    const remembered = localStorage.getItem(Constant.GLOBAL_USER);
    if (remembered) {
      setCurrentUser(remembered);
    } else {
      setCurrentUser(sessionStorage.getItem(Constant.CURRENT_USER));
    }
  }, []);

  useEffect(() => {
    setUserId(currentUser);
  }, [currentUser, setUserId]);

  useEffect(() => {
    if (userId) {
      getUserInfo(userId);
      getWishItems(userId);
      getUserItems(userId);
      getUserMessages(userId);
      getPendingTrips(userId);
      getPendingBookings(userId);
      getUserDocuments(userId);
    }
  }, [userId, getUserInfo, getWishItems, getUserItems, getUserMessages,
    getPendingTrips, getPendingBookings, getUserDocuments]);

  useEffect(() => {
    if (userId && Object.keys(userInfo).length !== 0 && docs.length >= 2) {
      const front = docs.slice().reverse().find(data => data.type === Constant.LICENSE_TYPE_FRONT);
      const back = docs.slice().reverse().find(data => data.type === Constant.LICENSE_TYPE_BACK);
      var licenseStatus = Constant.LICENSE_STATUS_NONE;
      if (front && back) {
        // if (front.status === Constant.LICENSE_STATUS_VERIFIED && back.status === Constant.LICENSE_STATUS_VERIFIED) {
        //   licenseStatus = Constant.LICENSE_STATUS_VERIFIED;
        // } else if (front.status === Constant.LICENSE_STATUS_REJECTED || back.status === Constant.LICENSE_STATUS_REJECTED) {
        //   licenseStatus = Constant.LICENSE_STATUS_REJECTED;
        // } else {
        //   licenseStatus = Constant.LICENSE_STATUS_PENDING;
        // }
        licenseStatus = front.status;
      }
      setLicenseVerified(licenseStatus);
      setUserVerified(userInfo.img && userInfo.mobile_verify === 1 && licenseStatus === Constant.LICENSE_STATUS_VERIFIED);
    } else {
      setLicenseVerified(Constant.LICENSE_STATUS_NONE);
      setUserVerified(false);
    }
  }, [userId, userInfo, docs, setLicenseVerified, setUserVerified]);

  useInterval(() => {
    if (userId) {
      getUserMessages(userId);
    }
  }, userId ? MESSAGE_INTERVAL : null);

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {routes.map((route, idx) => (
            route.component && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact??false}
                name={route.name}
                element={<route.component />}
              />
            )
          ))}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
    userInfo: state.userInfo,
    docs: state.documents,
  };
};

export default connect(
  mapStateToProps,
  {
    getAllItems,
    getItemImages,
    getItemFeatures,
    getItemCourtesies,
    setUserId,
    setUserVerified,
    setLicenseVerified,
    getUserInfo,
    getWishItems,
    getUserItems,
    getUserMessages,
    getPendingTrips,
    getPendingBookings,
    getUserDocuments,
  }
)(App);
