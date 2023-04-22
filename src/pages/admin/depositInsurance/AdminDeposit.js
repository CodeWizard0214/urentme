import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import TableInstance from '../../../components/table/TableInstance';
import ConfirmModal from '../../../components/modal/ConfirmModal';
import EditDepositModal from './EditDepositModal';
import { getIdString } from '../../../utils/stringUtils';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'name', label: 'Category', width: "30%", search: true, sort: true },
  { id: 'security_deposit', label: 'Security Deposit', width: "20%", sort: true },
  { id: 'insurace_rate', label: 'Insurance Rate Per Day', width: "20%", sort: true },
  { id: 'insurance_tax_rate', label: 'Insurance Tax Rate Per Day', width: "20%", sort: true },
  { id: 'status', label: 'Created', width: "5%", search: true, sort: true, order: false },
  { id: 'action', label: 'Action', width: "5%" },
];

const CONFIRM_TYPE_NONE = -1;
const CONFIRM_TYPE_DEL_ONE = 0;
const CONFIRM_TYPE_DELETE = 1;

const AdminDeposit = () => {
  const [categories, setCategories] = useState([]);
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
    APIHandler.adminAllCategories().then(data => {
      if (isMounted) {
        setCategories(data.filter(e => e.status === 1));
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.getAllDepositList().then(data => {
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
      category: row.name,
      security_deposit: row.security_deposit,
      insurance_rate: row.insurance_rate,
      insurance_tax_rate: row.insurance_tax_rate,
      created: moment(row.created).format(Constant.DATE_FORMAT)
    })));
  }, [allData]);

  const reloadTable = () => {
    setOpenEdit(false);
    setReload(!reload);
  }

  const onAddRecord = () => {
    setRowData(null);
    setOpenEdit(true);
  }

  const onEditRecord = (id) => {
    const data = allData.filter(e => e.id === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setOpenEdit(true);
    }
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
    APIHandler.adminDeleteDeposit(`(${rowData.id})`).then(data => {
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
    APIHandler.adminDeleteDeposit(`(${ids})`).then(data => {
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
    { icon: 'edit', label: 'Edit', func: onEditRecord },
    { icon: 'delete', label: 'Delete', func: onDeleteRecord },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Deposit &amp; Insurance</h2>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-app-primary fw-400 fs-0p875 px-3"
            onClick={onAddRecord}
          >Add Record</button>
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
          className="btn btn-outline-app-primary fw-400 fs-0p875 px-4"
          disabled={selected.length === 0}
          onClick={onDeleteRecords}
        >Delete</button>
      </div>
      <EditDepositModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        itemData = {rowData}
        categories={categories}
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

export default AdminDeposit;
