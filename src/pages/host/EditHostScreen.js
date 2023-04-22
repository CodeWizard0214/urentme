import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Geocode from 'react-geocode';
import moment from 'moment';
import { FaCheck } from "react-icons/fa";

import PlaceAutocomplete from './PlaceAutocomplete';
import FeatureSection from './FeatureSection';
import PhotoItem from '../../components/elements/PhotoItem';
import AppCheckbox from '../../components/elements/AppCheckbox';
import AppSpinner from '../../components/loading/AppSpinner';
import SimpleInputModal from './SimpleInputModal';
import ConfirmModal from '../../components/modal/ConfirmModal';
import CircleMark from "../../components/marks/CircleMark";
import * as APIHandler from '../../apis/APIHandler';
import * as Constant from '../../constants/constant';
import * as Color from "../../constants/color";
import { getInsuranceDeposit } from '../../utils/insuranceUtil';
import { parseAddress } from '../../utils/stringUtils';
import { getImageUriFromName } from '../../utils/imageUrl';
import { getImageBase64Data } from '../../utils/imageUtils';
import { getAllItems, getItemImages, getItemFeatures, getItemCourtesies, getWishItems, getUserItems } from '../../store/actions/itemActions';

const EditHostScreen = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, userVerified, allItemImages, allItemFeatures } = props;
  const [isUpdate, setIsUpdate] = useState(false);
  const [itemData, setItemData] = useState({});
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [address, setAddress] = useState('');
  const [hasAddress, setHasAddress] = useState(true);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [categories, setCategories] = useState([]);
  const [allMakes, setAllMakes] = useState([]);
  const [makeList, setMakeList] = useState([]);
  const [allModels, setAllModels] = useState([]);
  const [modelList, setModelList] = useState([]);
  const [features, setFeatures] = useState([]);
  const [initialFeatures, setInitialFeatures] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [insuranceRate, setInsuranceRate] = useState(0);
  const [insuranceTax, setInsuranceTax] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [photoError, setPhotoError] = useState(false);
  const [agreeCancellation, setAgreeCancellation] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isRentBefore, setIsRentBefore] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [addType, setAddType] = useState('');
  const [dependencyId, setDependencyId] = useState('');
  const [showSuccessModal, setShowSuccesseModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    APIHandler.getCategories().then(data => {
      setCategories(data);
    })

    APIHandler.getMakeList().then(data => {
      setAllMakes(data);
    })

    APIHandler.getModelList().then(data => {
      setAllModels(data);
    })

    APIHandler.getAllDepositList().then(data => {
      setDeposits(data);
    });
  }, []);

  useEffect(() => {
    if (id !== 'add') {
      return;
    }

    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      Geocode.setApiKey(Constant.GOOGLE_KEY);
      Geocode.fromLatLng(lat, lng).then((response) => {
        const { street, city, state, zipcode, country } = parseAddress(response.results[0].address_components);
        setStreet(street);
        setCity(city);
        setState(state);
        setZipCode(zipcode);
        setCountry(country);
        setAddress(response.results[0].formatted_address);
      },
      (error) => {
        toast.error(error);
      });
    });
  }, [id]);

  useEffect(() => {
    if (userId === '' || categories.length === 0 || allMakes.length === 0 || allModels.length === 0) {
      return;
    }

    if (id === 'add' && !userVerified) {
      toast.warn('Please verify your phone number and driver license in account profile first');
      navigate('/account');
      return;
    }

    if (id === 'add') {
      setIsUpdate(false);
    } else {
      setIsUpdate(true);
      APIHandler.getItemDetails(id).then(data => {
        if (data?.length !== 1) {
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

        setMakeList(allMakes.filter((item) => item.category_id === data[0].category_id));
        setModelList(allModels.filter((item) => item.make_id === data[0].make));

        const { security_deposit, insurance_rate_per_day, insurance_tax_rate_per_day } = getInsuranceDeposit(data[0].category_id);
        const newdata = deposits.filter(item => (+item.category_id) === data[0].category_id);
        setSecurityDeposit(newdata.length !== 1 ? security_deposit : (+newdata[0].security_deposit));
        setInsuranceRate(newdata.length !== 1 ? insurance_rate_per_day : (+newdata[0].insurance_rate));
        setInsuranceTax(newdata.length !== 1 ? insurance_tax_rate_per_day : (+newdata[0].insurance_tax_rate));
        setIsRentBefore(data[0].is_rented_before === 'Y');
        setAgreeCancellation(true);
        setAgreeTerms(true);
      });
    }
  }, [id, userId, userVerified, categories, allMakes, allModels, deposits, navigate]);

  useEffect(() => {
    if (id !== 'add' && allItemImages.length > 0) {
      const imgs = allItemImages.filter((e) => e.item_id === +id);
      const objs = imgs.map(img => {
        return { fname: img.name, path: getImageUriFromName(img.name) };
      });
      setPhotos(objs);
    }
  }, [id, allItemImages]);

  useEffect(() => {
    if (id !== 'add' && allItemFeatures.length > 0) {
      const itemFeatures = allItemFeatures.filter((e) => e.item_id === (+id));
      const added = itemFeatures.map((e) => e.name);
      setInitialFeatures(added);
    }
  }, [id, allItemFeatures]);

  const formik = useFormik({
    initialValues: {
      street: street ?? '',
      city: city ?? '',
      state: state ?? '',
      zipcode: zipcode ?? '',
      category: itemData.category_id ?? '',
      make: itemData.make ?? '',
      model: itemData.model ?? '',
      year: itemData.year ?? '',
      capacity: itemData.guest ?? 1,
      vin: itemData.vin_no ?? '',
      name: itemData.name ?? '',
      overview: itemData.description ?? '',
      dailyRate: itemData.base_user_rent_per_day ?? 100,
      weeklyRate: itemData.base_user_rent_per_week ?? 700,
      weekendRate: itemData.base_user_rent_per_weekend ?? 100,
      cleanFee: itemData.cleaning_fee ?? 0,
      securityDeposit: 0,
      condition: itemData.condition_details ?? '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      street: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      zipcode: Yup.number().required('Required'),
      category: Yup.string().required('Required'),
      make: Yup.string().required('Required'),
      model: Yup.string().required('Required'),
      year: Yup.string().required('Required'),
      capacity: Yup.number().required('Required'),
      vin: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      overview: Yup.string().required('Required'),
      dailyRate: Yup.number().required('Required'),
      weeklyRate: Yup.number().required('Required'),
      weekendRate: Yup.number().required('Required'),
      cleanFee: Yup.number().required('Required'),
      condition: Yup.string().required('Required'),
    }),
    onSubmit: values => {
      onFinish(values);
    },
  });

  const onFinish = (values) => {
    if (country !== 'US') {
      toast.error('Can\'t select the place outside of US');
      return;
    }

    if (photos.length < 3) {
      toast.error('Please add 3 photos at least!');
      setPhotoError(true);
      return;
    }

    setLoading(true);
    const insurance = insuranceRate + insuranceTax;
    const params = {
      user_id: userId,
      category_id: +values.category,
      name: values.name,
      year: +values.year,
      make: +values.make,
      model: +values.model,
      street: values.street,
      city: values.city,
      state: values.state,
      zipcode: +values.zipcode,
      guest: +values.capacity,
      insurance_rate_per_day: insuranceRate,
      insurance_tax_rate_per_day: insuranceTax,
      weekend_upcharge: 1,
      base_user_rent_per_weekend: +values.weekendRate,
      base_user_rent_per_day: +values.dailyRate,
      base_user_rent_per_week: +values.weeklyRate,
      rent_per_weekend: +values.weekendRate + insurance,
      rent_per_day: +values.dailyRate + insurance,
      rent_per_week: +values.weeklyRate + insurance * 7,
      availabile: isUpdate ? moment(itemData.availabile).format(Constant.DATE_SAVE_FORMAT) : moment(new Date()).format(Constant.DATE_SAVE_FORMAT),
      security_deposit: securityDeposit,
      cancelation_policy: agreeTerms ? 'UrentMe Cancellation Policy' : '',
      cleaning_fee: +values.cleanFee,
      vin_no: values.vin,
      latitude: latitude,
      longitude: longitude,
      description: values.overview,
      modified: moment(new Date()).format(Constant.DATE_SAVE_FORMAT),
      created: isUpdate ? moment(itemData.created).format(Constant.DATE_SAVE_FORMAT) : moment(new Date()).format(Constant.DATE_SAVE_FORMAT),
      ach: 0.0,
      is_rented_before: isRentBefore ? 'Y' : 'N',
      condition_details: formik.values.condition,
    };

    if (!isUpdate) {
      APIHandler.addItem(params).then(data => {
        if (typeof(data) === 'object' && data.length === 1) {
          updateDatabase(data[0]);
        } else {
          toast.error('Fail to add item');
          setLoading(false);
        }
      })
    } else {
      APIHandler.updateItem({item_id: +id, ...params}).then(data => {
        if (typeof(data) === 'object' && data.length === 1) {
          updateDatabase(data[0]);
        } else {
          toast.error('Fail to update item');
          setLoading(false);
        }
      });
    }
  }

  const updateDatabase = async (item_id) => {
    await submitFeatures(item_id);
    await submitImages(item_id);
    setLoading(false);
    setShowSuccesseModal(true);
    // in order to reduce loading time, preload data
    props.getAllItems();
    props.getItemImages();
    props.getItemFeatures();
    props.getItemCourtesies();
    props.getWishItems();
    props.getUserItems(userId);
  }

  const onSuccess = () => {
    setShowSuccesseModal(false);
    navigate('/host');
  }

  const submitFeatures = async (item_id) => {
    if (features.length > 0) {
      for (const feature of features) {
        await APIHandler.addFeature(item_id, feature);
      }
    }
  }

  const submitImages = async (item_id) => {
    for (const idx in photos) {
      if (photos[idx].data) { // upload new image file
        const fname = item_id + '_' + parseInt(new Date().getTime() / 1000).toString() + '_' + idx + '.jpeg';
        await APIHandler.uploadItemImage(item_id, fname, idx === 0 ? 1 : 0, photos[idx].data);
      } else {
        await APIHandler.uploadSimpleItemImage(item_id, photos[idx].fname, idx === 0 ? 'true' : 'false');
      }
    }
  }

  const onAddType = (text) => {
    if (addType === 'Make') {
      APIHandler.getMakeList().then(data => {
        setAllMakes(data);
        setMakeList(data.filter((item) => item.category_id === (+formik.values.category)));
        const cur = data.filter((item) => item.name === text);
        formik.setFieldValue('make', '' + cur[0].id);
      });
    } else if (addType === 'Model') {
      APIHandler.getModelList().then(data => {
        setAllModels(data);
        setModelList(data.filter((item) => item.make_id === (+formik.values.make)));
        const cur = data.filter((item) => item.name === text);
        formik.setFieldValue('model', '' + cur[0].id);
      });
    }
  }

  const renderVehicleInfo = () => {
    const onSelectCategory = (e) => {
      formik.handleChange(e);
      setMakeList(allMakes.filter((item) => item.category_id === (+e.target.value)));
      formik.setFieldValue('make', '');
      const { security_deposit, insurance_rate_per_day, insurance_tax_rate_per_day } = getInsuranceDeposit(+e.target.value);
      const newdata = deposits.filter(item => (+item.category_id) === (+e.target.value));
      setSecurityDeposit(newdata.length !== 1 ? security_deposit : (+newdata[0].security_deposit));
      setInsuranceRate(newdata.length !== 1 ? insurance_rate_per_day : (+newdata[0].insurance_rate));
      setInsuranceTax(newdata.length !== 1 ? insurance_tax_rate_per_day : (+newdata[0].insurance_tax_rate));
    }
  
    const onSelectMake = (e) => {
      if (e.target.value === '-1') {
        setAddType('Make');
        setDependencyId(formik.values.category);
        setAddModal(true);
      } else {
        formik.handleChange(e);
        setModelList(allModels.filter((item) => item.make_id === (+e.target.value)));
        formik.setFieldValue('model', '');
      }
    }

    const onSelectModel = (e) => {
      if (e.target.value === '-1') {
        setAddType('Model');
        setDependencyId(formik.values.make);
        setAddModal(true);
      } else {
        formik.handleChange(e);
      }
    }

    return (
      <div className="mt-4">
        <div className="fw-600 fs-1p125 black">Vehicle Info</div>
        <div className="fw-400 fs-0p875 gray-36 mt-2">We need some basic info about your vehicle.</div>
        <div className="row">
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="category" className="form-label fw-400 fs-1p0 dark-gray">Vehicle Type *</label>
            <select
              id="category"
              value={formik.values.category}
              required
              disabled={loading}
              onChange={onSelectCategory}
              onBlur={formik.handleBlur}
              className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.category && formik.errors.category && "app-form-error"}`}
            >
              <option value="" hidden>Select Category</option>
              {categories.map((item) => (
                <option key={`category-${item.id}`} value={item.id}>{item.name}</option>
              ))}
            </select>
            {formik.touched.category && formik.errors.category  &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.category}</span>
            }
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="make" className="form-label fw-400 fs-1p0 dark-gray">Make *</label>
            <select
              id="make"
              value={formik.values.make}
              required
              disabled={loading}
              onChange={onSelectMake}
              onBlur={formik.handleBlur}
              className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.make && formik.errors.make && "app-form-error"}`}
            >
              <option value="" hidden>Select Make</option>
              {makeList.map((item) => (
                <option key={`make-${item.id}`} value={item.id}>{item.name}</option>
              ))}
              {formik.values.category && (
                <option value="-1">+ Add Make</option>
              )}
            </select>
            {formik.touched.make && formik.errors.make  &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.make}</span>
            }
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="model" className="form-label fw-400 fs-1p0 dark-gray">Model *</label>
            <select
              id="model"
              value={formik.values.model}
              required
              disabled={loading}
              onChange={onSelectModel}
              onBlur={formik.handleBlur}
              className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.model && formik.errors.model && "app-form-error"}`}
            >
              <option value="" hidden>Select Model</option>
              {modelList.map((item) => (
                <option key={`model-${item.id}`} value={item.id}>{item.name}</option>
              ))}
              {formik.values.category && formik.values.make && (
                <option value="-1">+ Add Model</option>
              )}
            </select>
            {formik.touched.model && formik.errors.model  &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.model}</span>
            }
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="year" className="form-label fw-400 fs-1p0 dark-gray">Year *</label>
            <select
              id="year"
              value={formik.values.year}
              required
              disabled={loading}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-select fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.year && formik.errors.year && "app-form-error"}`}
            >
              <option value="" hidden>Select Vehicle Year</option>
              {Constant.PRODUCT_YEARS.map((item) => (
                <option key={`year-${item}`} value={item}>{item}</option>
              ))}
            </select>
            {formik.touched.year && formik.errors.year  &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.year}</span>
            }
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="capacity" className="form-label fw-400 fs-1p0 dark-gray">Guest Capacity *</label>
            <input
              type="number"
              id="capacity"
              required
              disabled={loading}
              placeholder="Capacity"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.capacity && formik.errors.capacity && "app-form-error"}`}
              value={formik.values.capacity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            { formik.touched.capacity && formik.errors.capacity &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.capacity}</span>
            }
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="vin" className="form-label fw-400 fs-1p0 dark-gray">VIN/NULL Number *</label>
            <input
              type="text"
              id="vin"
              required
              disabled={loading}
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.vin && formik.errors.vin && "app-form-error"}`}
              value={formik.values.vin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            { formik.touched.vin && formik.errors.vin &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.vin}</span>
            }
          </div>
        </div>
      </div>
    )
  };

  const renderLocation = () => {
    const handleAddress = (address) => {
      const { street, city, state, zipcode, country } = parseAddress(address);
      formik.setFieldValue('street', street);
      formik.setFieldValue('city', city);
      formik.setFieldValue('state', state);
      formik.setFieldValue('zipcode', zipcode);
      setCountry(country);
      setHasAddress(street !== '' && city !== '' && state !== '' && zipcode !== '');
    }

    const handleCoordinates = ({ lat, lng }) => {
      setLatitude(lat);
      setLongitude(lng);
    }

    return (
      <>
        <div className="fw-600 fs-1p125 black">Listing address</div>
        <div className="fw-400 fs-0p875 gray-36 mt-2">Location where renters will pick up your vehicle.</div>
        <div className="col-lg-6 mt-3">
          <PlaceAutocomplete
            getAddress={handleAddress}
            getCoordinates={handleCoordinates}
            disabled={loading}
            text={address}
          />
        </div>
        <div className="row">
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="street" className="form-label fw-400 fs-1p0 dark-gray">Street *</label>
            <input
              type="text"
              id="street"
              required
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
              required
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
              required
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
              required
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
      </>
    )
  };

  const renderNameSection = () => (
    <div className="mt-4">
      <div className="fw-600 fs-1p125 black">Name your listing</div>
      <div className="fw-400 fs-0p875 gray-36 mt-2">Feel free to add your listing description, it's best to keep names short and sweet.</div>
      <div className="row">
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="name" className="form-label fw-500 fs-1p0 dark-gray">Listing Name *</label>
          <input
            type="text"
            id="name"
            required
            disabled={loading}
            placeholder="ex. Volkswagen Golf 2012"
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.name && formik.errors.name && "app-form-error"}`}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          { formik.touched.name && formik.errors.name &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.name}</span>
          }
        </div>
        <div className="form-group col-md-4 mt-3">
          <label htmlFor="overview" className="form-label fw-500 fs-1p0 dark-gray">Overview *</label>
          <textarea
            id="overview"
            row="3"
            required
            disabled={loading}
            placeholder="Describe your listing..."
            className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.overview && formik.errors.overview && "app-form-error"}`}
            style={{ height: "90px"}}
            value={formik.values.overview}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          { formik.touched.overview && formik.errors.overview &&
            <span className="fw-300 fs-0p75 red-orange">{formik.errors.overview}</span>
          }
        </div>
      </div>
    </div>
  );

  const renderFeatureSection = () => (
    <div className="mt-4">
      <div className="fw-600 fs-1p125 black">Features</div>
      <FeatureSection
        init={initialFeatures}
        handleFeatures={setFeatures}
        disabled={loading}
      />
    </div>
  );

  const renderPriceSection = () => {
    const insurance = insuranceRate + insuranceTax;

    const onChangeDailyRate = (e) => {
      formik.handleChange(e);
      formik.setFieldValue('weeklyRate', e.target.value * 7);
      formik.setFieldValue('weekendRate', e.target.value);
    }

    return (
      <div className="mt-4">
        <div className="fw-600 fs-1p125 black">Set your price</div>
        <div className="fw-400 fs-0p875 gray-36 mt-2">Each listing rented out through URentMe is fully insured. Each category has a unique insurance rate, which is added on top of the base rental rate per day.</div>
        <div className="row">
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="dailyRate" className="form-label fw-500 fs-1p0 dark-gray">Daily Rate *</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                id="dailyRate"
                required
                disabled={loading}
                placeholder=""
                className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.dailyRate && formik.errors.dailyRate && "app-form-error"}`}
                value={formik.values.dailyRate}
                onChange={onChangeDailyRate}
                onBlur={formik.handleBlur}
              />
            </div>
            { formik.touched.dailyRate && formik.errors.dailyRate &&
              <div className="fw-300 fs-0p75 red-orange">{formik.errors.dailyRate}</div>
            }
            <span className="fw-300 fs-0p75 oxford-blue">Insurance: {insurance.toFixed(2)}</span>
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="weeklyRate" className="form-label fw-500 fs-1p0 dark-gray">Weekly Rate *</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                id="weeklyRate"
                required
                disabled={loading}
                placeholder=""
                className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.weeklyRate && formik.errors.weeklyRate && "app-form-error"}`}
                value={formik.values.weeklyRate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            { formik.touched.weeklyRate && formik.errors.weeklyRate &&
              <div className="fw-300 fs-0p75 red-orange">{formik.errors.weeklyRate}</div>
            }
            <span className="fw-300 fs-0p75 oxford-blue">Insurance: {(insurance * 7).toFixed(2)}</span>
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="weekendRate" className="form-label fw-500 fs-1p0 dark-gray">Weekend/Holiday Rate</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                id="weekendRate"
                required
                disabled={loading}
                placeholder=""
                className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.weekendRate && formik.errors.weekendRate && "app-form-error"}`}
                value={formik.values.weekendRate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            { formik.touched.weekendRate && formik.errors.weekendRate &&
              <div className="fw-300 fs-0p75 red-orange">{formik.errors.weekendRate}</div>
            }
            <span className="fw-300 fs-0p75 oxford-blue">Insurance: {insurance.toFixed(2)}</span>
          </div>
          <div className="form-group col-md-4 mt-3">
            <label htmlFor="cleanFee" className="form-label fw-500 fs-1p0 dark-gray">Cleaning Fee *</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                id="cleanFee"
                required
                disabled={loading}
                placeholder=""
                className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.cleanFee && formik.errors.cleanFee && "app-form-error"}`}
                value={formik.values.cleanFee}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            { formik.touched.cleanFee && formik.errors.cleanFee &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.cleanFee}</span>
            }
          </div>
        </div>
        <div className="fw-600 fs-1p125 black mt-4">Security deposit</div>
        <div className="fw-400 fs-0p875 gray-36 mt-2">Each renter is required to pay a security deposit. This security deposit is held by URentMe at the time of booking in the event there is any damage and/or loss to your Powersports or RV. The default security deposit may be changed before your listing is approved. You may request a higher rate than the default.</div>
        <div className="row col-md-4 mt-3">
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="text"
              required
              readOnly
              placeholder=""
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control`}
              value={securityDeposit}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderPhotoSection = () => {
    const uploadPhoto = (data) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setPhotos([...photos, { path: URL.createObjectURL(data), data: getImageBase64Data(reader.result) }]);
      });
      reader.readAsDataURL(data);
      setPhotoError(false);
    }

    const removePhoto = (path) => {
      setPhotos(photos.filter((e) => e.path !== path));
    }

    return (
      <div className="mt-4">
        <div className="fw-600 fs-1p125 black">Add 3 or more photos</div>
        <div className="fw-400 fs-0p875 gray-36 mt-2 mb-3">Required Insurance Photos: Front, Left, Right and Back sides of vehicle showcasing the condition your vehicle is in.</div>
        <div className="row gap-3" style={{ marginLeft: "0.1rem", marginRight: "0.1rem" }}>
          {photos.map((photo, idx) => (
            <PhotoItem
              key={`photo-${idx}`}
              src={photo.path}
              onRemove={removePhoto}
              loading={loading}
            />
          ))}
          <PhotoItem
            onChange={uploadPhoto}
            error={photoError}
            loading={loading}
          />
        </div>
      </div>
    );
  };

  const renderConditionSection = () => {
    return (
      <div className="mt-4">
        <div className="fw-600 fs-1p125 black">Condition Details *</div>
        <div className="row">
          <div className="form-group col-md-8 col-lg-6 col-xl-4 mt-3">
            <textarea
              id="condition"
              row="3"
              required
              disabled={loading}
              placeholder="Details on the condition of vehicle"
              className={`form-control fw-400 fs-0p875 oxford-blue app-form-control ${formik.touched.condition && formik.errors.condition && "app-form-error"}`}
              style={{ height: "90px"}}
              value={formik.values.condition}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            { formik.touched.condition && formik.errors.condition &&
              <span className="fw-300 fs-0p75 red-orange">{formik.errors.condition}</span>
            }
          </div>
        </div>
      </div>
    );
  };

  const renderAgreeementSection = () => {
    const onChangeRentBefore = (e) => {
      setIsRentBefore(e.currentTarget.value === 'Y');
    }

    return (
      <div className="mt-4">
        <div className="d-flex align-items-center">
          <AppCheckbox
            label="I understand all booking of my item will be subject to"
            labelClassName="fw-400 fs-0p875 gray-36 ms-2"
            checked={agreeCancellation}
            onChange={setAgreeCancellation}
          />
          <Link
            to="/policy/cancelation"
            className="fw-400 fs-0p875 color-primary decoration-none ms-1"
          >UrentMe's Cancellation Policy</Link>
        </div>
        <div className="d-flex align-items-center mt-2">
          <AppCheckbox
            label="I understand all booking of my item will be subject to"
            labelClassName="fw-400 fs-0p875 gray-36 ms-2"
            checked={agreeTerms}
            onChange={setAgreeTerms}
          />
          <Link
            to="/terms"
            className="fw-400 fs-0p875 color-primary decoration-none ms-1"
          >UrentMe's Terms and Conditions Policy</Link>
        </div>
        <div className="form-check mt-2">
          <input className="form-check-input app-form-check" type="radio" name="rental_exp" value="N" id="never_rented" onChange={onChangeRentBefore} checked={!isRentBefore} />
          <label className="fw-400 fs-0p875 gray-36" htmlFor="never_rented">My Vehicle HAS NEVER been rented outside of URentMe's platform and I acknowledge that my vehicle is undamaged and in safe and usable condition.</label>
        </div>
        <div className="form-check mt-2">
          <input className="form-check-input app-form-check" type="radio" name="rental_exp" value="Y" id="before_rented" onChange={onChangeRentBefore} checked={isRentBefore} />
          <label className="fw-400 fs-0p875 gray-36" htmlFor="before_rented">My Vehicle HAS been rented outside of URentMe's platform and I acknowledge that my vehicle is undamaged and in safe and usable condition.</label>
        </div>
      </div>
    );
  };

  const customListingSuccess = (
    <div className="d-flex flex-column align-items-center mt-4">
      <CircleMark width={72} height={72} bgColor={Color.PRIMARY_COLOR}>
        <FaCheck className="fp-36 white" />
      </CircleMark>
      <div className="fw-400 fs-1p0 gray-36 text-center my-4">
        Your vehicle was successfully uploaded!
        <br />
        Please wait for verification
      </div>
    </div>
  );

  return (
    <div className="container mt-4">
      <form onSubmit={formik.handleSubmit}>
        {renderLocation()}
        {renderVehicleInfo()}
        {renderNameSection()}
        {renderFeatureSection()}
        {renderPriceSection()}
        {renderPhotoSection()}
        {renderConditionSection()}
        {renderAgreeementSection()}
        <div className="d-flex align-items-center my-4">
          <button
            type="submit"
            className="btn btn-app-primary fw-400 fs-1p0 white py-2"
            disabled={!agreeCancellation || !agreeTerms || loading}
          >Finish &amp; Submit</button>
          {loading && <AppSpinner className="ms-4" />}
        </div>
      </form>
      <SimpleInputModal
        open={addModal}
        onClose={() => setAddModal(false)}
        type={addType}
        dependencyId={dependencyId}
        onAdd={onAddType}
      />
      <ConfirmModal
        open={showSuccessModal}
        closeOnOverlayClick={false}
        onClose={() => setShowSuccesseModal(false)}
        customChildren={customListingSuccess}
        primaryButton="DONE"
        primaryClassName="px-5"
        onPrimaryClick={onSuccess}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userId: state.userId,
    userVerified: state.userVerified,
    allItemImages: state.allItemImages,
    allItemFeatures: state.allItemFeatures,
  };
};

export default connect(mapStateToProps, { getAllItems, getItemImages, getItemFeatures, getItemCourtesies, getWishItems, getUserItems })(EditHostScreen);
