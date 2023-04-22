import React, { useState, useEffect } from 'react';
import moment from 'moment';

import TableInstance from '../../../components/table/TableInstance';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'user', label: 'User', width: "10%", search: true, sort: true },
  { id: 'item_name', label: 'Item Name', width: "25%", search: true, sort: true },
  { id: 'transaction_id', label: 'transaction_id', width: "20%", search: true, sort: true },
  { id: 'type', label: 'Particulars', width: "10%", search: true, sort: true },
  { id: 'amount', label: 'Amount', width: "10%", search: true, sort: true },
  { id: 'status', label: 'Status', width: "5%", search: true, sort: true },
  { id: 'is_test_booking', label: 'Is Test Booking?', width: "15%", search: true, sort: true },
  { id: 'modified', label: 'Modified', width: "5%", search: true, sort: true, order: false },
];

const AdminTransactions = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllTransactions().then(data => {
      if (isMounted) {
        setTableData(data.map(row => ({
          id: row.id,
          user: row.first_name,
          item_name: row.item_name,
          transaction_id: row.transaction_id,
          type: row.type,
          amount: `$ ${row.amount}`,
          status: getStatusText(+row.status),
          is_test_booking: row.is_test_booking === 'Y' ? 'Yes' : 'No',
          modified: moment(row.modified).format(Constant.DATE_TIME_FORMAT),
        })));
        setLoading(false);
      }
    }).catch(e => {
      setLoading(false);
      setMessage('Network Error');
    });
    return () => { isMounted = false; };
  }, []);

  const getStatusText = (status) => {
    return status === 0 ? 'Unpaid' :
      status === 1 ? 'Paid' :
      status === 2 || status === 3 ? 'Cancel' : '';
  }

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Transaction List</h2>
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

export default AdminTransactions;
