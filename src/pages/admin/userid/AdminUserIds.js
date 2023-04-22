import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import TableInstance from '../../../components/table/TableInstance';
import ConfirmModal from '../../../components/modal/ConfirmModal';
import { getMemberAvatar, getDriverLicenseImage } from '../../../utils/imageUrl';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'avatar', label: 'Profile Image', width: "10%" },
  { id: 'name', label: 'Name', width: "25%", search: true, sort: true },
  { id: 'username', label: 'Username', width: "30%", search: true, sort: true },
  { id: 'card', label: 'Id\'s', width: "10%" },
  { id: 'status', label: 'Status', width: "10%", search: true, sort: true },
  { id: 'modified', label: 'Modified', width: "10%", search: true, sort: true, order: false },
  { id: 'action', label: 'Action', width: "5%" },
];

const PAGE_TYPES = [
  { id: Constant.LICENSE_STATUS_PENDING, label: 'Pending' },
  { id: Constant.LICENSE_STATUS_VERIFIED, label: 'Approved' },
  { id: Constant.LICENSE_STATUS_REJECTED, label: 'Decline' },
  { id: Constant.LICENSE_STATUS_NONE, label: 'All' },
];

const CONFIRM_TYPE_NONE = -1;
const CONFIRM_TYPE_DEL_ONE = 0;
const CONFIRM_TYPE_APPROVE = 1;
const CONFIRM_TYPE_DECLINE = 2;

const AdminUserIds = () => {
  const [allData, setAllData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [confirmType, setConfirmType] = useState(CONFIRM_TYPE_NONE);
  const [pageType, setPageType] = useState(Constant.LICENSE_STATUS_PENDING);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllUserIds().then((data) => {
      if (isMounted) {
        setAllData(data);
        setLoading(false);
      }
    }).catch((e) => {
      setLoading(false);
      setMessage('Network Error');
    });
    return () => { isMounted = false; };
  }, [reload]);

  useEffect(() => {
    setPageData(pageType === Constant.LICENSE_STATUS_NONE ? allData
      : allData.filter(item => (+item.status) === pageType));    
  }, [allData, pageType]);

  useEffect(() => {
    setTableData(
      pageData.map((row) => ({
        id: row.id,
        menuIds: getCustomMenus(+row.status),
        avatar: getMemberAvatar(row.profile_image),
        name: `${row.first_name} ${row.last_name}`,
        username: row.username,
        card: getDriverLicenseImage(row.image),
        status: getStatusText(+row.status),
        modified: moment(row.modified).format(Constant.DATE_FORMAT),
      }))
    );
  }, [pageData]);

  const getStatusText = (status) => {
    return status === Constant.LICENSE_STATUS_PENDING ? 'Pending' :
      status === Constant.LICENSE_STATUS_REJECTED ? 'Decline' :
      status === Constant.LICENSE_STATUS_VERIFIED ? 'Approved' : '';
  }

  const getCustomMenus = (status) => {
    return status === Constant.LICENSE_STATUS_PENDING ? [0, 1] :
      status === Constant.LICENSE_STATUS_REJECTED ? [1] :
      status === Constant.LICENSE_STATUS_VERIFIED ? [0] : [];
  }

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
    APIHandler.adminDeleteUserId(`(${rowData.id})`).then(data => {
      if (data.result === 'true') {
        setPageData(pageData.filter(row => row.id !== rowData.id));
        toast.success('Record has been deleted successfully');
      } else {
        toast.error('Record has not been deleted');
      }
    });
  }

  const onApproveRecord = (id) => {
    const data = allData.filter(e => e.id === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle('Approve');
      setConfirmText('Are you sure to approve this record?');
      setConfirmType(CONFIRM_TYPE_APPROVE);
      setOpenConfirm(true);
    }
  }

  const onDeclineRecord = (id) => {
    const data = allData.filter(e => e.id === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle('Decline');
      setConfirmText('Are you sure to decline this record?');
      setConfirmType(CONFIRM_TYPE_DECLINE);
      setOpenConfirm(true);
    }
  }

  const handleActivateRecords = (status) => {
    APIHandler.adminActiveUserId(`(${rowData.id})`, status).then(data => {
      if (data.result === 'true') {
        setReload(!reload);
        toast.success('Record has been updated successfully');
      } else {
        toast.error('Record has not been updated');
      }
    });
  }

  const onConfirmModal = () => {
    setOpenConfirm(false);
    if (confirmType === CONFIRM_TYPE_DEL_ONE) {
      handleDeleteRecord();
    } else if (confirmType === CONFIRM_TYPE_APPROVE) {
      handleActivateRecords(Constant.LICENSE_STATUS_VERIFIED);
    } else if (confirmType === CONFIRM_TYPE_DECLINE) {
      handleActivateRecords(Constant.LICENSE_STATUS_REJECTED);
    }
  }

  const onChangePage = (e) => {
    setPageType(+e.target.value);
  }

  const ROW_MENUS = [
    { icon: 'delete', label: 'Delete', func: onDeleteRecord },
  ];

  const CUSTOM_MENUS = [
    { icon: 'close', label: 'Decline', func: onDeclineRecord },
    { icon: 'check', label: 'Approve', func: onApproveRecord },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">ID Verification Management</h2>
        <div className="d-flex algin-items-center" style={{ width: 320, height: 40 }}>
          <span className="fw-400 fs-1p0 dark-gray py-2 me-3">Page Type:</span>
          <select
            className="form-select fw-400 fs-0p875 oxford-blue app-form-control"
            style={{ width: 180 }}
            onChange={onChangePage}
          >
            {PAGE_TYPES.map(field => (
              <option key={`field-${field.id}`} value={field.id}>{field.label}</option>
            ))}
          </select>
        </div>
      </div>
      <TableInstance
        headLabels={TABLE_HEAD}
        tableData={tableData}
        menus={ROW_MENUS}
        customMenus={CUSTOM_MENUS}
        firstColType={Constant.TABLE_FIRST_COL_NONE}
        loading={loading}
        message={message}
        className="mt-4"
      />
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

export default AdminUserIds;
