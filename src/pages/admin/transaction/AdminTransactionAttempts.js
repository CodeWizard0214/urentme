import React, { useState, useEffect } from 'react';
import moment from 'moment';

import TableInstance from '../../../components/table/TableInstance';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'user', label: 'User', search: true, sort: true },
  { id: 'owner', label: 'Owner', search: true, sort: true },
  { id: 'ip', label: 'IP', search: true, sort: true },
  { id: 'country', label: 'Country', search: true, sort: true },
  { id: 'rent_amount', label: 'Rent Amount', search: true, sort: true },
  { id: 'security_deposit', label: 'Security Deposit', search: true, sort: true },
  { id: 'rent_response', label: 'Rent Response', search: true, sort: true },
  { id: 'deposit_response', label: 'Deposit Response', search: true, sort: true },
  { id: 'rent_success', label: 'Rent Successful', search: true, sort: true },
  { id: 'deposit_success', label: 'Deposit Successful', search: true, sort: true },
  { id: 'modified', label: 'Update Time', search: true, sort: true, order: false },
  { id: 'created', label: 'Create Time', search: true, sort: true },
];

const AdminTransactionAttempts = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllTransactionAttempts().then(data => {
      if (isMounted) {
        setTableData(data.map(row => ({
          id: row.id,
          user: row.user,
          owner: row.owner,
          ip: row.ip,
          country: row.country,
          rent_amount: `$ ${row.rent_amount}`,
          security_deposit: `$ ${row.security_deposit}`,
          rent_response: row.rent_response,
          deposit_response: row.deposit_response,
          rent_success: row.rent_success,
          deposit_success: row.deposit_success,
          modified: moment(row.modified).format(Constant.DATE_TIME_FORMAT),
          created: moment(row.created).format(Constant.DATE_TIME_FORMAT),
        })));
        setLoading(false);
      }
    }).catch(e => {
      setLoading(false);
      setMessage('Network Error');
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Transaction Attempt List</h2>
      </div>
      <TableInstance
        headLabels={TABLE_HEAD}
        tableData={tableData}
        firstColType={Constant.TABLE_FIRST_COL_NUM}
        loading={loading}
        message={message}
        className="mt-4"
      />
    </div>
  );
};

export default AdminTransactionAttempts;
