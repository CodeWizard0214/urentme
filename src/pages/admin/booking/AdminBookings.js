import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';

import TableInstance from '../../../components/table/TableInstance';
import ConfirmModal from '../../../components/modal/ConfirmModal';
import EditSecurityDepositModal from './EditSecurityDepositModal';
import EditAmountModal from './EditAmountModal';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const TABLE_HEAD = [
  { id: 'order_id', label: 'Order ID', search: true, sort: true, order: false },
  { id: 'user_name', label: 'User Name', minWidth: '150px', search: true , sort: true },
  { id: 'link', label: 'Item', minWidth: '200px', search: true , sort: true },
  { id: 'start_date', label: 'Start Date', minWidth: '110px', search: true, sort: true },
  { id: 'end_date', label: 'End Date', minWidth: '110px', search: true, sort: true },
  { id: 'total_price', label: 'Total Amount', search: true, sort: true },
  { id: 'security_amount', label: 'Security Amount', search: true, sort: true },
  { id: 'renter_security_deposit_amount', label: 'Renter Released Security Amount', search: true, sort: true },
  { id: 'owner_security_deposit_amount', label: 'Owner Released Security Amount', search: true, sort: true },
  { id: 'total_rent', label: 'Total Rent', search: true, sort: true },
  { id: 'cleaning_fee', label: 'Cleaning Fee', search: true, sort: true },
  { id: 'base_rental_amount', label: 'Base Rental Amount', search: true, sort: true },
  { id: 'base_rental_rate_per_day', label: 'Base Rental Rate Per Day', search: true, sort: true },
  { id: 'total_insurance_amount', label: 'Total Insurance Includes Insurance Tax', search: true, sort: true },
  { id: 'total_insurance_tax', label: 'Total Insurance Tax', search: true, sort: true },
  { id: 'insurance_rate_per_day', label: 'Insurance Rate Per Day', search: true, sort: true },
  { id: 'brokerfees', label: 'URentMe Fee', search: true, sort: true },
  { id: 'roadside_assistance_fee', label: 'Roadside Assistance Fee', search: true, sort: true },
  { id: 'is_roadside_assistance_required', label: 'Roadside Assistance Required', search: true, sort: true },
  { id: 'discount_price', label: 'Discount Price', search: true, sort: true },
  { id: 'coupon_code', label: 'Coupon Code', search: true, sort: true },
  { id: 'owner_receivable', label: 'Owner Receivable', search: true, sort: true },
  { id: 'payoption', label: 'Payment Method', search: true, sort: true },
  { id: 'pickup_photos', label: 'Pickup Photos', minWidth: '200px' },
  { id: 'return_photos', label: 'Return Photos', minWidth: '200px' },
  { id: 'status1', label: 'Status', search: true, sort: true },
  { id: 'is_test_booking', label: 'Is Test Booking?', search: true, sort: true },
  { id: 'created', label: 'Created', minWidth: '110px', search: true, sort: true },
  { id: 'action', label: 'Action' }
];

const PAGE_TYPES = [
  { id: 0, label: 'Regular Bookings' },
  { id: 1, label: 'Tested Bookings' },
];

const CONFIRM_TYPE_NONE = -1;
const CONFIRM_TYPE_ACCEPT_PHOTO = 0;
const CONFIRM_TYPE_DECLINE_PHOTO = 1;
const CONFIRM_TYPE_RELEASE_RENT_TO_OWNER = 2;
const CONFIRM_TYPE_RELEASE_TO_OWNER_W = 3;
const CONFIRM_TYPE_REFUND_SECURITY_DEPOSIT_BUYER = 4;
const CONFIRM_TYPE_TOTAL_AMOUNT_BUYER = 5;
const CONFIRM_TYPE_FULLY_PAID_OVERRIDE = 7;
const CONFIRM_TYPE_RESEND_CHECKOUT_EMAIL = 8;
const CONFIRM_TYPE_PULL_TRANSFER_INFORMATION = 9;

const Decline = 2; 
const RentAmountRelease = 7; 
const ReleaseSecurityDeposit = 8; 

const AdminBookings = () => {
  const [allData, setAllData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState(null);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [confirmType, setConfirmType] = useState(CONFIRM_TYPE_NONE);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editAmount, setEditAmount] = useState('');
  const [photoType, setPhotoType] = useState('');
  const [pageType, setPageType] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    APIHandler.adminAllBookings().then(data => {
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
    const pageData = pageType === 0 ? allData
      : allData.filter(row => row.is_test_booking === 'Y');
    setTableData(pageData.map(row => ({
      id: (+row.id),
      menuIds: getCustomMenus(+row.status, +row.security_amount, row.is_released_security_deposit, row.is_owner_receivable_sent),
      order_id: (+row.id),
      user_name: row.user_name,
      link: { url: `/items/${row.item_id}`, label: row.item_name },
      start_date: moment(row.start_date).format(Constant.DATE_FORMAT),
      end_date: moment(row.end_date).format(Constant.DATE_FORMAT),
      total_price: `$${Number(+row.total_price).toFixed(2)}`,
      security_amount: `$${Number(+row.security_amount).toFixed(2)}`,
      renter_security_deposit_amount: `$${Number(+row.renter_security_deposit_amount).toFixed(2)}`,
      owner_security_deposit_amount: `$${Number(+row.owner_security_deposit_amount).toFixed(2)}`,
      total_rent: `$${Number(+row.total_rent).toFixed(2)}`,
      cleaning_fee: `$${Number(+row.cleaning_fee).toFixed(2)}`,
      base_rental_amount: `$${Number(+row.base_rental_amount).toFixed(2)}`,
      base_rental_rate_per_day: `$${Number(+row.base_rental_rate_per_day).toFixed(2)}`,
      total_insurance_amount: `$${Number(+row.total_insurance_amount).toFixed(2)}`,
      total_insurance_tax: `$${Number(+row.total_insurance_tax).toFixed(2)}`,
      insurance_rate_per_day: `$${Number(+row.insurance_rate_per_day).toFixed(2)}`,
      brokerfees: `$${Number(+row.brokerfees).toFixed(2)}`,
      roadside_assistance_fee: `$${Number(+row.roadside_assistance_fee).toFixed(2)}`,
      is_roadside_assistance_required: row.is_roadside_assistance_required === 'Y' ? 'Yes' : 'No',
      discount_price: `$${Number(+row.discount_price).toFixed(2)}`,
      coupon_code: row.coupon_code,
      owner_receivable: { label: `$${Number(+row.owner_receivable).toFixed(2)}`, value: row.owner_receivable, func: onUpdateAmount },
      payoption: row.payoption,
      pickup_photos: getPhotoCell(row.pickup_photos, 'pickup', +row.is_pickup_photos_confirmed),
      return_photos: getPhotoCell(row.return_photos, 'return', +row.is_return_photos_confirmed),
      status1: getStatusText(+row.status, row.start_date, row.is_released_security_deposit, row.is_owner_receivable_sent, row.is_rental_completed),
      is_test_booking: row.is_test_booking === 'Y' ? 'Yes' : 'No',
      created: moment(row.created).format(Constant.DATE_FORMAT),
    })));
  }, [allData, pageType]);

  const getStatusText = (status, start_date, is_released_security_deposit, is_owner_receivable_sent, is_rental_completed) => {
    if(status === Constant.TRANSACTION_STATUS_PENDING) {
      return 'Pending';
    } else if (status === Constant.TRANSACTION_STATUS_COMPLETED && is_owner_receivable_sent === 'N') {
      if (moment(start_date).isBefore(moment())) {
        return 'Waiting For Item Pick Up';
      } else {
        return 'Booked';
      }
    } else if ((status === Constant.TRANSACTION_STATUS_COMPLETED
      || status === Constant.TRANSACTION_STATUS_BUYER_RECEIVED)
      && is_owner_receivable_sent === 'Y'
      && is_released_security_deposit === 'N') {
      return 'Rent Amount Released';
    } else if (status === Constant.TRANSACTION_STATUS_CANCEL) {
      return 'Cancelled';
    } else if (status === Constant.TRANSACTION_STATUS_DISPUTES) {
      return 'Disputed';
    } else if (status === Constant.TRANSACTION_STATUS_SELLER_RECEIVED
      && is_released_security_deposit === 'N'
      && is_owner_receivable_sent === 'N'
      && is_rental_completed === 'N') {
      return 'Owner Received Item';
    } else if (status === Constant.TRANSACTION_STATUS_BUYER_RECEIVED
      && is_owner_receivable_sent === 'N') {
      return 'Renter Received Item';
    } else if ((status === Constant.TRANSACTION_STATUS_COMPLETED
      || status === Constant.TRANSACTION_STATUS_BUYER_RECEIVED)
      && is_owner_receivable_sent === 'Y'
      && is_released_security_deposit === 'Y') {
      return 'Security Deposit Released';
    } else if ((status === Constant.TRANSACTION_STATUS_RELEASE_SECURITY_DEPOSIT
      || status === Constant.TRANSACTION_STATUS_SELLER_RECEIVED)
      && ((is_released_security_deposit === 'Y'
      && is_owner_receivable_sent === 'Y')
      || is_rental_completed === 'Y')) {
      return 'Rental Completed';
    }
    return '';
  }

  const getPhotoCell = (value, type, is_photos_confirmed) => {
    if (!value) {
      return {
        label: 'No photos uploaded yet',
      };
    }

    // NOTE: photo is like `s:16:"440-3-pickup.png"`
    const photos = value.split(';')
      .filter(item => item.startsWith('s:16:'))
      .map(item => item.substring(6, item.length - 1));

    const menus = is_photos_confirmed === 1 ? [{ label: 'Declined' }]
      : is_photos_confirmed === 2 ? [{ label: 'Accepted' }]
      : [{ type, label: 'Decline', func: onDeclinePhoto },
        { type, label: 'Accept', func: onAcceptPhoto }];

    return { photos, menus };
  }

  const getCustomMenus = (status, security_amount, is_released_security_deposit, is_owner_receivable_sent) => {
    let menus = [0, 1];

    // if ((((status === Constant.TRANSACTION_STATUS_COMPLETED
    //   || status === Constant.TRANSACTION_STATUS_BUYER_RECEIVED
    //   || status === Constant.TRANSACTION_STATUS_RENT_AMOUNT_RELEASE)
    //   && is_released_security_deposit === 'N')
    //   || status === Constant.TRANSACTION_STATUS_DISPUTES)
    //   && security_amount > 0
    //   && status !== Constant.TRANSACTION_STATUS_SELLER_BUYER_AGREE) {
    //   menus = [...menus, 2];
    // }
    
    const is_security = is_released_security_deposit === 'N' && security_amount > 0;

    if (is_security) {
      menus = [...menus, 2];
    }

    if (status === Constant.TRANSACTION_STATUS_CANCEL) {
      menus = [...menus, 3];
    }

    if (is_security) {
      menus = [...menus, 4];
    }

    if (is_released_security_deposit === 'N' || is_owner_receivable_sent === 'N') {
      menus = [...menus, 5];
    }

    return [...menus, 6, 7];
  }

  const onUpdateAmount = (id, amount) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setEditAmount(amount);
      setOpenEdit(true);
    }
  }

  const handleUpdateAmountSuccess = () => {
    setOpenEdit(false);
    setReload(!reload);
  }

  const onAcceptPhoto = (id, type) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setPhotoType(type);
      setConfirmTitle('Accept');
      setConfirmText('Are you sure to accept photos?');
      setConfirmType(CONFIRM_TYPE_ACCEPT_PHOTO);
      setOpenConfirm(true);
    }
  }

  const onDeclinePhoto = (id, type) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setPhotoType(type);
      setConfirmTitle('Accept');
      setConfirmText('Are you sure to decline photos?');
      setConfirmType(CONFIRM_TYPE_DECLINE_PHOTO);
      setOpenConfirm(true);
    }
  }

  const handlePhotos = (type, status) => {
    APIHandler.adminBookingPhotoStatus(rowData.id, type, status).then(data => {
      if (data.result === 'true') {
        setReload(!reload);
        toast.success(`Photos are ${status === 2 ? 'Accepted' : 'Declined'}`);
      } else {
        toast.error('Photo update failed');
      }
    });
  }

  const onReleaseRentToOwner = (id) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle('Release Rent to Owner');
      setConfirmText('Are you sure to release rent to owner?');
      setConfirmType(CONFIRM_TYPE_RELEASE_RENT_TO_OWNER);
      setOpenConfirm(true);
    }
  }
  
  const onReleaseToOwnerW = (id) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle('Release to owner w/ no transfer group');
      setConfirmText('Are you sure to release to owner w/ no transfer group?');
      setConfirmType(CONFIRM_TYPE_RELEASE_TO_OWNER_W);
      setOpenConfirm(true);
    }
  }

  const OnRefundSecurityDepositBuyer = (id) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle('Security deposit release to Renter');
      setConfirmText('Are you sure to security deposit release to Renter?');
      setConfirmType(CONFIRM_TYPE_REFUND_SECURITY_DEPOSIT_BUYER);
      setOpenConfirm(true);
    }
  }

  const onTotalAmountBuyer = (id) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle('Release Full Amount to Renter');
      setConfirmText('Are you sure to release Full Amount to Renter?');
      setConfirmType(CONFIRM_TYPE_TOTAL_AMOUNT_BUYER);
      setOpenConfirm(true);
    }
  }

  const onSecurityDepositDistribution = (id) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setOpenDeposit(true);
    }
  }

  const handleSecurityDepositDistribution = () => {
    setOpenDeposit(false);
    setReload(!reload);
  }

  const onFullyPaidOverride = (id) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle('Set To Fully Paid Override');
      setConfirmText('Are you sure you want to set booking to fully paid out for both owner and renter?');
      setConfirmType(CONFIRM_TYPE_FULLY_PAID_OVERRIDE);
      setOpenConfirm(true);
    }
  }

  const handleFullyPaidOverride = () => {
    APIHandler.adminBookingFullPaid(rowData.id).then(data => {
      if (data.result === 'true') {
        setReload(!reload);
        toast.success(`Set to full paid has been successfully for booking id: ${rowData.id}`);
      } else {
        toast.error(data?.error ? data?.error : "Booking id is not available");
      }
    });
  }
  
  const handleReleaseRental = (without_transfer_group) => {
    APIHandler.adminBookingReleaseRental(rowData.id, RentAmountRelease, without_transfer_group).then(data => {
      console.log(data)
      if (data.result === 'true') {
        setReload(!reload);
        toast.success(`Set to full paid has been successfully for booking id: ${rowData.id}`);
      } else {
        toast.error(data?.error ? data?.error : "Booking id is not available");
      }
    });
  }

  const handleRefundSecurityDepositBuyer = () => {
    APIHandler.adminBookingRefundDeposit(rowData.id, ReleaseSecurityDeposit).then(data => {
      if (data.result === 'true') {
        setReload(!reload);
        toast.success(`Set to full paid has been successfully for booking id: ${rowData.id}`);
      } else {
        toast.error(data?.error ? data?.error : "Booking id is not available");
      }
    });
  }

  const handleTotalAmountBuyer = () => {
    APIHandler.adminBookingTotalAmount(rowData.id, Decline).then(data => {
      if (data.result === 'true') {
        setReload(!reload);
        toast.success(`Set to full paid has been successfully for booking id: ${rowData.id}`);
      } else {
        toast.error(data?.error ? data?.error : "Booking id is not available");
      }
    });
  }

  const onResendCheckoutEmail = (id) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle('Resend Checkout Email');
      setConfirmText('Are you sure you want to resend checkout email?');
      setConfirmType(CONFIRM_TYPE_RESEND_CHECKOUT_EMAIL);
      setOpenConfirm(true);
    }
  }

  const onPullTransferInformation = (id) => {
    const data = allData.filter(e => (+e.id) === id);
    if (data.length === 1) {
      setRowData(data[0]);
      setConfirmTitle('Pull Transfer Information');
      setConfirmText('Are you sure you want to pull Transfer Information?');
      setConfirmType(CONFIRM_TYPE_PULL_TRANSFER_INFORMATION);
      setOpenConfirm(true);
    }
  }

  const handleResendEmail = () => {
    APIHandler.adminBookingResendEmail(rowData.id).then(data => {
      if (data.result === 'true') {
        toast.success(`Checkout email resent successfully for booking id: ${rowData.id}`);
      } else {
        toast.error(data.error);
      }
    });
  }

  const handlePullInformation = () => {
    APIHandler.adminBookingPullInformation(rowData.id).then(data => {
      if (data.result === 'true') {
        toast.success(`Checkout email resent successfully for booking id: ${rowData.id}`);
      } else {
        toast.error(data.error);
      }
    });
  }

  const onConfirmModal = () => {
    setOpenConfirm(false);
    if (confirmType === CONFIRM_TYPE_ACCEPT_PHOTO) {
      handlePhotos(photoType, 2);
    } else if (confirmType === CONFIRM_TYPE_DECLINE_PHOTO) {
      handlePhotos(photoType, 1);
    } else if (confirmType === CONFIRM_TYPE_RELEASE_RENT_TO_OWNER) {
      handleReleaseRental(0);
    } else if (confirmType === CONFIRM_TYPE_RELEASE_TO_OWNER_W) {
      handleReleaseRental(1);
    } else if (confirmType === CONFIRM_TYPE_REFUND_SECURITY_DEPOSIT_BUYER) {
      handleRefundSecurityDepositBuyer();
    } else if (confirmType === CONFIRM_TYPE_TOTAL_AMOUNT_BUYER) {
      handleTotalAmountBuyer();
    } else if (confirmType === CONFIRM_TYPE_FULLY_PAID_OVERRIDE) {
      handleFullyPaidOverride();
    } else if (confirmType === CONFIRM_TYPE_RESEND_CHECKOUT_EMAIL) {
      handleResendEmail();
    } else if (confirmType === CONFIRM_TYPE_PULL_TRANSFER_INFORMATION) {
      handlePullInformation();
    }
  }

  const onChangePage = (e) => {
    setPageType(+e.target.value);
  }

  const CUSTOM_MENUS = [
    { icon: 'none', label: 'Release Rent to Owner', func: onReleaseRentToOwner },
    { icon: 'none', label: 'Release to owner w/ no transfer group', func: onReleaseToOwnerW },
    { icon: 'none', label: 'Security deposit release to Renter', func: OnRefundSecurityDepositBuyer },
    { icon: 'none', label: 'Release Full Amount to Renter', func: onTotalAmountBuyer },
    { icon: 'none', label: 'Security Deposit Distribution', func: onSecurityDepositDistribution },
    { icon: 'none', label: 'Set To Fully Paid Override', func: onFullyPaidOverride },
    { icon: 'none', label: 'Resend Checkout Email', func: onResendCheckoutEmail },
    { icon: 'none', label: 'Pull Transfer Information', func: onPullTransferInformation },
  ];

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Booking Management</h2>
        <div className="d-flex justify-content-end">
          <select
            className="form-select fw-400 fs-0p875 oxford-blue app-form-control"
            style={{ width: 240 }}
            onChange={onChangePage}
          >
            {PAGE_TYPES.map(field => (
              <option key={`field-${field.id}`} value={field.id}>{field.label}</option>
            ))}
          </select>
        </div>
      </div>
      <TableInstance
        headLabels={TABLE_HEAD}
        tableData={tableData}
        customMenus={CUSTOM_MENUS}
        firstColType={Constant.TABLE_FIRST_COL_NUM}
        loading={loading}
        message={message}
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
      <EditSecurityDepositModal
        open={openDeposit}
        onClose={() => setOpenDeposit(false)}
        id={rowData?.id}
        amount={rowData?.security_amount}
        onSuccess={handleSecurityDepositDistribution}
      />
      <EditAmountModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSuccess={handleUpdateAmountSuccess}
        id={rowData?.id}
        amount={editAmount}
      />
    </div>
  );
};

export default AdminBookings;
