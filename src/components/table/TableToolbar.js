import React, { useEffect, useState } from 'react';
import { BsSearch } from "react-icons/bs";

import styles from './TableToolbar.module.css';

const TableToolbar = (props) => {
  const { numSelected, headLabels, loading, onChangeKey, onChangeField } = props;
  const [searchKey, setSearchKey] = useState('');
  const [searchFields, setSearchFields] = useState([]);

  useEffect(() => {
    if (headLabels.length > 0) {
      setSearchFields(headLabels.filter(item => item.search === true));
    }
  }, [headLabels]);

  const onSearchKey = (e) => {
    setSearchKey(e.target.value);
    if (onChangeKey) {
      onChangeKey(e.target.value);
    }
  };
  const onSearchField = (e) => {
    if (onChangeField) {
      onChangeField(e.target.value)
    }
  }

  return (
    <div className={styles.toolbar}>
      {numSelected > 0 ? (
        <div className="fw-400 fs-1p0 cod-gray ms-5">{numSelected} selected</div>
      ) : (
        <div className="d-flex form-group gap-3 ms-2 me-3 my-2">
          <div className="d-flex position-relative" style={{ minWidth: 300 }}>
            <input
              type="text"
              id="tableSearch"
              placeholder="Search"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${styles.searchInput}`}
              value={searchKey}
              disabled={loading}
              onChange={onSearchKey}
            />
            <BsSearch className={styles.searchIcon} />
          </div>
          <select
            className="form-select fw-400 fs-0p875 oxford-blue app-form-control"
            onChange={onSearchField}
            disabled={loading}
          >
            <option value="">All</option>
            {searchFields.map(field => (
              <option key={`field-${field.id}`} value={field.id}>{field.label}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TableToolbar;
