import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { IoArrowBack } from 'react-icons/io5';

import AppLazyImage from '../../../components/elements/AppLazyImage';
import TableInstance from '../../../components/table/TableInstance';
import ConfirmModal from '../../../components/modal/ConfirmModal';
import CropModal from '../../../components/crop/CropModal';
import { getImageUriFromName } from '../../../utils/imageUrl';
import { getImageBase64Data } from '../../../utils/imageUtils';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';
import IMAGE_PLUS from '../../../assets/images/mark/plus.svg';
import styles from './AdminEditImage.module.css';

const TABLE_HEAD = [
  { id: 'radio', label: 'Default', width: "5%" },
  { id: 'item', label: 'Item', width: "30%", search: true , sort: true },
  { id: 'image', label: 'Image', width: "30%", },
  { id: 'created', label: 'Created', width: "30%", search: true, sort: true, order: false },
  { id: 'action', label: 'Action', width: "5%" }
];

const CONFIRM_TYPE_NONE = -1;
const CONFIRM_TYPE_DEL_ONE = 0;

const AdminEditImage = () => {
  const { id } = useParams();
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [confirmType, setConfirmType] = useState(CONFIRM_TYPE_NONE);
  const [uploadImageValue, setUploadImageValue] = useState('') ;
  const [photo, setPhoto] = useState('');
  const [image, setImage] = useState(null);
  const [openCrop, setOpenCrop] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllImages(id).then(data => {
      if (isMounted) {
        setAllData(data);
        setLoading(false);
      }
    }).catch(e => {
      setLoading(false);
      setMessage('Network Error');
    });
    return () => { isMounted = false; };
  }, [id, reload]);

  useEffect(() => {
    setTableData(allData.map(row => ({
      id: row.id,
      radio: row.is_default,
      item: row.item_name,
      image: getImageUriFromName(row.name, true),
      created: moment(row.created).format(Constant.DATE_FORMAT),
    })));
  }, [allData]);

  const onDeleteRecord = (id) => {
    setRowId(id);
    setConfirmTitle('Delete');
    setConfirmText('Are you sure to delete this record?');
    setConfirmType(CONFIRM_TYPE_DEL_ONE);
    setOpenConfirm(true);
  }

  const handleDeleteRecord = () => {
    APIHandler.adminDeleteImage(`(${rowId})`).then(data => {
      if (data.result === 'true') {
        setAllData(allData.filter(row => row.id !== rowId));
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
    }
  }

  const onChangeDefaultImage = (default_id) => {
    setLoading(true);
    APIHandler.adminEditImages(id, default_id).then(data => {
      if (data.result === 'true') {
        setAllData(allData.filter(row => {
          row.is_default = row.id === default_id;
          return true;
        }));
      }
      setLoading(false);
    });
  }

  const renderUploadImage = () => {
    const onChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setPhoto(URL.createObjectURL(e.target.files[0]));
        setOpenCrop(true);
      }
    }

    const onCropped = (url, blob) => {
      if (url && blob) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          setImage({ path: URL.createObjectURL(blob), data: getImageBase64Data(reader.result) });
          setOpenCrop(false);
        });
        reader.readAsDataURL(blob);
      }
    }

    const onUpload = () => {
      if (image?.data) {
        setLoading(true);
        const fname = id + '_' + parseInt(new Date().getTime() / 1000).toString() + '_' + (allData.length + 1) + '.jpeg';
        APIHandler.uploadItemImage(id, fname, allData.length === 0 ? 1 : 0, image.data).then(data => {
          if (data.result === 'True' || data.includes('True')) {
            toast.success('Image has been uploaded successfully');
            setImage(null);
            setReload(!reload);
          } else {
            toast.error('Image upload failed. Please try again');
          }
          setLoading(fname, false);
        });
      }
    }

    return (
      <div className="d-flex align-items-end justify-content-center">
        <span className="fw-500 fs-1p0 dark-gray me-3">Image *</span>
        <div className={styles.imageContainer}>
          <label htmlFor="upload_image" className={styles.uploadImage}>
            <input
              id="upload_image"
              type="file"
              className="d-none"
              onChange={onChange}
              disabled={loading}
              value={uploadImageValue}
              onClick={() => setUploadImageValue('')}
            />
            <div className={`${styles.uploadImage} ${loading ? "" : "hand"}`}>
              {image ? (
                <AppLazyImage
                  src={image.path}
                  alt=""
                  className={styles.imageItem}
                  wrapperClassName={styles.imageWrapper}
                />
              ) : (
                <AppLazyImage
                  src={IMAGE_PLUS}
                  alt=""
                  className={styles.plusImage}
                  wrapperClassName={styles.plusButton}
                />
              )}
            </div>
          </label>
        </div>
        <button
          type="button"
          className="btn btn-outline-app-primary fw-400 fs-1p0 white px-3 ms-4"
          disabled={loading || !image?.data}
          onClick={onUpload}
        >Upload</button>
        <CropModal
          open={openCrop}
          src={photo}
          onClose={() => setOpenCrop(false)}
          onUpload={onCropped}
        />
      </div>
    );
  }

  const ROW_MENUS = [
    { icon: 'delete', label: 'Delete', func: onDeleteRecord },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Item Management</h2>
      </div>
      <div className="d-flex align-items-center gap-2 my-3">
        <Link to="/admin/items">
          <IoArrowBack className="fs-1p25 midnight" />
        </Link>
        <span className="fw-500 fs-1p125 midnight">Upload Image</span>
      </div>
      {renderUploadImage()}
      <TableInstance
        headLabels={TABLE_HEAD}
        tableData={tableData}
        menus={ROW_MENUS}
        firstColType={Constant.TABLE_FIRST_COL_NONE}
        loading={loading}
        message={message}
        onChangeRadio={onChangeDefaultImage}
        className="mt-4"
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

export default AdminEditImage;
