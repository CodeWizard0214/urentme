import React, { useState, useEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";

import TableInstance from "../../../components/table/TableInstance";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import EditTipsModal from "./EditTipsModal";
import { getIdString } from "../../../utils/stringUtils";
import * as APIHandler from "../../../apis/APIHandler";
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: "name", label: "Name", width: "16%", search: true, sort: true },
  { id: "contents_html", label: "Contents", width: "70%", search: true, sort: true },
  { id: "list_order", label: "Order", width: "1%", sort: true, order: true },
  { id: "status", label: "Status", width: "7%", search: true, sort: true },
  { id: "created", label: "Created", width: "4%", search: true, sort: true },
  { id: "action", label: "Action", width: "2%" },
];

const CONFIRM_TYPE_NONE = -1;
const CONFIRM_TYPE_DEL_ONE = 0;
const CONFIRM_TYPE_ACTIVE = 1;
const CONFIRM_TYPE_DEACTIVE = 2;
const CONFIRM_TYPE_DELETE = 3;

const AdminTips = () => {
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [confirmType, setConfirmType] = useState(CONFIRM_TYPE_NONE);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.getAllTipsList().then((data) => {
      if (isMounted) {
        setAllData(data);
        setLoading(false);
      }
    }).catch((e) => {
      setLoading(false);
      setMessage("Network Error");
    });
    return () => { isMounted = false; };
  }, [reload]);

  useEffect(() => {
    setTableData(allData.map((row) => ({
      id: row.id,
      name: row.name,
      contents_html: row.contents,
      list_order: (+row.list_order),
      status: (+row.status) === 1 ? "Active" : "Deactive",
      created: moment(row.created).format(Constant.DATE_FORMAT),
    })));
  }, [allData]);

  const reloadTable = () => {
    setOpenEdit(false);
    setReload(!reload);
  };

  const onAddRecord = () => {
    setRowData(null);
    setOpenEdit(true);
  };

  const onEditRecord = (id) => {
    const data = allData.filter((e) => e.id === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setOpenEdit(true);
    }
  };

  const onDeleteRecord = (id) => {
    const data = allData.filter((e) => e.id === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle("Delete");
      setConfirmText("Are you sure to delete this record?");
      setConfirmType(CONFIRM_TYPE_DEL_ONE);
      setOpenConfirm(true);
    }
  };

  const handleDeleteRecord = () => {
    APIHandler.adminDeleteTips(`(${rowData.id})`).then((data) => {
      if (data.result === "true") {
        setAllData(allData.filter(row => row.id !== rowData.id));
        toast.success("Record has been deleted successfully");
      } else {
        toast.error("Record has not been deleted");
      }
    });
  };

  const onActivateRecords = () => {
    setConfirmTitle("Activate");
    setConfirmText("Are you sure to activate selected record(s)?");
    setConfirmType(CONFIRM_TYPE_ACTIVE);
    setOpenConfirm(true);
  };

  const onDeactivateRecords = () => {
    setConfirmTitle("Deactivate");
    setConfirmText("Are you sure to deactivate selected record(s)?");
    setConfirmType(CONFIRM_TYPE_DEACTIVE);
    setOpenConfirm(true);
  };

  const handleActivateRecords = (status) => {
    const ids = getIdString(selected);
    APIHandler.adminActiveTips(`(${ids})`, status).then((data) => {
      if (data.result === "true") {
        setAllData(allData.filter(row => {
          if (selected.includes(row.id)) {
            row.status = status;
          }
          return true;
        }));
        toast.success("Record has been updated successfully");
      } else {
        toast.error("Record has not been updated");
      }
    });
  };

  const onDeleteRecords = () => {
    setConfirmTitle("Delete");
    setConfirmText("Are you sure to delete selected record(s)?");
    setConfirmType(CONFIRM_TYPE_DELETE);
    setOpenConfirm(true);
  };

  const handleDeleteRecords = () => {
    const ids = getIdString(selected);
    APIHandler.adminDeleteTips(`(${ids})`).then((data) => {
      if (data.result === "true") {
        setAllData(allData.filter(row => !selected.includes(row.id)));
        toast.success("Record has been deleted successfully");
      } else {
        toast.error("Record has not been deleted");
      }
    });
  };

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
  };

  const ROW_MENUS = [
    { icon: "edit", label: "Edit", func: onEditRecord },
    { icon: "delete", label: "Delete", func: onDeleteRecord },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Tips Content</h2>
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-app-primary fw-400 fs-0p875 px-3"
            onClick={onAddRecord}
          >
            Add
          </button>
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
        >
          Activate
        </button>
        <button
          type="button"
          className="btn btn-outline-app-primary fw-400 fs-0p875 px-3"
          disabled={selected.length === 0}
          onClick={onDeactivateRecords}
        >
          Deactivate
        </button>
        <button
          type="button"
          className="btn btn-outline-app-primary fw-400 fs-0p875 px-4"
          disabled={selected.length === 0}
          onClick={onDeleteRecords}
        >
          Delete
        </button>
      </div>
      <EditTipsModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        itemData={rowData}
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

export default AdminTips;
