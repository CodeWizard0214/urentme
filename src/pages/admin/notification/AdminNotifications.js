import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import TableInstance from '../../../components/table/TableInstance';
import ConfirmModal from '../../../components/modal/ConfirmModal';
import { getIdString } from '../../../utils/stringUtils';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: "10%", search: true, sort: true },
  { id: 'username', label: 'Username', width: "10%", search: true, sort: true },
  { id: 'message', label: 'Message', width: "75%", search: true, sort: true },
  { id: 'created', label: 'Created', width: "3%", search: true, sort: true, order: false },
  { id: 'action', label: 'Action', width: "2%" },
];

const CONFIRM_TYPE_NONE = -1;
const CONFIRM_TYPE_DEL_ONE = 0;
const CONFIRM_TYPE_DELETE = 1;

const AdminNotifications = () => {
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [confirmType, setConfirmType] = useState(CONFIRM_TYPE_NONE);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllNotifications().then(data => {
      if (isMounted) {
        data.sort((a, b) => moment(b.created) - moment(a.created));
        setAllData(data);
        setLoading(false);
      }
    }).catch(e => {
      setLoading(false);
      setMessage('Network Error');
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setTableData(allData.map(row => ({
      id: row.id,
      name: `${row.first_name} ${row.last_name}`,
      username: row.username,
      message: row.message,
      created: moment(row.created).format(Constant.DATE_FORMAT),
    })));
  }, [allData]);

  const onDeleteRecord = (id) => {
    const data = allData.filter(e => e.id === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle('Delete');
      setConfirmText('Are you sure to delete this record?');
      setConfirmType(CONFIRM_TYPE_DEL_ONE);
      setOpenConfirm(true);
    }
  }

  const handleDeleteRecord = () => {
    APIHandler.adminDeleteNotification(`(${rowData.id})`).then(data => {
      if (data.result === 'true') {
        setAllData(allData.filter(row => row.id !== rowData.id));
        toast.success('Record has been deleted successfully');
      } else {
        toast.error('Record has not been deleted');
      }
    });
  }

  const onDeleteRecords = () => {
    setConfirmTitle('Delete');
    setConfirmText('Are you sure to delete selected record(s)?');
    setConfirmType(CONFIRM_TYPE_DELETE);
    setOpenConfirm(true);
  }

  const handleDeleteRecords = () => {
    const ids = getIdString(selected);
    APIHandler.adminDeleteNotification(`(${ids})`).then(data => {
      if (data.result === 'true') {
        setAllData(allData.filter(row => !selected.includes(row.id)));
        toast.success('Record has been deleted successfully');
      } else {
        toast.error('Record has not been deleted');
      }
    });
  }

  const onConfirmModal = () => {
    setOpenConfirm(false);
    if (confirmType === CONFIRM_TYPE_DEL_ONE) {
      handleDeleteRecord();
    } else if (confirmType === CONFIRM_TYPE_DELETE) {
      handleDeleteRecords();
    }
  }

  const ROW_MENUS = [
    { icon: 'delete', label: 'Delete', func: onDeleteRecord },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Notification Management</h2>
      </div>
      <TableInstance
        headLabels={TABLE_HEAD}
        tableData={tableData}
        menus={ROW_MENUS}
        loading={loading}
        message={message}
        onSelect={setSelected}
        className="mt-4"
      />
      <div className="d-flex gap-3 mt-2">
        <button
          type="button"
          className="btn btn-outline-app-primary fw-400 fs-0p875 px-4"
          disabled={selected.length === 0}
          onClick={onDeleteRecords}
        >Delete</button>
      </div>
      <ConfirmModal
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title={confirmTitle}
        text={confirmText}
        primaryButton="Yes"
        onPrimaryClick={onConfirmModal}
        secondaryButton="No"
      />
    </div>
  );
};

export default AdminNotifications;
