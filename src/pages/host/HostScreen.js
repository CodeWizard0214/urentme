import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { toast } from 'react-toastify';

import styles from './HostScreen.module.css';

const MyVehicles = React.lazy(() => import('./MyVehicles'));
const ReviewsScreen = React.lazy(() => import('./ReviewsScreen'));

const HostScreen = (props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userVerified } = props;
  const [tabIndex, setTabIndex] = useState(pathname.endsWith('reviews') ? 1 : 0);

  const onAddItem = () => {
    if (userVerified) {
      navigate('/host/add');
    } else {
      toast.warn('Please verify your phone number and driver license in account profile first');
    }
  };

  return (
    <Tabs
      selectedIndex={tabIndex}
      onSelect={setTabIndex}
      selectedTabClassName="app-tab-selected"
    >
      <div className="container position-relative mt-2">
        <TabList className="app-tab-list">
          <Tab className="app-tab-normal">My Vehicles</Tab>
          <Tab className="app-tab-normal">Reviews</Tab>
        </TabList>
        <div className={`${styles.addButton} ${tabIndex === 1 ? "d-none" : ""}`}>
          <button type="button" className="btn btn-app-primary fw-400 fs-1p0 white px-4 py-2 me-4" onClick={onAddItem}>
            Add New Listing
          </button>
        </div>
      </div>
      <div id="hosts-content-layout" className="app-panel-height list-scrollbar position-relative">
        <TabPanel>
          <MyVehicles />
        </TabPanel>
        <TabPanel>
          <ReviewsScreen />
        </TabPanel>
      </div>
    </Tabs>
  );
};

const mapStateToProps = (state) => {
  return {
    userVerified: state.userVerified,
  };
};

export default connect(mapStateToProps)(HostScreen);
