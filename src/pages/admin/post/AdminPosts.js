import React, { useState, useEffect } from 'react';
import moment from 'moment';

import TableInstance from '../../../components/table/TableInstance';
import { getBlogImage } from '../../../utils/imageUrl';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'image', label: 'Post Image' },
  { id: 'title', label: 'Title', search: true, sort: true },
  { id: 'contents_html', label: 'Contents', search: true, sort: true },
  { id: 'status', label: 'Status', search: true, sort: true },
  { id: 'created', label: 'Created', search: true, sort: true, order: false },
  { id: 'action', label: 'Action' }
];

const AdminPosts = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllPosts().then(data => {
      if (isMounted) {
        setTableData(data.map(row => ({
          id: row.id,
          image: getBlogImage(row.image),
          title: row.title,
          contents_html: row.content,
          status: (+row.status) === 1 ? 'Active' : 'Deactive',
          created: moment(row.created).format(Constant.DATE_FORMAT),
        })));
        setLoading(false);
      }
    }).catch(e => {
      setLoading(false);
      setMessage('Network Error');
    });
    return () => { isMounted = false; };
  }, []);

  const ROW_MENUS = [
    { icon: 'view', label: 'View' },
    { icon: 'edit', label: 'Edit' },
    { icon: 'delete', label: 'Delete' },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Blog Management</h2>
      </div>
      <TableInstance
        headLabels={TABLE_HEAD}
        tableData={tableData}
        menus={ROW_MENUS}
        loading={loading}
        message={message}
        className="mt-4"
      />
    </div>
  );
};

export default AdminPosts;
