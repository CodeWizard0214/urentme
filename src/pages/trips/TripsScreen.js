import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import * as Constant from '../../constants/constant';

const BookingNotifications = React.lazy(() => import('./BookingNotifications'));
const TripsPending = React.lazy(() => import('./TripsPending'));
const HistoryTab = React.lazy(() => import('./HistoryTab'));

const TripsScreen = (props) => {
  const { pathname } = useLocation();
  const { pendingTrips } = props;
  const [pendings, setPendings] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [denied, setDenied] = useState([]);
  const [tabIndex, setTabIndex] = useState(pathname.endsWith('pending') ? 1 : 0);

  useEffect(() => {
    let pendingList = pendingTrips.filter(
      (e) => [Constant.STATUS_PICKUP, Constant.STATUS_RECEIVED].includes(e.status)
      || (e.status === Constant.STATUS_COMPLETED && e.is_renter_give_review !== 1));
    pendingList.sort((a, b) => b.status - a.status);
    pendingList.sort((a, b) => b.is_owner_receivable_sent - a.is_owner_receivable_sent);
    pendingList.sort((a, b) => moment(b.created) - moment(a.created));
    setPendings(pendingList);

    let accepts = pendingTrips.filter((e) => e.status === Constant.STATUS_COMPLETED);
    accepts.sort((a, b) => moment(b.created) - moment(a.created));
    setAccepted(accepts);

    let denies = pendingTrips.filter((e) => [Constant.STATUS_CANCELLED, Constant.STATUS_DISPUTED].includes(e.status));
    denies.sort((a, b) => moment(b.created) - moment(a.created));
    setDenied(denies);
  }, [pendingTrips]);

  return (
    <Tabs
      selectedIndex={tabIndex}
      onSelect={setTabIndex}
      selectedTabClassName="app-tab-selected"
    >
      <div className="container mt-2">
        <TabList className="app-tab-list">
          <Tab className="app-tab-normal">Notifications</Tab>
          <Tab className="app-tab-normal">Pending</Tab>
          <Tab className="app-tab-normal">History</Tab>
        </TabList>
      </div>
      <TabPanel>
        <div id="trips-notification-layout" className="app-panel-height list-scrollbar position-relative">
          <BookingNotifications />
        </div>
      </TabPanel>
      <TabPanel>
        <div id="trips-pending-layout" className="app-panel-height list-scrollbar position-relative">
          <TripsPending pendings={pendings} />
        </div>
      </TabPanel>
      <TabPanel>
        <HistoryTab accepted={accepted} denied={denied} />
      </TabPanel>
    </Tabs>
  );
};

const mapStateToProps = state => {
  return {
    pendingTrips: state.pendingTrips,
  }
}

export default connect(mapStateToProps)(TripsScreen);