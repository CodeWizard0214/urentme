import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import PaymentInputTab from './PaymentInputTab';
import PaymentExistTab from './PaymentExistTab';
import AppSpinner from '../../components/loading/AppSpinner';
import * as APIHandler from '../../apis/APIHandler';

const PaymentScreen = (props) => {
  const { userInfo } = props;
  const [bankData, setBankData] = useState({});
  const [reload, setReload] = useState(false);
  const [paymentExist, setPaymentExist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.getBankDetails(userInfo.id).then((data) => {
      if (isMounted) {
        setBankData(data);
        setPaymentExist(data.ach_number && data.ach_route);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, [userInfo, reload]);

  const onEdit = () => {
    setPaymentExist(false);
  }

  const onUpdate = () => {
    setReload(!reload);
  }

  return (
    <>
      {loading ? (
        <AppSpinner absolute />
      ) : (paymentExist ? (
        <PaymentExistTab bankData={bankData} onEdit={onEdit} />
      ) : (
        <Tabs selectedTabClassName="app-tab-selected">
          <div className="container mt-2">
            <TabList className="app-tab-list">
              <Tab className="app-tab-normal">Individual account</Tab>
              <Tab className="app-tab-normal">Business account</Tab>
            </TabList>
          </div>
          <div className="app-panel-height list-scrollbar position-relative">
            <TabPanel>
              <PaymentInputTab userInfo={userInfo} bankData={bankData} onUpdate={onUpdate} />
            </TabPanel>
            <TabPanel>
              <PaymentInputTab userInfo={userInfo} bankData={bankData} onUpdate={onUpdate} isBusiness />
            </TabPanel>
          </div>
        </Tabs>
      ))}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
  };
};

export default connect(mapStateToProps)(PaymentScreen);
