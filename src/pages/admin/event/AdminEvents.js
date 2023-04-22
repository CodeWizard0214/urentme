import React, { useState, useEffect } from 'react';
import moment from 'moment';

import TableInstance from '../../../components/table/TableInstance';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'title', label: 'Title', search: true, sort: true },
  { id: 'location', label: 'location', search: true, sort: true },
  { id: 'status', label: 'Status', search: true, sort: true },
  { id: 'startdate', label: 'Start Date', search: true, sort: true },
  { id: 'enddate', label: 'End Date', search: true, sort: true },
  { id: 'action', label: 'Action' }
];

const AdminReferrals = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllEvents().then(data => {
      if (isMounted) {
        setTableData(data.map(row => ({
          id: row.id,
          title: row.title,
          location: row.location,
          status: (+row.status) === 1 ? 'Active' : 'Deactive',
          startdate: moment(row.startdate).format(Constant.DATE_FORMAT),
          enddate: moment(row.enddate).format(Constant.DATE_FORMAT),
        })));
        setLoading(false);
      }
    }).catch(e => {
      setLoading(false);
      setMessage('Network Error');
    });
    return () => { isMounted = false; };
  }, []);

  const ROW_MENUS = [
    { icon: 'view', label: 'View' },
    { icon: 'edit', label: 'Edit' },
    { icon: 'delete', label: 'Delete' },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Event Management</h2>
      </div>
      <TableInstance
        headLabels={TABLE_HEAD}
        tableData={tableData}
        menus={ROW_MENUS}
        loading={loading}
        message={message}
        className="mt-4"
      />
    </div>
  );
};

export default AdminReferrals;
