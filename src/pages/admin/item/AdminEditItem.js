import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoArrowBack } from 'react-icons/io5';
import moment from 'moment';

import AppSpinner from '../../../components/loading/AppSpinner';
import AppCheckbox from '../../../components/elements/AppCheckbox';
import PlaceAutocomplete from '../../host/PlaceAutocomplete';
import { parseAddress } from '../../../utils/stringUtils';
import * as APIHandler from '../../../apis/APIHandler';
import * as Constant from '../../../constants/constant';

const EditItem = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [itemData, setItemData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allMakes, setAllMakes] = useState([]);
  const [makeList, setMakeList] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [address, setAddress] = useState('');
  const [hasAddress, setHasAddress] = useState(true);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [weekendUpcharge, setWeekendUpcharge] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isView, setIsView] = useState(false);

  useEffect(() => {
    setIsView(pathname.includes('view'));
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;
    APIHandler.getCategories().then(data => {
      if (isMounted) {
        setCategories(data);
      }
    });

    APIHandler.getMakeList().then(data => {
      if (isMounted) {
        setAllMakes(data);
      }
    });

    APIHandler.getModelList().then(data => {
      if (isMounted) {
        setAllModels(data);
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (allMakes.length === 0 || allModels.length === 0 || itemData) {
      return;
    }

    let isMounted = true;

    setLoading(true);
    APIHandler.getItemDetails(id).then(data => {
      if (isMounted) {
      setLoading(false);
        if (data.length !== 1) {
          return;
        }
        setItemData(data[0]);
        setLatitude(data[0].latitude);
        setLongitude(data[0].longitude);
        setStreet(data[0].street);
        setCity(data[0].city);
        setState(data[0].state);
        setZipCode(data[0].zipcode);
        setCountry('US');
        setAddress(`${data[0].street}, ${data[0].city}, ${data[0].state}, USA`);
        setWeekendUpcharge(data[0].weekend_upcharge);
        setMakeList(allMakes.filter((item) => item.category_id === data[0].category_id));
        setModelList(allModels.filter((item) => item.make_id === data[0].make));
      }
    });
    return () => { isMounted = false; };
  }, [id, itemData, allMakes, allModels]);

  const onBack = () => {
    navigate('/admin/items');
  }

  const onSendMail = () => {
    setLoading(true);
    APIHandler.adminEmailItem(itemData.user_id).then(data => {
      if (data.result === 'true') {
        toast.success('Email has been sent');
      } else {
        toast.error('Email is not sent. Please check this user details');
      }
      setLoading(false);
    });
  }

  const onSaveRecord = (values) => {
    if (country !== 'US') {
      toast.error('Can\'t select the place outside of US');
      return;
    }

    const json = { ...values, availabile: moment(values.availabile).format(Constant.DATE_SAVE_FORMAT), id, latitude, longitude, weekend_upcharge: weekendUpcharge };
    setLoading(true);
    APIHandler.adminEditItem(json).then(data => {
      if (data.result === 'true') {
        toast.success("Record has been updated successfully");
        navigate('/admin/items');
      } else {
        toast.error("Record has not been updated");
      }
      setLoading(false);
    });
  }

  const formik = useFormik({
    initialValues: {
      category_id: itemData?.category_id ?? '',
      make: itemData?.make ?? '',
      model: itemData?.model ?? '',
      year: itemData?.year ?? '',
      name: itemData?.name ?? '',
      vin_no: itemData?.vin_no ?? '',
      insurance_rate_per_day: itemData?.insurance_rate_per_day ?? '',
      insurance_tax_rate_per_day: itemData?.insurance_tax_rate_per_day ?? '',
      base_user_rent_per_day: itemData?.base_user_rent_per_day ?? '',
      base_user_rent_per_week: itemData?.base_user_rent_per_week ?? '',
      base_user_rent_per_weekend: itemData?.base_user_rent_per_weekend ?? '',
      rent_per_day: itemData?.rent_per_day ?? '',
      rent_per_week: itemData?.rent_per_week ?? '',
      rent_per_weekend: itemData?.rent_per_weekend ?? '',
      security_deposit: itemData?.security_deposit ?? '',
      ach: itemData?.ach ?? '',
      cleaning_fee: itemData?.cleaning_fee ?? '',
      guest: itemData?.guest ?? '',
      feet: itemData?.feet ?? '',
      weight: itemData?.weight ?? '',
      hitch_weight: itemData?.hitch_weight ?? '',
      availabile: itemData?.availabile ? moment(itemData.availabile).format(Constant.DATE_FORMAT) : '',
      street: street ?? '',
      city: city ?? '',
      state: state ?? '',
      zipcode: zipcode ?? '',
      cancelation_policy: itemData?.cancelation_policy ?? '',
      description: itemData?.description ?? '',
      condition_details: itemData?.condition_details ?? '',
      status: itemData?.status ?? 1,
    },
    validationSchema: Yup.object({
      category_id: Yup.string().required('Required'),
      make: Yup.string().required('Required'),
      model: Yup.string().required('Required'),
      year: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      vin_no: Yup.string().required('Required'),
      insurance_rate_per_day: Yup.number().required('Required'),
      insurance_tax_rate_per_day: Yup.number().required('Required'),
      base_user_rent_per_day: Yup.number().required('Required'),
      base_user_rent_per_week: Yup.number().required('Required'),
      rent_per_day: Yup.number().required('Required'),
      rent_per_week: Yup.number().required('Required'),
      security_deposit: Yup.number().required('Required'),
      ach: Yup.number().required('Required'),
      cleaning_fee: Yup.number().required('Required'),
      guest: Yup.number().required('Required'),
      availabile: Yup.string().required('Required'),
      street: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      zipcode: Yup.number().required('Required'),
      cancelation_policy: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      status: Yup.string().required('Required'),
    }),
    enableReinitialize: true,
    onSubmit: values => {
      onSaveRecord(values);
    },
  });

  const renderVehicleInfo = () => {
    const onSelectCategory = (e) => {
      formik.handleChange(e);
      setMakeList(allMakes.filter((item) => item.category_id === (+e.target.value)));
      formik.setFieldValue('make', '');
      formik.setFieldValue('model', '');
    }

    const onSelectMake = (e) => {
      formik.handleChange(e);
      setModelList(allModels.filter((item) => item.make_id === (+e.target.value)));
      formik.setFieldValue('model', '');
    }

    return (
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="categoryid" className="form-label fw-400 fs-1p0 dark-gray">Category *</label>
          <select
            id="category_id"
            value={formik.values.category_id}
            disabled={loading || isView}
            onChange={onSelectCategory}
            onBlur={formik.handleBlur}
            className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.category_id && formik.errors.category_id && "app-form-error"}`}
          >
            <option value="" hidden>Select Category</option>
            {categories.map((item) => (
              <option key={`category-${item.id}`} value={item.id}>{item.name}</option>
            ))}
          </select>
          {formik.touched.category_id && formik.errors.category_id &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.category_id}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="make" className="form-label fw-400 fs-1p0 dark-gray">Make *</label>
          <select
            id="make"
            value={formik.values.make}
            disabled={loading || isView}
            onChange={onSelectMake}
            onBlur={formik.handleBlur}
            className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.make && formik.errors.make && "app-form-error"}`}
          >
            <option value="" hidden>Select Make</option>
            {makeList.map((item) => (
              <option key={`make-${item.id}`} value={item.id}>{item.name}</option>
            ))}
          </select>
          {formik.touched.make && formik.errors.make &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.make}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="model" className="form-label fw-400 fs-1p0 dark-gray">Model *</label>
          <select
            id="model"
            value={formik.values.model}
            disabled={loading || isView}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.model && formik.errors.model && "app-form-error"}`}
          >
            <option value="" hidden>Select Model</option>
            {modelList.map((item) => (
              <option key={`model-${item.id}`} value={item.id}>{item.name}</option>
            ))}
          </select>
          {formik.touched.model && formik.errors.model &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.model}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="name" className="form-label fw-500 fs-1p0 dark-gray">Item Name *</label>
          <input
            type="text"
            id="name"
            disabled={loading || isView}
            placeholder="ex. Volkswagen Golf 2012"
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.name && formik.errors.name && "app-form-error"}`}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.name}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="year" className="form-label fw-400 fs-1p0 dark-gray">Year *</label>
          <select
            id="year"
            value={formik.values.year}
            disabled={loading || isView}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.year && formik.errors.year && "app-form-error"}`}
          >
            <option value="" hidden>Select Vehicle Year</option>
            {Constant.PRODUCT_YEARS.map((item) => (
              <option key={`year-${item}`} value={item}>{item}</option>
            ))}
          </select>
          {formik.touched.year && formik.errors.year &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.year}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="vin_no" className="form-label fw-400 fs-1p0 dark-gray">VIN/NULL Number *</label>
          <input
            type="text"
            id="vin_no"
            disabled={loading || isView}
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.vin_no && formik.errors.vin_no && "app-form-error"}`}
            value={formik.values.vin_no}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.vin_no && formik.errors.vin_no &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.vin_no}</span>
          }
        </div>
      </div>
    );
  }

  const renderInsuranceSection = () => {
    return (
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="insurance_rate_per_day" className="form-label fw-500 fs-1p0 dark-gray">Insurance Rate *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="insurance_rate_per_day"
              disabled={loading || isView}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.insurance_rate_per_day && formik.errors.insurance_rate_per_day && "app-form-error"}`}
              value={formik.values.insurance_rate_per_day}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.insurance_rate_per_day && formik.errors.insurance_rate_per_day &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.insurance_rate_per_day}</div>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="insurance_tax_rate_per_day" className="form-label fw-500 fs-1p0 dark-gray">Insurance Tax Rate *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="insurance_tax_rate_per_day"
              disabled={true}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.insurance_tax_rate_per_day && formik.errors.insurance_tax_rate_per_day && "app-form-error"}`}
              value={formik.values.insurance_tax_rate_per_day}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.insurance_tax_rate_per_day && formik.errors.insurance_tax_rate_per_day &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.insurance_tax_rate_per_day}</div>
          }
        </div>
      </div>
    );
  }

  const renderPriceSection = () => {
    return (
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="base_user_rent_per_day" className="form-label fw-500 fs-1p0 dark-gray">Base Rent Per Day *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="base_user_rent_per_day"
              disabled={loading || isView}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.base_user_rent_per_day && formik.errors.base_user_rent_per_day && "app-form-error"}`}
              value={formik.values.base_user_rent_per_day}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.base_user_rent_per_day && formik.errors.base_user_rent_per_day &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.base_user_rent_per_day}</div>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="base_user_rent_per_week" className="form-label fw-500 fs-1p0 dark-gray">Base Rent Per Week *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="base_user_rent_per_week"
              disabled={loading || isView}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.base_user_rent_per_week && formik.errors.base_user_rent_per_week && "app-form-error"}`}
              value={formik.values.base_user_rent_per_week}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.base_user_rent_per_week && formik.errors.base_user_rent_per_week &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.base_user_rent_per_week}</div>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="base_user_rent_per_weekend" className="form-label fw-500 fs-1p0 dark-gray">Base Rent Per Weekend</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="base_user_rent_per_weekend"
              disabled={loading || isView}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.base_user_rent_per_weekend && formik.errors.base_user_rent_per_weekend && "app-form-error"}`}
              value={formik.values.base_user_rent_per_weekend}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.base_user_rent_per_weekend && formik.errors.base_user_rent_per_weekend &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.base_user_rent_per_weekend}</div>
          }
          <div className="mt-2">
            <AppCheckbox
              label="Rate for Holidays and Weekends"
              labelClassName="fw-400 fs-0p875 gray-36 ms-2"
              size={14}
              disabled={loading || isView}
              checked={weekendUpcharge}
              onChange={setWeekendUpcharge}
            />
          </div>
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="rent_per_day" className="form-label fw-500 fs-1p0 dark-gray">Total Rent Per Day *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="rent_per_day"
              disabled={true}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.rent_per_day && formik.errors.rent_per_day && "app-form-error"}`}
              value={formik.values.rent_per_day}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.rent_per_day && formik.errors.rent_per_day &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.rent_per_day}</div>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="rent_per_week" className="form-label fw-500 fs-1p0 dark-gray">Total Rent Per Week *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="rent_per_week"
              disabled={true}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.rent_per_week && formik.errors.rent_per_week && "app-form-error"}`}
              value={formik.values.rent_per_week}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.rent_per_week && formik.errors.rent_per_week &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.rent_per_week}</div>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="rent_per_weekend" className="form-label fw-500 fs-1p0 dark-gray">Total Rent Per Weekend</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="rent_per_weekend"
              disabled={true}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.rent_per_weekend && formik.errors.rent_per_weekend && "app-form-error"}`}
              value={formik.values.rent_per_weekend}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.rent_per_weekend && formik.errors.rent_per_weekend &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.rent_per_weekend}</div>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="security_deposit" className="form-label fw-500 fs-1p0 dark-gray">Security Deposit *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="security_deposit"
              disabled={loading || isView}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.security_deposit && formik.errors.security_deposit && "app-form-error"}`}
              value={formik.values.security_deposit}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.security_deposit && formik.errors.security_deposit &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.security_deposit}</div>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="ach" className="form-label fw-500 fs-1p0 dark-gray">Actual Cash Value *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="ach"
              disabled={loading || isView}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.ach && formik.errors.ach && "app-form-error"}`}
              value={formik.values.ach}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.ach && formik.errors.ach &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.ach}</div>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="cleaning_fee" className="form-label fw-500 fs-1p0 dark-gray">Cleaning Fee *</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              id="cleaning_fee"
              disabled={loading || isView}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.cleaning_fee && formik.errors.cleaning_fee && "app-form-error"}`}
              value={formik.values.cleaning_fee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.cleaning_fee && formik.errors.cleaning_fee &&
            <div className="fw-300 fs-0p75 red-orange">{formik.errors.cleaning_fee}</div>
          }
        </div>
      </div>
    );
  }

  const renderVehicleAvaility = () => {
    return (
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="guest" className="form-label fw-500 fs-1p0 dark-gray">Maximum People *</label>
          <input
            type="number"
            id="guest"
            disabled={loading || isView}
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.guest && formik.errors.guest && "app-form-error"}`}
            value={formik.values.guest}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.guest && formik.errors.guest &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.guest}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="feet" className="form-label fw-500 fs-1p0 dark-gray">Feet</label>
          <input
            type="text"
            id="feet"
            disabled={loading || isView}
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.feet && formik.errors.feet && "app-form-error"}`}
            value={formik.values.feet}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.feet && formik.errors.feet &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.feet}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="weight" className="form-label fw-500 fs-1p0 dark-gray">Weight</label>
          <input
            type="text"
            id="weight"
            disabled={loading || isView}
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.weight && formik.errors.weight && "app-form-error"}`}
            value={formik.values.weight}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.weight && formik.errors.weight &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.weight}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="hitch_weight" className="form-label fw-500 fs-1p0 dark-gray">Hitch Weight</label>
          <input
            type="text"
            id="hitch_weight"
            disabled={loading || isView}
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.hitch_weight && formik.errors.hitch_weight && "app-form-error"}`}
            value={formik.values.hitch_weight}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.hitch_weight && formik.errors.hitch_weight &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.hitch_weight}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="available" className="form-label fw-500 fs-1p0 dark-gray">Availability *</label>
          <input
            type="text"
            id="availabile"
            disabled={loading || isView}
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.availabile && formik.errors.availabile && "app-form-error"}`}
            value={formik.values.availabile}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.availabile && formik.errors.availabile &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.availabile}</span>
          }
        </div>
      </div>
    );
  }

  const renderLocation = () => {
    const handleAddress = (address) => {
      const { street, city, state, zipcode } = parseAddress(address);
      formik.setFieldValue('street', street);
      formik.setFieldValue('city', city);
      formik.setFieldValue('state', state);
      formik.setFieldValue('zipcode', zipcode);
      setHasAddress(street !== '' && city !== '' && state !== '' && zipcode !== '');
    }

    const handleCoordinates = ({ lat, lng }) => {
      setLatitude(lat);
      setLongitude(lng);
    }

    return (
      <div className="mt-4">
        <div className="col-lg-6 mt-3">
          <span className="fw-400 fs-1p0 dark-gray">Address</span>
          <PlaceAutocomplete
            getAddress={handleAddress}
            getCoordinates={handleCoordinates}
            disabled={loading || isView}
            text={address}
          />
        </div>
        <div className="row">
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="street" className="form-label fw-400 fs-1p0 dark-gray">Street *</label>
            <input
              type="text"
              id="street"
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${!hasAddress && formik.values.street === '' && "app-form-error"}`}
              value={formik.values.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={true}
            />
            {!hasAddress && formik.values.street === '' &&
              <span className="fw-300 fs-0p75 red-orange">Required</span>
            }
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="street" className="form-label fw-400 fs-1p0 dark-gray">City *</label>
            <input
              type="text"
              id="city"
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${!hasAddress && formik.values.city === '' && "app-form-error"}`}
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={true}
            />
            {!hasAddress && formik.values.city === '' &&
              <span className="fw-300 fs-0p75 red-orange">Required</span>
            }
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="state" className="form-label fw-400 fs-1p0 dark-gray">State *</label>
            <input
              type="text"
              id="state"
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${!hasAddress && formik.values.state === '' && "app-form-error"}`}
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={true}
            />
            {!hasAddress && formik.values.state === '' &&
              <span className="fw-300 fs-0p75 red-orange">Required</span>
            }
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="zipcode" className="form-label fw-400 fs-1p0 dark-gray">Zip *</label>
            <input
              type="text"
              id="zipcode"
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${!hasAddress && formik.values.zipcode === '' && "app-form-error"}`}
              value={formik.values.zipcode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={true}
            />
            {!hasAddress && formik.values.zipcode === '' &&
              <span className="fw-300 fs-0p75 red-orange">Required</span>
            }
          </div>
        </div>
      </div>
    );
  }

  const renderPolicy = () => {
    return (
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="cancelation_policy" className="form-label fw-500 fs-1p0 dark-gray">Cancelation Policy *</label>
          <input
            type="text"
            id="cancelation_policy"
            disabled={loading || isView}
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.cancelation_policy && formik.errors.cancelation_policy && "app-form-error"}`}
            value={formik.values.cancelation_policy}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.cancelation_policy && formik.errors.cancelation_policy &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.cancelation_policy}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="description" className="form-label fw-500 fs-1p0 dark-gray">Contents *</label>
          <textarea
            id="description"
            row="3"
            disabled={loading || isView}
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.description && formik.errors.description && "app-form-error"}`}
            style={{ height: "90px"}}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.description}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="condition_details" className="form-label fw-500 fs-1p0 dark-gray">Condition</label>
          <textarea
            id="condition_details"
            row="3"
            disabled={loading || isView}
            placeholder=""
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.condition_details && formik.errors.condition_details && "app-form-error"}`}
            style={{ height: "90px"}}
            value={formik.values.condition_details}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.condition_details && formik.errors.condition_details &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.condition_details}</span>
          }
        </div>
      </div>
    );
  }

  const renderActiveSection = () => {
    return (
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="status" className="form-label fw-400 fs-1p0 dark-gray">Status *</label>
          <select
            id="status"
            value={formik.values.status}
            disabled={loading || isView}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.status && formik.errors.status && "app-form-error"}`}
          >
            <option value={1}>Active</option>
            <option value={0}>Deactive</option>
          </select>
          {formik.touched.status && formik.errors.status  &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.status}</span>
          }
        </div>
      </div>
    );
  }

  const renderViewOption = () => {
    return (
      <div className="row">
        <div className="col-md-4 mt-3">
          <label className="fw-400 fs-1p0 dark-gray me-3">Status:</label>
          <span
            className="fw-400 fs-0p75 white border-12 px-3 py-1"
            style={{
              backgroundColor: (+itemData?.status) === 1 ? "#5cb85c" : "#f0ad4e",
            }}
          >{itemData?.status === 1 ? "Active" : "Deactive"}</span>
        </div>
        <div className="col-md-4 mt-3">
          <label className="fw-400 fs-1p0 dark-gray me-3">Created:</label>
          <span className="fw-400 fs-1p0 oxford-blue">{itemData?.created ? moment(itemData.created).format(Constant.DATE_FORMAT) : ""}</span>
        </div>
        <div className="col-md-4 mt-3">
          <label className="fw-400 fs-1p0 dark-gray me-3">Modified:</label>
          <span className="fw-400 fs-1p0 oxford-blue">{itemData?.modified ? moment(itemData.modified).format(Constant.DATE_FORMAT) : ""}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid position-relative px-4 py-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="fw-600 fs-1p25 midnight">Item Management</h2>
      </div>
      <div className="d-flex align-items-center gap-2 my-3">
        <Link to="/admin/items">
          <IoArrowBack className="fs-1p25 midnight" />
        </Link>
        <span className="fw-500 fs-1p125 midnight">Item {isView ? "Detail" : "Edit"}</span>
      </div>
      <div className="app-container">
        <form onSubmit={formik.handleSubmit}>
          {renderVehicleInfo()}
          {renderInsuranceSection()}
          {renderPriceSection()}
          {renderVehicleAvaility()}
          {renderLocation()}
          {renderPolicy()}
          {isView ? renderViewOption() : renderActiveSection()}
          <div className="d-flex align-items-center gap-3 my-4">
            {!isView &&
              <button
                type="submit"
                className="btn btn-app-primary fw-400 fs-1p0 white px-3"
                disabled={loading}
              >Submit</button>
            }
            <button
              type="button"
              className="btn btn-outline-app-primary fw-400 fs-1p0 white px-3"
              disabled={loading}
              onClick={onBack}
            >{isView ? "Back" : "Cancel"}</button>
            {!isView &&
              <button
                type="button"
                className="btn btn-outline-app-primary fw-400 fs-1p0 white px-3"
                disabled={loading}
                onClick={onSendMail}
              >Send Email</button>
            }
          </div>
        </form>
      </div>
      {loading && <AppSpinner absolute />}
    </div>
  );
};

export default EditItem;
