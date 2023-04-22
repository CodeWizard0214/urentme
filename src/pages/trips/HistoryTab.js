import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import styles from './HistoryTab.module.css';

const TripsHistory = React.lazy(() => import('./TripsHistory'));

const HistoryTab = (props) => {
  return (
    <Tabs selectedTabClassName={styles.tabSelected}>
      <div className="container">
        <TabList className={styles.tabList}>
          <Tab className={`${styles.tabNormal} ${styles.leftTab}`}>Accepted</Tab>
          <Tab className={`${styles.tabNormal} ${styles.rightTab}`}>Denied</Tab>
        </TabList>
      </div>
      <div id="trips-history-layout" className="trips-history-height list-scrollbar position-relative">
        <TabPanel>
          <TripsHistory histories={props.accepted} />
        </TabPanel>
        <TabPanel>
          <TripsHistory histories={props.denied} />
        </TabPanel>
      </div>
    </Tabs>
  );
};

export default HistoryTab;