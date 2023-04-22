import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import TableInstance from '../../../components/table/TableInstance';
import ConfirmModal from '../../../components/modal/ConfirmModal';
import EditEmailTemplateModal from './EditEmailTemplateModal';
import { getIdString } from '../../../utils/stringUtils';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'title', label: 'Title', width: "45%", search: true, sort: true },
  { id: 'status', label: 'Status', width: "20%", search: true, sort: true },
  { id: 'modified', label: 'Modified', width: "25%", search: true, sort: true, order: false },
  { id: 'action', label: 'Action', width: "10%" },
];

const CONFIRM_TYPE_NONE = -1;
const CONFIRM_TYPE_ACTIVE = 0;
const CONFIRM_TYPE_DEACTIVE = 1;

const AdminEmailTemplates = () => {
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [confirmType, setConfirmType] = useState(CONFIRM_TYPE_NONE);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllEmailTemplates().then(data => {
      if (isMounted) {
        setAllData(data);
        setLoading(false);
      }
    }).catch(e => {
      setLoading(false);
      setMessage('Network Error');
    });
    return () => { isMounted = false; };
  }, [reload]);

  useEffect(() => {
    setTableData(allData.map(row => ({
      id: row.id,
      title: row.title,
      status: row.status === 1 ? 'Active' : 'Deactive',
      modified: moment(row.modified).format(Constant.DATE_FORMAT),
    })));
  }, [allData]);

  const reloadTable = () => {
    setOpenEdit(false);
    setReload(!reload);
  }

  const onEditRecord = (id) => {
    const data = allData.filter(e => e.id === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setOpenEdit(true);
    }
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
    APIHandler.adminActiveEmailTemplate(`(${ids})`, status).then(data => {
      if (data.result === 'true') {
        setAllData(allData.filter(row => {
          if (selected.includes(row.id)) {
            row.status = status;
          }
          return true;
        }));
        toast.success('Record has been updated successfully');
      } else {
        toast.error('Record has not been updated');
      }
    });
  }

  const onConfirmModal = () => {
    setOpenConfirm(false);
    if (confirmType === CONFIRM_TYPE_ACTIVE) {
      handleActivateRecords(1);
    } else if (confirmType === CONFIRM_TYPE_DEACTIVE) {
      handleActivateRecords(0);
    }
  }

  const ROW_MENUS = [
    { icon: 'edit', label: 'Edit', func: onEditRecord },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Email Template Management</h2>
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
      <EditEmailTemplateModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        itemData = {rowData}
        onSuccess={reloadTable}
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

export default AdminEmailTemplates;
