import React, { useState, useEffect } from 'react';
import { BsSortDownAlt, BsSortDown } from 'react-icons/bs';
import { BiSortAlt2 } from 'react-icons/bi';
import * as Constant from '../../constants/constant';

const TableHeader = (props) => {
  const { headLabels, rowCount, numSelected, loading, onSelectAll, onSort } = props;
  const [firstColType, setFirstColType] = useState(Constant.TABLE_FIRST_COL_CHECK);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState(false);

  useEffect(() => {
    setFirstColType(props.firstColType ?? Constant.TABLE_FIRST_COL_CHECK);
  }, [props.firstColType]);

  useEffect(() => {
    const data = headLabels.filter(item => 'order' in item);
    if (data.length > 0) {
      setSortKey(data[0].id);
      setSortOrder(data[0].order);
    }
  }, [headLabels]);

  useEffect(() => {
    if (onSort) {
      onSort(sortKey, sortOrder);
    }
  }, [sortKey, sortOrder, onSort])

  const handleSort = (item) => {
    if (item.sort) {
      if (sortKey === item.id) {
        setSortOrder(!sortOrder);
      } else {
        setSortKey(item.id);
        setSortOrder(true);
      }
    }
  }

  const renderSortArrow = (key) => {
    if (key === sortKey) {
      if (sortOrder) {
        return <BsSortDownAlt className="fp-14 cod-gray" style={{minWidth: "15px"}} />
      } else {
        return <BsSortDown className="fp-14 cod-gray" style={{minWidth: "15px"}}/>
      }
    }
    return <BiSortAlt2 className="fp-14 gray-77" style={{minWidth: "15px"}}/>
  }

  return (
    <thead>
      <tr>
        {firstColType === Constant.TABLE_FIRST_COL_CHECK ? (
        <th width="40px">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              disabled={loading}
              ref={input => {
                if (input) {
                  input.indeterminate = numSelected > 0 && numSelected < rowCount;
                }
              }}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAll}
            />
          </div>
        </th>
        ) : firstColType === Constant.TABLE_FIRST_COL_NUM ? (
          <th className="fw-400 fs-1p0 dark-gray" width="40px">#</th>
        ) : (
          <></>
        )}
        {headLabels && headLabels.map(item => (
          <th key={`header-${item.id}`}
            className={item.sort ? "hand" : ""}
            onClick={() => handleSort(item)}
            width = {item.width}
            style={{ minWidth: item.minWidth }}
          >
            <div className="d-flex align-items-end gap-2">
              <span className={`fw-400 dark-gray ${headLabels.length > 10 ? "fs-0p75" : "fs-1p0"}`}>{item.label}</span>
              {item.sort && renderSortArrow(item.id)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
