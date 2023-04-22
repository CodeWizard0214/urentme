import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { toast } from 'react-toastify';

import TableInstance from '../../../components/table/TableInstance';
import ConfirmModal from '../../../components/modal/ConfirmModal';
import PasswordModal from './PasswordModal';
import { getMemberAvatar } from '../../../utils/imageUrl';
import { getIdString } from '../../../utils/stringUtils';
import { setUserId } from '../../../store/actions/userActions';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'avatar', label: 'Profile Image', width: "5%" },
  { id: 'login_type', label: 'Login Type', width: "5%", search: true, sort: true },
  { id: 'name', label: 'Name', width: "20%",  search: true, sort: true },
  { id: 'mobile', label: 'Mobile', width: "10%", search: true, sort: true },
  { id: 'username', label: 'Username', width: "20%", search: true, sort: true, wrap: true },
  { id: 'email', label: 'Email', width: "15%", search: true, sort: true },
  { id: 'device_type', label: 'Device Type', width: "3%", search: true, sort: true },
  { id: 'status', label: 'Status', width: "7%", search: true, sort: true },
  { id: 'created', label: 'Created', width: "8%", search: true, sort: true, order: false },
  { id: 'button', label: 'Login To User', width: "4%" },
  { id: 'action', label: 'Action', width: "3%" },
];

const CONFIRM_TYPE_NONE = -1;
const CONFIRM_TYPE_DEL_ONE = 0;
const CONFIRM_TYPE_ACTIVE = 1;
const CONFIRM_TYPE_DEACTIVE = 2;
const CONFIRM_TYPE_EMAIL = 3;
const CONFIRM_TYPE_LOGIN_USER = 4;

const AdminMembers = (props) => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [confirmType, setConfirmType] = useState(CONFIRM_TYPE_NONE);
  const [openPassword, setOpenPassword] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllMembers().then(data => {
      if (isMounted) {
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
      avatar: getMemberAvatar(row.profile_image),
      login_type: row.login_type,
      name: `${row.first_name} ${row.last_name}`,
      mobile: row.mobile,
      username: row.username,
      email: row.email,
      device_type: row.device_type,
      status: row.status === 1 ? 'Active' : 'Deactive',
      created: moment(row.created).format(Constant.DATE_FORMAT),
      button: { label: 'Login As User', func: onLoginAsUser },
    })));
  }, [allData]);

  const onAddRecord = () => {
    navigate(`/admin/user/add`);
  }

  const onEditRecord = (id) => {
    navigate(`/admin/user/edit/${id}`);
  }

  const onViewRecord = (id) => {
    navigate(`/admin/user/view/${id}`);
  }

  const onResendEmail = (id) => {
    setRowId(id);
    setConfirmTitle('Send Mail');
    setConfirmText('Are you sure to resend email verification link?');
    setConfirmType(CONFIRM_TYPE_EMAIL);
    setOpenConfirm(true);
  }

  const onChangePassword = (id) => {
    setRowId(id);
    setOpenPassword(true);
  }

  const onDeleteRecord = (id) => {
    setRowId(id);
    setConfirmTitle('Delete');
    setConfirmText('Are you sure to delete this record?');
    setConfirmType(CONFIRM_TYPE_DEL_ONE);
    setOpenConfirm(true);
  }

  const handleDeleteRecord = () => {
    APIHandler.adminDeleteMember(`(${rowId})`).then(data => {
      if (data.result === 'true') {
        setAllData(allData.filter(row => row.id !== rowId));
        toast.success('Record has been deleted successfully');
      } else {
        toast.error('Record has not been deleted');
      }
    });
  }

  const onActivateRecords = () => {
    setConfirmTitle('Activate');
    setConfirmText('Are you sure to activate selected record(s)?');
    setConfirmType(CONFIRM_TYPE_ACTIVE);
    setOpenConfirm(true);
  }

  const onDeactivateRecords = () => {
    setConfirmTitle('Deactivate');
    setConfirmText('Are you sure to deactivate selected record(s)?');
    setConfirmType(CONFIRM_TYPE_DEACTIVE);
    setOpenConfirm(true);
  }

  const handleActivateRecords = (status) => {
    const ids = getIdString(selected);
    APIHandler.adminActiveMember(`(${ids})`, status).then(data => {
      if (data.result === 'true') {
        setAllData(allData.filter(row => {
          if (selected.includes(row.id)) {
            row.status = status;
          }
          return true;
        }))
        toast.success('Record has been updated successfully');
      } else {
        toast.error('Record has not been updated');
      }
    });
  }

  const handleResendEmail = () => {
    APIHandler.adminEmailMember(rowId).then(data => {
      if (data.result === 'true') {
        toast.success('Verification email has been sent to user');
      } else {
        toast.error('Fail to send email');
      }
    });
  }

  const onLoginAsUser = (id) => {
    setRowId(id);
    setConfirmTitle('Login As User');
    setConfirmText('Are you sure to login as this user?');
    setConfirmType(CONFIRM_TYPE_LOGIN_USER);
    setOpenConfirm(true);
  }

  const handleLoginAsUser = () => {
    sessionStorage.setItem(Constant.CURRENT_USER, rowId);
    localStorage.removeItem(Constant.GLOBAL_USER);
    props.setUserId(rowId);
    // navigate(`/`);
    const win = window.open('/', "_blank");
    win.focus();
  }

  const onConfirmModal = () => {
    setOpenConfirm(false);
    if (confirmType === CONFIRM_TYPE_DEL_ONE) {
      handleDeleteRecord();
    } else if (confirmType === CONFIRM_TYPE_ACTIVE) {
      handleActivateRecords(1);
    } else if (confirmType === CONFIRM_TYPE_DEACTIVE) {
      handleActivateRecords(0);
    } else if (confirmType === CONFIRM_TYPE_EMAIL) {
      handleResendEmail();
    } else if (confirmType === CONFIRM_TYPE_LOGIN_USER) {
      handleLoginAsUser();
    }
  }

  const handleChangePassword = (password) => {
    var sha1 = require('sha1');
    const hashPwd = sha1(Constant.HASHKEY + password);
    const json = { id: rowId, password: hashPwd, plain: password };
    setLoadingPwd(true);
    APIHandler.adminPasswordMember(json).then(data => {
      setLoadingPwd(false);
      if (data.result === 'true') {
        toast.success('The password has been updated successfully');
        setOpenPassword(false);
      } else {
        toast.error('Fail to update password');
      }
    });
  }


  const ROW_MENUS = [
    { icon: 'view', label: 'View', func: onViewRecord },
    { icon: 'edit', label: 'Edit', func: onEditRecord },
    { icon: 'email', label: 'Resend Email Verification link', func: onResendEmail },
    { icon: 'password', label: 'Change Password', func: onChangePassword },
    { icon: 'delete', label: 'Delete', func: onDeleteRecord },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Member Management</h2>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-app-primary fw-400 fs-0p875 px-3"
            onClick={onAddRecord}
          >Add Member</button>
        </div>
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
          className="btn btn-app-primary fw-400 fs-0p875 px-4"
          disabled={selected.length === 0}
          onClick={onActivateRecords}
        >Activate</button>
        <button
          type="button"
          className="btn btn-outline-app-primary fw-400 fs-0p875 px-3"
          disabled={selected.length === 0}
          onClick={onDeactivateRecords}
        >Deactivate</button>
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
      <PasswordModal
        open={openPassword}
        loading={loadingPwd}
        onClose={() => setOpenPassword(false)}
        onChange={handleChangePassword}
      />
    </div>
  );
};

export default connect(null, { setUserId })(AdminMembers);
