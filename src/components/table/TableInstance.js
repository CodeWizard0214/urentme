import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import { Lightbox } from 'react-modal-image';
import { FiEdit } from 'react-icons/fi';

import TableToolbar from './TableToolbar';
import TableHeader from './TableHeader';
import MoreMenu from './MoreMenu';
import AppLazyImage from '../elements/AppLazyImage';
import AppSpinner from '../loading/AppSpinner';
import { getReviewPhoto } from '../../utils/imageUrl';
import styles from './TableInstance.module.css';
import noAvatar from '../../assets/images/no_avatar.png';
import noImage from '../../assets/images/noimage.jpg';
import * as Constant from '../../constants/constant';

const PAGE_SIZES = [10, 15, 20, 25, 30, 40, 50];

const TableInstance = (props) => {
  const { headLabels, menus, customMenus, loading, message, onSelect, onChangeRadio } = props;
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [pageItems, setPageItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [firstColType, setFirstColType] = useState(Constant.TABLE_FIRST_COL_CHECK);
  const [openLightBox, setOpenLightBox] = useState(false);
  const [lightImage, setLightImage] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [searchField, setSearchField] = useState('');
  const [searchable, setSearchable] = useState([]);
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState(false);
  const [wrappable, setWrappable] = useState([]);

  useEffect(() => {
    setAllData(props.tableData);
  }, [props.tableData]);

  useEffect(() => {
    setFirstColType(props.firstColType ?? Constant.TABLE_FIRST_COL_CHECK);
  }, [props.firstColType]);

  useEffect(() => {
    setSearchable(Array.from(headLabels.filter(e => e.search === true), ({ id }) => id));
    setWrappable(headLabels.filter(item => 'wrap' in item));
  }, [headLabels]);

  useEffect(() => {
    if (allData.length === 0) {
      setTableData([]);
      return;
    }

    const searchInsensitive = (text, key) => {
      if (!text) {
        return false;
      }
      const label = text.label ?? text;
      return label.toString().toLowerCase().indexOf(key.toLowerCase()) !== -1;
    }

    const searchResult = (searchKey && searchable.length > 0) ? (
      allData.filter(row => {
        if (searchField) {
          const pairs = Object.entries(row);
          const fields = pairs.filter(e => e[0] === searchField);
          if (fields.length !== 1) {
            return false;
          }
          const pair = fields[0];
          return pair && searchInsensitive(pair[1], searchKey);
        } else {
          const pairs = Object.entries(row);
          const fields = pairs.filter(e => searchable.includes(e[0]));
          for (const pair of fields) {
            if (searchInsensitive(pair[1], searchKey)) {
              return true;
            }
          }
          return false;
        }
      })
    ) : (
      allData.slice()
    );

    if (!sortKey) {
      setTableData(searchResult);
      return;
    }

    const sortData = (a, b, key, order) => {
      const a_pairs = Object.entries(a).filter(pair => pair[0] === key);
      const b_pairs = Object.entries(b).filter(pair => pair[0] === key);
      if (a_pairs.length !== 1 || b_pairs.length !== 1) {
        return 1;
      }

      const a_val = a_pairs[0][1];
      const b_val = b_pairs[0][1];
      if (!a_val || !b_val) {
        return 1;
      }

      if (['created', 'modified'].includes(key)) {
        return order ? moment(a_val) - moment(b_val) : moment(b_val) - moment(a_val);
      } else if (typeof(a_val) === 'number') {
        return order ? a_val - b_val : b_val - a_val;
      } else if (typeof(a_val) === 'object') {
        return order ? a_val.label.localeCompare(b_val.label) : b_val.label.localeCompare(a_val.label);
      }
      return order ? a_val.localeCompare(b_val) : b_val.localeCompare(a_val);
    }

    searchResult.sort((a, b) => sortData(a, b, sortKey, sortOrder));
    setTableData(searchResult);
  }, [allData, searchKey, searchField, headLabels, searchable, sortKey, sortOrder]);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchKey, searchField])

  useEffect(() => {
    setPageCount(Math.ceil(tableData.length / pageSize));
    if (firstColType === Constant.TABLE_FIRST_COL_NUM) {
      const start = currentPage * pageSize;
      const count = tableData.length - start > pageSize ? pageSize : tableData.length - start;
      let items = [];
      for (var i = 0; i < count; i++) {
        items = [...items, {no: start + i + 1, ...tableData[start + i]}];
      }
      setPageItems(items);
    } else {
      setPageItems(tableData.slice(currentPage * pageSize, (currentPage + 1) * pageSize));
    }
    setSelected([]);
  }, [tableData, pageSize, currentPage, firstColType]);

  useEffect(() => {
    if (onSelect) {
      onSelect(selected);
    }
  }, [selected, onSelect]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newSelected = pageItems.map(row => row.id)
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  }

  const handleSort = (key, order) => {
    setSortKey(key);
    setSortOrder(order);
  }

  const handleSelectRow = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex >= 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  }
  
  const handlePageSize = (e) => {
    const size = e.target.value;
    setPageSize(size);
    const page = currentPage * size > tableData.length ? ~~(tableData.length / size) : currentPage;
    setCurrentPage(page);
  }

  const handleChangeRadio = (id) => {
    if (onChangeRadio) {
      onChangeRadio(id);
    }
  }

  const getCustomStatusStyle = (value) => {
    if (['Active', 'Approved', 'Paid', 'Booked', 'Waiting For Item Pick Up', 'Rent Amount Released', 'Owner Received Item', 'Renter Received Item', 'Security Deposit Released', 'Rental Completed', 'Accept', 'Accepted'].includes(value)) {
      return `${styles.green}`;
    } else if (['Deactive', 'Pending', 'Unpaid'].includes(value)) {
      return `${styles.yellow}`;
    } else if (['Decline', 'Declined', 'Cancel', 'Cancelled', 'Disputed'].includes(value)) {
      return `${styles.red}`;
    }
    return '';
  }

  const renderImage = (key, value) => {
    const placeholder = key === 'avatar' ? noAvatar : noImage;
    const cellStyle = key === 'image' ? `${styles.imageCell}` : `${styles.avatarCell}`;
    return (
      <div className={`d-flex align-items-center ${cellStyle}`}>
        <AppLazyImage
          src={value}
          alt=""
          placeholder={placeholder}
          className={styles.imageItem}
          wrapperClassName={styles.imageWrapper}
        />
      </div>
    );
  }

  const openBookingPhotoModal = (url) => {
    setOpenLightBox(true);
    setLightImage(getReviewPhoto(url, false));
  }

  const closeBookingPhotoModal = () => {
    setOpenLightBox(false);
    setLightImage('');
  }

  const renderBookingPhotos = (id, value) => {
    return (
      <div>
        <div className="d-flex align-items-center gap-1">
          {value.photos?.length > 0 && value.photos.map((photo, idx) => (
            <div
              key={`${id}-photo-${idx}`}
              className={`d-flex align-items-center hand ${styles.photoCell}`}
              onClick={() => openBookingPhotoModal(photo)}
            >
              <AppLazyImage
                src={getReviewPhoto(photo, true)}
                alt=""
                placeholder={noImage}
                className={styles.imageItem}
                wrapperClassName={styles.imageWrapper}
              />
            </div>
          ))}
        </div>
        <div className="d-flex aligin-items-center gap-2 mt-2">
          {value.menus?.length > 0 && value.menus.map((menu, idx) => (
            <span
              key={`${id}-menu-${idx}`}
              className={`${styles.photoMenu} ${menu.func ? "hand" : ""} ${getCustomStatusStyle(menu.label)}`}
              onClick={() => menu.func(id, menu.type)}
            >
              {menu.label}
            </span>
          ))}
        </div>
        {value.label && (
          <span className="fw-400 fs-0p875 cod-gray">{value.label}</span>
        )}
      </div>
    );
  }

  const renderHtml = (value) => (
    <div dangerouslySetInnerHTML={{ __html: value }} className={styles.htmlEllipsis} />
  );

  const renderRadio = (id, value) => (
    <div className="form-check">
      <input
        type="radio"
        name="table_radio"
        className="form-check-input app-form-check"
        checked={!!value}
        onChange={() => handleChangeRadio(id)}
      />
    </div>
  )

  const renderLink = (value) => (
    <Link to={value.url} className="fw-400 fs-0p875 cod-gray decoration-none">{value.label}</Link>
  );

  const renderButton = (id, value) => (
    <span className={`${styles.label} ${styles.green} ${styles.noBreak} hand`} onClick={() => value.func(id)}>{value.label}</span>
  );

  const renderEditable = (id, cell) => (
    <div className="d-flex align-items-center gap-2">
      <span className='fw-400 fs-0p875 cod-gray'>{cell.label}</span>
      <FiEdit className="fs-0p75 cod-gray hand" onClick={() => cell.func(id, cell.value)} />
    </div>
  );

  const renderCell = (id, key, value) => {
    let custom = '';
    if (key === 'status') {
      custom += ` ${styles.label} ${getCustomStatusStyle(value)}`;
    } else if (key === 'status1') {
      custom += ` ${styles.smallStatus} ${getCustomStatusStyle(value)}`
    } else if (['avatar', 'image', 'card'].includes(key)) {
      return renderImage(key, value);
    } else if (['pickup_photos', 'return_photos'].includes(key)) {
      return renderBookingPhotos(id, value);
    } else if (key === 'contents_html') {
      return renderHtml(value);
    } else if (key === 'radio') {
      return renderRadio(id, +value);
    } else if (key === 'link') {
      return renderLink(value);
    } else if (key === 'button') {
      return renderButton(id, value);
    } else if (key === 'owner_receivable') {
      return renderEditable(id, value);
    }

    if (wrappable.filter(e => e.id === key).length > 0) {
      custom += ` ${styles.breakWord}`;
    }

    return (
      <span className={`fw-400 fs-0p875 cod-gray ${custom}`}>{value}</span>
    );
  }

  const renderLastRow = () => {
    if (currentPage !== pageCount - 1 || tableData.length === pageCount * pageSize) {
      return null;
    }

    return (
      <tr style={{ height: "100%" }}>
        <td align="center" colSpan={headLabels.length + (!!menus ? 1 : 0)}></td>
      </tr>
    );
  };

  return (
    <div className={props.className}>
      <TableToolbar
        numSelected={selected.length}
        headLabels={headLabels}
        loading={loading}
        onChangeKey={setSearchKey}
        onChangeField={setSearchField}
      />
      <Table>
        <TableHeader
          headLabels={headLabels}
          rowCount={pageItems.length}
          numSelected={selected.length}
          firstColType={firstColType}
          loading={loading}
          onSelectAll={handleSelectAll}
          onSort={handleSort}
        />
        <tbody className="admin-tbody-min-height">
          {(loading || message || pageItems.length === 0) && (
            <tr>
              <td align="center" colSpan={headLabels.length + (!!menus ? 1 : 0)}>
                {loading ? (
                  <AppSpinner absolute />
                ) : message ? (
                  <div className="text-center fw-400 fs-1p0 gray-36 my-4">{message}</div>
                ) : (
                  <div className="text-center fw-400 fs-1p0 gray-36 my-4">No Table Data</div>
                )}
              </td>
            </tr>
          )}
          {!loading && !message && pageItems?.map((row, idx) => {
            const { no, id, menuIds, ...info } = row;
            const isItemSelected = selected.indexOf(id) !== -1;

            return (
              <tr key={`row-${id ? id : idx}`}>
                {firstColType === Constant.TABLE_FIRST_COL_CHECK ? (
                  <th scope="row">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={isItemSelected}
                        onChange={e => handleSelectRow(id)}
                      />
                    </div>
                  </th>
                ) : firstColType === Constant.TABLE_FIRST_COL_NUM ? (
                  <th scope="row">
                    <span className="fw-400 fs-0p875 cod-gray">{no}</span>
                  </th>
                ) : (
                  <></>
                )}
                {Object.keys(info).map((key, idx) => {
                  const value = Object.values(info)[idx];

                  return (
                    <td key={`${id}-${key}`}>
                      {renderCell(id, key, value)}
                    </td>
                  );
                })}
                {(!!menus || !!menuIds) && (
                  <td>
                    <MoreMenu
                      id={id}
                      menus={menus}
                      customMenus={customMenus}
                      menuIds={menuIds}
                    />
                  </td>
                )}
              </tr>
            );
          })}
          {!loading && !message && pageItems.length > 0 && renderLastRow()}
        </tbody>
      </Table>
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-baseline">
          <span className="fw-400 fs-0p875 cod-gray me-2">Show</span>
          <select className="form-select" onChange={handlePageSize} disabled={loading}>
            {PAGE_SIZES.map((val, idx) => (
              <option key={`page-size-${idx}`} value={val}>{val}</option>
            ))}
          </select>
          <span className="fw-400 fs-0p875 cod-gray ms-2">entries</span>
        </div>
        <div className="d-flex align-items-baseline">
          {tableData.length > 0 && (
            <span className="fw-400 fs-0p875 cod-gray me-3">
              Showing {currentPage * pageSize + 1} to {(currentPage + 1) * pageSize > tableData.length ? tableData.length : (currentPage + 1) * pageSize} of {tableData.length}
            </span>
          )}
          <ReactPaginate
            className={`d-flex ${styles.pagination}`}
            breakLabel="..."
            previousLabel="<"
            nextLabel=">"
            forcePage={currentPage}
            pageCount={pageCount}
            onPageChange={handlePageClick}
            renderOnZeroPageCount={null}
            marginPagesDisplayed = {1}
            pageClassName={styles.pagination}
            pageLinkClassName={styles.pageLink}
            breakClassName={styles.pageLink}
            activeLinkClassName={styles.pageActive}
            previousLinkClassName={`${styles.pageLink} ${styles.pageNav}`}
            nextLinkClassName={`${styles.pageLink} ${styles.pageNav}`}
          />
        </div>
      </div>
      {openLightBox && (
        <Lightbox
          medium={lightImage}
          large={lightImage}
          alt=""
          onClose={closeBookingPhotoModal}
        />
      )}
    </div>
  );
};

export default TableInstance;
