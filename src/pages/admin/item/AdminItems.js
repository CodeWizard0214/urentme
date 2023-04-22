import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';

import TableInstance from '../../../components/table/TableInstance';
import ConfirmModal from '../../../components/modal/ConfirmModal';
import EditFeatureModal from './EditFeatureModal';
import { getIdString } from '../../../utils/stringUtils';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'username', label: 'Username', width: "20%", search: true, sort: true },
  { id: 'category', label: 'Category', width: "15%", search: true, sort: true },
  { id: 'name', label: 'Name', width: "35%", search: true, sort: true },
  { id: 'status', label: 'Status', width: "10%", search: true, sort: true },
  { id: 'created', label: 'Created', width: "10%", search: true, sort: true, order: false },
  { id: 'action', label: 'Action', width: "10%" },
];

const CONFIRM_TYPE_NONE = -1;
const CONFIRM_TYPE_DEL_ONE = 0;
const CONFIRM_TYPE_ACTIVE = 1;
const CONFIRM_TYPE_DEACTIVE = 2;
const CONFIRM_TYPE_DELETE = 3;

const AdminItems = () => {
  const navigate = useNavigate();
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [confirmType, setConfirmType] = useState(CONFIRM_TYPE_NONE);

  useEffect(() => {
    setLoading(true);
    let isMounted = true;
    APIHandler.adminAllItems().then(data => {
      if (isMounted) {
        setAllData(data);
      }
      setLoading(false);
    }).catch(e => {
      setLoading(false);
      setMessage('Network Error');
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    setTableData(allData.map(row => ({
      id: row.id,
      username: row.username,
      category: row.category,
      name: row.name,
      status: (+row.status) === 1 ? 'Active' : 'Deactive',
      created: moment(row.created).format(Constant.DATE_FORMAT),
    })));
  }, [allData]);

  const onEditRecord = (id) => {
    navigate(`/admin/item/edit/${id}`);
  }

  const onViewRecord = (id) => {
    navigate(`/admin/item/view/${id}`);
  }

  const onItemImage = (id) => {
    navigate(`/admin/item/image/${id}`);
  }

  const onItemFeature = (id) => {
    const data = allData.filter(e => e.id === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setOpenEdit(true);
    }
  }

  const onCloseFeature = () => {
    setOpenEdit(false);
    setRowData([]);
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
    APIHandler.adminDeleteItem(`(${rowData.id})`).then(data => {
      if (data.result === 'true') {
        setAllData(allData.filter(row => row.id !== rowData.id));
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
    APIHandler.adminActiveItem(`(${ids})`, status).then(data => {
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

  const onDeleteRecords = () => {
    setConfirmTitle('Delete');
    setConfirmText('Are you sure to delete selected record(s)?');
    setConfirmType(CONFIRM_TYPE_DELETE);
    setOpenConfirm(true);
  }

  const handleDeleteRecords = () => {
    const ids = getIdString(selected);
    APIHandler.adminDeleteItem(`(${ids})`).then(data => {
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
    } else if (confirmType === CONFIRM_TYPE_ACTIVE) {
      handleActivateRecords(1);
    } else if (confirmType === CONFIRM_TYPE_DEACTIVE) {
      handleActivateRecords(0);
    } else if (confirmType === CONFIRM_TYPE_DELETE) {
      handleDeleteRecords();
    }
  }

  const ROW_MENUS = [
    { icon: 'view', label: 'View', func: onViewRecord },
    { icon: 'edit', label: 'Edit', func: onEditRecord },
    { icon: 'delete', label: 'Delete', func: onDeleteRecord },
    { icon: 'image', label: 'Image', func: onItemImage },
    { icon: 'feature', label: 'Feature', func: onItemFeature },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Item Management</h2>
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
        <button
          type="button"
          className="btn btn-outline-app-primary fw-400 fs-0p875 px-4"
          disabled={selected.length === 0}
          onClick={onDeleteRecords}
        >Delete</button>
      </div>
      <EditFeatureModal
        open={openEdit}
        onClose={onCloseFeature}
        id={rowData?.id}
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

export default AdminItems;
