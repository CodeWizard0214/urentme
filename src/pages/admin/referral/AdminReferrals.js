import React, { useState, useEffect } from 'react';
import moment from 'moment';

import TableInstance from '../../../components/table/TableInstance';
import { getMemberAvatar } from '../../../utils/imageUrl';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'avatar', label: 'Profile Image', width: '5%' },
  { id: 'name', label: 'Name', width: '15%', search: true, sort: true },
  { id: 'mobile', label: 'Mobile', width: '10%', search: true, sort: true },
  { id: 'username', label: 'Username', width: '15%', search: true, sort: true },
  { id: 'email', label: 'Email', width: '20%', search: true, sort: true },
  { id: 'points', label: 'AIP Commissions', width: '15%', search: true, sort: true },
  { id: 'status', label: 'Status', width: '10%', search: true, sort: true },
  { id: 'created', label: 'Created', width: '5%', search: true, sort: true, order: false },
  { id: 'action', label: 'Action', width: '5%' }
];

const AdminReferrals = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllReferrals().then(data => {
      if (isMounted) {
        setTableData(data.map(row => ({
          id: row.id,
          avatar: getMemberAvatar(row.profile_image),
          name: `${row.first_name} ${row.last_name}`,
          mobile: row.mobile,
          username: row.username,
          email: row.email,
          points: +row.points,
          status: (+row.status) === 1 ? 'Active' : 'Deactive',
          created: moment(row.created).format(Constant.DATE_FORMAT),
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
    { icon: 'bank', label: 'Bank Details' },
    { icon: 'view', label: 'Details' },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Referrals Management</h2>
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
