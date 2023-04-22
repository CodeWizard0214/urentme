import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import TableInstance from '../../../components/table/TableInstance';
import PasswordModal from './PasswordModal';
import { getAdminAvatar } from '../../../utils/imageUrl';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'avatar', label: 'Profile Image', width: "10%" },
  { id: 'first_name', label: 'First Name', width: "20%", search: true, sort: true },
  { id: 'last_name', label: 'Last Name', width: "20%", search: true, sort: true },
  { id: 'role', label: 'Role', width: "10%", search: true, sort: true },
  { id: 'email', label: 'Email', width: "30%", search: true, sort: true },
  { id: 'status', label: 'Status', width: "5%", search: true, sort: true },
  { id: 'action', label: 'Action', width: "5%" },
];

const AdminAdministrator = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openPassword, setOpenPassword] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllAdmins().then(data => {
      if (isMounted) {
        setTableData(data.map(row => ({
          id: row.id,
          avatar: getAdminAvatar(row.profile_image),
          first_name: row.first_name,
          last_name: row.last_name,
          role_id: Constant.ADMIN_ROLES.filter(role => role.id === row.role_id)[0].label,
          email: row.email,
          status: row.status === 1 ? 'Active' : 'Deactive',
        })));
        setLoading(false);
      }
    }).catch(e => {
      setLoading(false);
      setMessage('Network Error');
    });
    return () => { isMounted = false; };
  }, []);

  const onAddRecord = () => {
    navigate('/admin/admin/add');
  }

  const onEditRecord = (id) => {
    navigate(`/admin/admin/edit/${id}`);
  }

  const onViewRecord = (id) => {
    navigate(`/admin/admin/view/${id}`);
  }

  const onChangePassword = (id) => {
    setRowId(id);
    setOpenPassword(true);
  }

  const handleChangePassword = (password) => {
    var sha1 = require('sha1');
    const hashPwd = sha1(Constant.HASHKEY + password);
    const json = { id: rowId, password: hashPwd };
    setLoadingPwd(true);
    APIHandler.adminPasswordAdmin(json).then(data => {
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
    { icon: 'password', label: 'Change Password', func: onChangePassword },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Admin Management</h2>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-app-primary fw-400 fs-0p875 px-3"
            onClick={onAddRecord}
          >Add Admin</button>
        </div>
      </div>
      <TableInstance
        headLabels={TABLE_HEAD}
        tableData={tableData}
        menus={ROW_MENUS}
        firstColType={Constant.TABLE_FIRST_COL_NONE}
        loading={loading}
        message={message}
        className="mt-4"
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

export default AdminAdministrator;
