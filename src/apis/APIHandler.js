import axios from 'axios';
import { encode } from 'html-entities';

import * as API from './API';
import { x_api_key, ONESIGNAL_APP_ID, ONESIGNAL_REST_API_KEY } from '../constants/constant';

const config = {
  headers: { 'x-api-key': x_api_key },
}

export const login = async(username, password) => {
  return await axios.get(`${API.LOGIN}username=${username}&password=${password}`, config)
    .then((res) => res.data);
}

export const sendResetCode = async(email) => {
  return await axios.get(`${API.SENDRESETCODE}email=${email}`, config)
    .then((res) => res.data);
}

export const resetPassword = async(email, pwd, otp) => {
  return await axios.get(`${API.RESETPWD}email=${email}&pwd=${pwd}&otp=${otp}`, config)
    .then((res) => res.data);
}

export const signup = async(first_name, last_name, username, email, password) => {
  const data = JSON.stringify({ first_name, last_name, username, email, password, device_type: "Web", login_type: "Manual" });
  return await axios.post(API.SIGNUP, data, config)
    .then((res) => res.data);
}

export const socialLogin = async(
  f_name,
  l_name,
  email,
  social_id,
  login_type,
) => {
  let endpoint = `${API.LOGIN}social_id=${social_id}`;
  if (f_name) {
    endpoint += `&f_name=${f_name}`;
  }
  if (l_name) {
    endpoint += `&l_name=${l_name}`;
  }
  if (email) {
    endpoint += `&email=${email}`;
  }
  if (login_type) {
    endpoint += `&login_type=${login_type}`;
  }
  return await axios.get(endpoint, config)
    .then((res) => res.data);
}

export const getAllItems = async() => {
  return await axios.get(API.ITEMLIST, config)
    .then((res) => res.data);
}

export const getItemImages = async() => {
  return await axios.get(API.ITEMIMAGES, config)
    .then((res) => res.data);
}

export const getItemFeatures = async() => {
  return await axios.get(API.ITEMFEATURELIST, config)
    .then((res) => res.data);
}

export const getItemCourtesies = async() => {
  return await axios.get(API.ITEMCOURTESIES, config)
    .then((res) => res.data);
}

export const getItemDetails = async(itemId) => {
  return await axios.get(`${API.ITEMLIST}?item_id=${itemId}`, config)
    .then((res) => res.data);
}

export const searchItem = async(searchkey) => {
  return await axios.get(`${API.ITEMSEARCH}term=${searchkey}`, config)
    .then((res) => res.data)
}

export const filterByDate = async(begin, end) => {
  return await axios.get(`${API.SEARCHBYDATE}sdate=${begin}&edate=${end}`, config)
    .then((res) => res.data);
}

export const checkBookable = async(itemId, startDate, endDate) => {
  return await axios.get(`${API.CHECK_BOOKING_DATE}item_id=${itemId}&sdate=${startDate}&edate=${endDate}`, config)
    .then((res) => res.data);
}

export const addBooking = async(
  user_id,
  item_id,
  total_price,
  security_deposit,
  rent_token,
  security_token,
  owner_id,
  ip,
  urentme_fee,
  base_rental_amount,
  total_insurance_amount,
  insurance_rate_per_day,
  base_rental_rate_per_day,
  owner_payout,
  total_insurance_tax,
  start_date,
  end_date,
  message,
  cleaning_fee,
  roadside_assistance_fee,
  is_roadside_assistance_required,
  coupon_code,
  discount_price,
) => {
  const data = JSON.stringify({
    user_id,
    item_id,
    total_price,
    security_deposit,
    rent_token,
    security_token,
    owner_id,
    ip,
    urentme_fee,
    base_rental_amount,
    total_insurance_amount,
    insurance_rate_per_day,
    base_rental_rate_per_day,
    owner_payout,
    total_insurance_tax,
    start_date,
    end_date,
    message,
    cleaning_fee,
    roadside_assistance_fee,
    is_roadside_assistance_required,
    coupon_code,
    discount_price,
  });

  return await axios.post(API.ADD_BOOKING, data, config)
    .then((res) => res.data);
}

export const updateBooking = async(
  booking_id,
  status,
  is_rental_completed,
  is_renter_give_review,
  is_owner_give_review,
  is_have_dispute,
) => {
  const data = JSON.stringify({
    booking_id,
    status,
    is_rental_completed,
    is_renter_give_review,
    is_owner_give_review,
    is_have_dispute,
  });

  return await axios.post(API.UPDATE_BOOKING, data, config)
    .then((res) => res.data);
}

export const getUserInfo = async(userId) => {
  return await axios.get(`${API.USERINFO}id=${userId}`, config)
    .then((res) => res.data);
}

export const updateUser = async (
  user_id,
  city,
  state,
  street1,
  zipcode,
  first_name,
  last_name,
  email,
  latitude,
  longitude,
  img_name,
  about,
) => {
  const data = JSON.stringify({
    user_id,
    city,
    state,
    street1,
    zipcode,
    first_name,
    last_name,
    email,
    latitude,
    longitude,
    img_name,
    about: encode(about)
  });
  return await axios.post(API.UPDATE_USER, data, config)
    .then(res => res.data);
}

export const requestPhoneVerify = async (user_id, phone) => {
  return await axios.get(`${API.PHONE_VERIFY}user_id=${user_id}&phone=${phone}`, config)
    .then(res => res.data);
}

export const sendPhoneVerifyCode = async (user_id, code, session_id) => {
  return await axios.get(`${API.PHONE_VERIFY}user_id=${user_id}&code=${code}&session_id=${session_id}`, config)
    .then(res => res.data);
}

export const uploadProfileImage = async (user_id, fname, raw) => {
  const data = JSON.stringify({ user_id, fname, raw });
  return await axios.post(API.UPLOAD_PROFILE_IMAGE, data, config)
    .then(res => res.data);
}

export const uploadDriverLicense = async (user_id, raw, type) => {
  const data = JSON.stringify({ user_id, raw, type });
  return await axios.post(API.UPLOAD_DRIVER_LICENSE, data, config)
    .then(res => res.data);
}

export const uploadOwnerVehicleImages = async (booking_id, photo_id, raw, type) => {
  const data = JSON.stringify({ booking_id, photo_id, raw, type });
  return await axios.post(API.UPLOAD_OWNER_VEHICLE_IMAGES, data, config)
    .then(res => res.data);
}

export const getAllDocuments = async (user_id) => {
  return await axios.get(`${API.ALL_DOCUMENT_LIST}?user_id=${user_id}`, config)
    .then(res => res.data);
}

export const getUserItems = async(userId) => {
  return await axios.get(`${API.ITEMLIST}?user_id=${userId}`, config)
    .then((res) => res.data);
}

export const getUserMessages = async(userId) => {
  return await axios.get(`${API.MESSAGE_LIST}user_id=${userId}`, config)
    .then((res) => res.data);
}
export const addMessage = async(get_id, send_id, message, vehicleId = 0) => {
  const data = JSON.stringify({ get_id, send_id, message, vehicleId });
  return await axios.post(API.ADD_MESSAGE, data, config)
    .then((res) => res.data);
}

export const getWishItems = async(userId) => {
  return await axios.get(`${API.MYWISH_LIST}&user_id=${userId}`, config)
    .then((res) => res.data);
}

export const setWishItem = async(userId, itemId, status) => {
  const data = JSON.stringify({ user_id: userId, item_id: itemId, status });
  return await axios.post(API.WISHING_ITEM, data, config)
    .then((res) => res.data);
}

export const getOwnerReviews = async(ownerId) => {
  return await axios.get(`${API.OWNERREVIEWS}owner_id=${ownerId}`, config)
    .then((res) => res.data.msg);
}

export const getPendingTrips = async(userId) => {
  return await axios.get(`${API.BOOKINGLIST}?user_id=${userId}`, config)
    .then((res) => res.data);
}

export const getPendingBookings = async(ownerId) => {
  return await axios.get(`${API.BOOKINGLIST}?owner_id=${ownerId}`, config)
    .then((res) => res.data);
}

export const getNotificationList = async(userId) => {
  const data = JSON.stringify({ action: 'list', user_id: userId });
  return await axios.post(API.NOTIFICATION_URL, data, config)
    .then((res) => res.data);
}

export const markNotificationAsRead = async(id) => {
  const data = JSON.stringify({ action: 'markAsRead', id });
  return await axios.post(API.NOTIFICATION_URL, data, config)
    .then((res) => res.data);
}

export const sendPushNotification = async(onesignal_id, header, content) => {
  const conf = {
    headers: { Authorization: 'Basic ' + ONESIGNAL_REST_API_KEY },
  }
  const data = JSON.stringify({
    app_id: ONESIGNAL_APP_ID,
    headings: { en: header},
    contents: { en: content },
    include_player_ids: [onesignal_id],
  });
  return await axios.post(API.ONESIGNAL_NOTIFICATION_URL, data, conf)
    .then((res) => res.data);
}

export const sendReview = async(
  user_id,
  item_id,
  booking_id,
  comment,
  rating,
) => {
  const data = JSON.stringify({
    user_id,
    item_id,
    booking_id,
    comment,
    rating,
  });
  return await axios.post(API.GIVE_REVIEW, data, config)
    .then((res) => res.data);
}

export const getBankDetails = async (user_id) => {
  return await axios.get(`${API.GET_BANKDETAILS}user_id=${user_id}`, config)
    .then((res) => res.data);
};

export const updateBankAccount = async (
  user_id,
  city,
  state,
  street1,
  zipcode,
  first_name,
  last_name,
  email,
  mobile,
  stripe_id,
  ssn_last_4,
  ach_route,
  ach_account,
  day,
  month,
  year,
) => {
  const data = JSON.stringify({
    user_id,
    city,
    state,
    street1,
    zipcode,
    first_name,
    last_name,
    email,
    mobile,
    stripe_id,
    ssn_last_4,
    ach_route,
    ach_account,
    day,
    month,
    year,
  });
  return await axios.post(API.OWNER_UPDATE, data, config)
    .then((res) => res.data);
};

export const getCreditCardToken = async (cardInfo) => {
  const card = {
    'card[number]': cardInfo.number.replace(/ /g, ''),
    'card[exp_month]': cardInfo.expiry.split('/')[0],
    'card[exp_year]': cardInfo.expiry.split('/')[1],
    'card[cvc]': cardInfo.cvc,
  };

  const header = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Bearer ${API.STRIPE_PUBLICKEY}`,
  };
  const body = Object.keys(card).map((key) => key + '=' + card[key]).join('&');

  return await fetch('https://api.stripe.com/v1/tokens', {
    headers: header,
    method: 'post',
    body: body
  }).then(res => res.json());
}

export const getTipsContent = async () => {
  return await axios.get(API.TIPS_CONTENT, config)
    .then((res) => res.data);
}

export const getInsuranceContent = async () => {
  return await axios.get(API.INSURANCE_CONTENT, config)
    .then((res) => res.data);
}

export const getTermsContent = async () => {
  return await axios.get(`${API.TERMS_CONTENT}`, config)
    .then((res) => res.data);
}

export const getPrivacyContent = async () => {
  return await axios.get(`${API.PRIVACY_CONTENT}`, config)
    .then((res) => res.data);
}

export const getDmcaContent = async () => {
  return await axios.get(`${API.ADMIN_DMCA_LIST}`, config)
    .then((res) => res.data);
}

export const getAboutUsContent = async () => {
  return await axios.get(API.ABOUT_US, config)
    .then((res) => res.data);
}

export const getTestimonials = async () => {
  return await axios.get(API.ADMIN_ALL_TESTIMONIAL, config)
    .then((res) => res.data);
}

export const getCategories = async () => {
  return await axios.get(API.CATEGORIES_LIST, config)
    .then((res) => res.data);
}

export const getCategoryPrice = async () => {
  return await axios.get(API.CATEGORY_PRICE_LIST, config)
    .then((res) => res.data);
}

export const getMakeList = async () => {
  return await axios.get(API.MAKES_LIST, config)
    .then((res) => res.data);
}

export const getModelList = async () => {
  return await axios.get(API.MODEL_LIST, config)
    .then((res) => res.data);
}

export const addMakeItem = async (category_id, name) => {
  const data = JSON.stringify({ category_id, name });
  return await axios.post(API.ADD_MAKE, data, config)
    .then(res => res.data);
}

export const addModelItem = async (make_id, name) => {
  const data = JSON.stringify({ make_id, name });
  return await axios.post(API.ADD_MODEL, data, config)
    .then(res => res.data);
}

export const addItem = async (item) => {
  const endpoint = API.ADD_ITEM
    + 'user_id=' + item.user_id
    + '&category_id=' + item.category_id
    + '&name=' + encode(item.name)
    + '&year=' + item.year
    + '&make=' + item.make
    + '&model=' + item.model
    + '&street=' + encode(item.street)
    + '&city=' + encode(item.city)
    + '&state=' + encode(item.state)
    + '&zipcode=' + item.zipcode
    + '&guest=' + item.guest
    + '&insurance_rate_per_day=' + item.insurance_rate_per_day
    + '&insurance_tax_rate_per_day=' + item.insurance_tax_rate_per_day
    + '&weekend_upcharge=' + item.weekend_upcharge
    + '&base_user_rent_per_weekend=' + item.base_user_rent_per_weekend
    + '&base_user_rent_per_day=' + item.base_user_rent_per_day
    + '&base_user_rent_per_week=' + item.base_user_rent_per_week
    + '&rent_per_weekend=' + item.rent_per_weekend
    + '&rent_per_day=' + item.rent_per_day
    + '&rent_per_week=' + item.rent_per_week
    + '&availabile=' + item.availabile
    + '&security_deposit=' + item.security_deposit
    + '&cancelation_policy=' + encode(item.cancelation_policy)
    + '&cleaning_fee=' + item.cleaning_fee
    + '&vin_no=' + item.vin_no
    + '&latitude=' + item.latitude
    + '&longitude=' + item.longitude
    + '&description=' + encode(item.description)
    + '&modified=' + item.modified
    + '&created=' + item.created
    + '&ach=' + item.ach
    + '&is_rented_before=' + item.is_rented_before
    + '&condition_details=' + encode(item.condition_details);
  return await axios.get(endpoint, config)
    .then((res) => res.data);
}

export const updateItem = async (item) => {
  const endpoint = API.UPDATE_ITEM
    + 'id=' + item.item_id
    + '&user_id=' + item.user_id
    + '&category_id=' + item.category_id
    + '&name=' + encode(item.name)
    + '&year=' + item.year
    + '&make=' + item.make
    + '&model=' + item.model
    + '&street=' + encode(item.street)
    + '&city=' + encode(item.city)
    + '&state=' + encode(item.state)
    + '&zipcode=' + item.zipcode
    + '&guest=' + item.guest
    + '&insurance_rate_per_day=' + item.insurance_rate_per_day
    + '&insurance_tax_rate_per_day=' + item.insurance_tax_rate_per_day
    + '&weekend_upcharge=' + item.weekend_upcharge
    + '&base_user_rent_per_weekend=' + item.base_user_rent_per_weekend
    + '&base_user_rent_per_day=' + item.base_user_rent_per_day
    + '&base_user_rent_per_week=' + item.base_user_rent_per_week
    + '&rent_per_weekend=' + item.rent_per_weekend
    + '&rent_per_day=' + item.rent_per_day
    + '&rent_per_week=' + item.rent_per_week
    + '&availabile=' + item.availabile
    + '&security_deposit=' + item.security_deposit
    + '&cancelation_policy=' + encode(item.cancelation_policy)
    + '&cleaning_fee=' + item.cleaning_fee
    + '&vin_no=' + item.vin_no
    + '&latitude=' + item.latitude
    + '&longitude=' + item.longitude
    + '&description=' + encode(item.description)
    + '&modified=' + item.modified
    + '&created=' + item.created
    + '&ach=' + item.ach
    + '&is_rented_before=' + item.is_rented_before
    + '&condition_details=' + encode(item.condition_details);
  return await axios.get(endpoint, config)
    .then((res) => res.data);
}

export const addFeature = async (item_id, name) => {
  const data = JSON.stringify({ item_id, name });
  return await axios.post(API.ADD_FEATURE, data, config)
    .then((res) => res.data);
}

export const uploadItemImage = async (item_id, fname, is_default, raw) => {
  const data = JSON.stringify({ item_id, is_default, fname, raw });
  return await axios.post(API.UPLOAD_ITEM_IMAGE, data, config)
    .then((res) => res.data);
}

export const uploadSimpleItemImage = async (item_id, fname, is_default) => {
  const data = JSON.stringify({ item_id, is_default, fname });
  return await axios.post(API.UPLOAD_SIMPLE_ITEM_IMAGE, data, config)
    .then((res) => res.data);
}

export const sendContactMail = async(first_name, last_name, email, code, phone, comment) => {
  const data = JSON.stringify({ first_name, last_name, email, code, phone, comment });
  return await axios.post(API.CONTACT_US, data, config)
    .then((res) => res.data);
}

export const getBlockDateList = async(item_id) => {
  return await axios.get(`${API.BLOCK_DATE_LIST}item_id=${item_id}`, config)
    .then((res) => res.data);
}

export const addBlockDate = async(itemID, dates) => {
  return await axios.get(`${API.ADD_BLOCK_DATE}item_id=${itemID}&dates=` + encode(dates), config)
    .then((res) => res.data);
}

export const postVerificationStatus = async (user_id, vouched_job_id, vouched_verify_status) => {
  const data = JSON.stringify({ user_id, vouched_job_id, vouched_verify_status });
  return await axios.post(API.UPDATE_VOUCHED_JOB, data, config)
    .then(res => res.data);
}

export const adminAllAdmins = async () => {
  return await axios.get(API.ADMIN_ALL_ADMINS, config).then(res => res.data);
}
export const adminAdminInfo = async(id) => {
  return await axios.get(`${API.ADMIN_ALL_ADMINS}?id=${id}`, config).then(res => res.data);
}
export const adminAdminByEmail = async(email) => {
  return await axios.get(`${API.ADMIN_ALL_ADMINS}?email=${email}`, config).then(res => res.data);
}
export const adminAddAdmin = async(data) => {
  return await axios.post(API.ADMIN_ADD_ADMIN, data, config).then(res => res.data);
}
export const adminEditAdmin = async(data) => {
  return await axios.post(API.ADMIN_EDIT_ADMIN, data, config).then(res => res.data);
}
export const adminImageAdmin = async(id, fname, raw) => {
  const data = JSON.stringify({ id, fname, raw });
  return await axios.post(API.ADMIN_IMAGE_ADMIN, data, config).then(res => res.data);
}
export const adminPasswordAdmin = async(data) => {
  return await axios.post(API.ADMIN_PASSWORD_ADMIN, data, config).then(res => res.data);
}

export const adminAllMembers = async () => {
  return await axios.get(API.ADMIN_ALL_MEMBERS, config).then(res => res.data);
}
export const adminMemberInfo = async(id) => {
  return await axios.get(`${API.ADMIN_ALL_MEMBERS}?id=${id}`, config).then(res => res.data);
}
export const adminActiveMember = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_MEMBER, data, config).then(res => res.data);
}
export const adminDeleteMember = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_DEL_MEMBER, data, config).then(res => res.data);
}
export const adminAddMember = async(data) => {
  return await axios.post(API.ADMIN_ADD_MEMBER, data, config).then(res => res.data);
}
export const adminEditMember = async(data) => {
  return await axios.post(API.ADMIN_EDIT_MEMBER, data, config).then(res => res.data);
}
export const adminEmailMember = async(id) => {
  return await axios.get(`${API.ADMIN_EMAIL_MEMBER}?id=${id}`, config).then(res => res.data);
}
export const adminPasswordMember = async(data) => {
  return await axios.post(API.ADMIN_PASSWORD_MEMBER, data, config).then(res => res.data);
}

export const adminLogin = async (data) => {
  return await axios.post(API.ADMIN_LOGIN, data,config).then(res => res.data);
}

export const adminAllCategories = async () => {  
  return await axios.get(API.ADMIN_ALL_CATEGORIES, config).then(res => res.data);
}
export const adminAddCategory = async (name, generator, mileage_charge, success_message, min_earning, max_earning) => {
  const data = JSON.stringify({ name, generator, mileage_charge, success_message : encode(success_message), min_earning, max_earning });
  return await axios.post(API.ADMIN_ADD_CATEGORY, data, config).then(res => res.data);
}
export const adminEditCategory = async (id, name, generator, mileage_charge, success_message, min_earning, max_earning, status) => {
  const data = JSON.stringify({ id, name, generator, mileage_charge, success_message, min_earning, max_earning, status });
  return await axios.post(API.ADMIN_EDIT_CATEGORY, data, config).then(res => res.data);
}
export const adminDeleteCategory = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_CATEGORY, data, config).then(res => res.data);
}
export const adminActiveCategory = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_CATEGORY, data, config).then(res => res.data);
}

export const adminAllMakes = async () => {
  return await axios.get(API.ADMIN_ALL_MAKES, config)
    .then((res) => res.data);
}
export const adminAddMake = async (category_id, name) => {
  const data = JSON.stringify({ category_id, name });
  return await axios.post(API.ADD_MAKE, data, config)
    .then(res => res.data);
}
export const adminEditMake = async (id, category_id, name, status) => {
  const data = JSON.stringify({ id, category_id, name, status });
  return await axios.post(API.ADMIN_EDIT_MAKE, data, config).then(res => res.data);
}
export const adminDeleteMake = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_MAKE, data, config).then(res => res.data);
}
export const adminActiveMake = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_MAKE, data, config).then(res => res.data);
}

export const adminAllModels = async () => {
  return await axios.get(API.ADMIN_ALL_MODELS, config)
    .then((res) => res.data);
}
export const adminAddModel = async (make_id, name, startyear, endyear) => {
  const data = JSON.stringify({ make_id, name, startyear, endyear });
  return await axios.post(API.ADMIN_ADD_MODEL, data, config).then(res => res.data);
}
export const adminEditModel = async (id, make_id, name, startyear, endyear, status) => {
  const data = JSON.stringify({ id, make_id, name, startyear, endyear, status });
  return await axios.post(API.ADMIN_EDIT_MODEL, data, config).then(res => res.data);
}
export const adminDeleteModel = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_MODEL, data, config).then(res => res.data);
}
export const adminActiveModel = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_MODEL, data, config).then(res => res.data);
}

export const adminAllUserIds = async () => {
  return await axios.get(API.ADMIN_ALL_USERIDS, config).then(res => res.data);
}
export const adminActiveUserId = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_USERID, data, config).then(res => res.data);
}
export const adminDeleteUserId = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_USERID, data, config).then(res => res.data);
}

export const adminAllItems = async () => {
  return await axios.get(API.ADMIN_ALL_ITEMS, config).then(res => res.data);
}
export const adminActiveItem = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_ITEM, data, config).then(res => res.data);
}
export const adminEditItem = async(data) => {
  return await axios.post(API.ADMIN_EDIT_ITEM, data, config).then(res => res.data);
}
export const adminDeleteItem = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_ITEM, data, config).then(res => res.data);
}
export const adminEmailItem = async(user_id) => {
  return await axios.get(`${API.ADMIN_EMAIL_ITEM}?user_id=${user_id}`, config).then(res => res.data);
}

export const adminAllFeatures = async (item_id) => {
  return await axios.get(`${API.ADMIN_ALL_FEATURES}?item_id=${item_id}`, config).then(res => res.data);
}
export const adminAddFeature = async (data) => {
  return await axios.post(API.ADMIN_ADD_FEATURE, data, config).then(res => res.data);
}
export const adminDeleteFeature = async (ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_FEATURE, data, config).then(res => res.data);
}

export const adminAllImages = async (item_id) => {
  return await axios.get(`${API.ADMIN_ALL_IMAGES}?item_id=${item_id}`, config).then(res => res.data);
}
export const adminAddImage = async (data) => {
  return await axios.post(API.ADMIN_ADD_IMAGE, data, config).then(res => res.data);
}
export const adminEditImages = async (item_id, default_id) => {
  return await axios.get(`${API.ADMIN_EDIT_IMAGE}?item_id=${item_id}&default_id=${default_id}`, config).then(res => res.data);
}
export const adminDeleteImage = async (ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_IMAGE, data, config).then(res => res.data);
}

export const adminAllBookings = async () => {
  return await axios.get(`${API.ADMIN_ALL_BOOKINGS}`, config).then(res => res.data);
}
export const adminBookingPhotoStatus = async (id, type, status, email) => {
  return await axios.get(`${API.ADMIN_BOOKING_PHOTO_STATUS}?id=${id}&type=${type}&status=${status}&email=${email}`, config).then(res => res.data);
}
export const adminBookingOwnerReceivable = async (id, owner_payout) => {
  return await axios.get(`${API.ADMIN_BOOKING_OWNER_RECEIVABLE}?id=${id}&owner_payout=${owner_payout}`, config).then(res => res.data);
}
export const adminBookingReleaseRental = async (id, status, without_transfer_group) => {
  return await axios.get(`${API.ADMIN_BOOKING_RELEASE_RENT}?id=${id}&status=${status}&without_transfer_group=${without_transfer_group}`, config).then(res => res.data);
}
export const adminBookingRefundDeposit = async (id, status) => {
  return await axios.get(`${API.ADMIN_BOOKING_REFUND_DEPOSIT}?id=${id}&status=${status}`, config).then(res => res.data);
}
export const adminBookingTotalAmount = async (id, status) => {
  return await axios.get(`${API.ADMIN_BOOKING_TOTAL_AMOUNT}?id=${id}&status=${status}`, config).then(res => res.data);
}
export const adminBookingReleaseDeposit = async (id, seller_amount, buyer_amount) => {
  return await axios.get(`${API.ADMIN_BOOKING_RELEASE_DEPOSIT}?id=${id}&seller_amount=${seller_amount}&buyer_amount=${buyer_amount}`, config).then(res => res.data);
}
export const adminBookingFullPaid = async (id) => {
  return await axios.get(`${API.ADMIN_BOOKING_FULL_PAID}?id=${id}`, config).then(res => res.data);
}
export const adminBookingResendEmail = async (id) => {
  return await axios.get(`${API.ADMIN_BOOKING_RESENT_EMAIL}?id=${id}`, config).then(res => res.data);
}
export const adminBookingPullInformation = async (id) => {
  return await axios.get(`${API.ADMIN_BOOKING_PULL_INFORMATION}?id=${id}`, config).then(res => res.data);
}

export const adminAllTransactions = async () => {
  return await axios.get(API.ADMIN_ALL_TRANSACTIONS, config).then(res => res.data);
}
export const adminAllTransactionAttempts = async () => {
  return await axios.get(API.ADMIN_ALL_TRANSACTION_ATTEMPTS, config).then(res => res.data);
}

export const adminAllTestimonials = async () => {
  return await axios.get(`${API.ADMIN_ALL_TESTIMONIAL}?all=1`, config).then(res => res.data);
}
export const adminIdTestimonials = async (id) => {
  return await axios.get(`${API.ADMIN_ALL_TESTIMONIAL}?id=${id}`, config).then(res => res.data);
}
export const adminActiveTestimonial = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_TESTIMONIAL, data, config).then(res => res.data);
}
export const adminAddTestimonial = async(data) => {
  return await axios.post(API.ADMIN_ADD_TESTIMONIAL, data, config).then(res => res.data);
}
export const adminImageTestimonial = async(id, fname, raw) => {
  const data = JSON.stringify({ id, fname, raw });
  return await axios.post(API.ADMIN_IMAGE_TESTIMONIAL, data, config).then(res => res.data);
}
export const adminEditTestimonial = async(data) => {
  return await axios.post(API.ADMIN_EDIT_TESTIMONIAL, data, config).then(res => res.data);
}
export const adminDeleteTestimonial = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_TESTIMONIAL, data, config).then(res => res.data);
}

export const adminAllEmailTemplates = async () => {
  return await axios.get(API.ADMIN_ALL_EMAIL_TEMPLATE, config).then(res => res.data);
}
export const adminActiveEmailTemplate = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_EMAIL_TEMPLATE, data, config).then(res => res.data);
}
export const adminEditEmailTemplate = async (data) => {
  return await axios.post(API.ADMIN_EDIT_EMAIL_TEMPLATE, data, config).then(res => res.data);
}

export const getAllDepositList = async () => {
  return await axios.get(API.ADMIN_DEPOSIT_LIST, config)
    .then((res) => res.data);
}
export const adminAddDeposit = async (data) => {
  return await axios.post(API.ADMIN_ADD_DEPOSIT, data, config).then(res => res.data);
}
export const adminEditDeposit = async (data) => {
  return await axios.post(API.ADMIN_EDIT_DEPOSIT, data, config).then(res => res.data);
}
export const adminDeleteDeposit = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_DEPOSIT, data, config).then(res => res.data);
}

export const getAllDmcaList = async () => {
  return await axios.get(`${API.ADMIN_DMCA_LIST}?all=1`, config)
    .then((res) => res.data);
}
export const adminAddDmca = async (data) => {
  return await axios.post(API.ADMIN_ADD_DMCA, data, config).then(res => res.data);
}
export const adminEditDmca = async (data) => {
  return await axios.post(API.ADMIN_EDIT_DMCA, data, config).then(res => res.data);
}
export const adminDeleteDmca = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_DMCA, data, config).then(res => res.data);
}
export const adminActiveDmca = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_DMCA, data, config).then(res => res.data);
}

export const getAllTermList = async () => {
  return await axios.get(`${API.ADMIN_TERM_LIST}?all=1`, config)
    .then((res) => res.data);
}
export const adminAddTerm = async (data) => {
  return await axios.post(API.ADMIN_ADD_TERM, data, config).then(res => res.data);
}
export const adminEditTerm = async (data) => {
  return await axios.post(API.ADMIN_EDIT_TERM, data, config).then(res => res.data);
}
export const adminDeleteTerm = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_TERM, data, config).then(res => res.data);
}
export const adminActiveTerm = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_TERM, data, config).then(res => res.data);
}

export const getAllPolicyList = async () => {
  return await axios.get(`${API.ADMIN_POLICY_LIST}?all=1`, config)
    .then((res) => res.data);
}
export const adminAddPolicy = async (data) => {
  return await axios.post(API.ADMIN_ADD_POLICY, data, config).then(res => res.data);
}
export const adminEditPolicy = async (data) => {
  return await axios.post(API.ADMIN_EDIT_POLICY, data, config).then(res => res.data);
}
export const adminDeletePolicy = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_POLICY, data, config).then(res => res.data);
}
export const adminActivePolicy = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_POLICY, data, config).then(res => res.data);
}

export const getAllTipsList = async () => {
  return await axios.get(`${API.ADMIN_TIPS_LIST}?all=1`, config)
    .then((res) => res.data);
}
export const adminAddTips = async (data) => {
  return await axios.post(API.ADMIN_ADD_TIPS, data, config).then(res => res.data);
}
export const adminEditTips = async (data) => {
  return await axios.post(API.ADMIN_EDIT_TIPS, data, config).then(res => res.data);
}
export const adminDeleteTips = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_TIPS, data, config).then(res => res.data);
}
export const adminActiveTips = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_TIPS, data, config).then(res => res.data);
}

export const getAllPagesList = async () => {
  return await axios.get(`${API.ADMIN_PAGES_LIST}?all=1`, config)
    .then((res) => res.data);
}
export const adminAddPages = async (data) => {
  return await axios.post(API.ADMIN_ADD_PAGES, data, config).then(res => res.data);
}
export const adminEditPages = async (data) => {
  return await axios.post(API.ADMIN_EDIT_PAGES, data, config).then(res => res.data);
}
export const adminDeletePages = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_PAGES, data, config).then(res => res.data);
}
export const adminActivePages = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_PAGES, data, config).then(res => res.data);
}

export const getAllAboutUsList = async () => {
  return await axios.get(`${API.ADMIN_ABOUT_US_LIST}?all=1`, config)
    .then((res) => res.data);
}
export const adminAddAboutUs = async (data) => {
  return await axios.post(API.ADMIN_ADD_ABOUT_US, data, config).then(res => res.data);
}
export const adminEditAboutUs = async (data) => {
  return await axios.post(API.ADMIN_EDIT_ABOUT_US, data, config).then(res => res.data);
}
export const adminDeleteAboutUs = async(ids) => {
  const data = JSON.stringify({ ids });
  return await axios.post(API.ADMIN_DEL_ABOUT_US, data, config).then(res => res.data);
}
export const adminActiveAboutUs = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_ACTIVE_ABOUT_US, data, config).then(res => res.data);
}

export const adminAllNotifications = async () => {
  return await axios.get(API.ADMIN_ALL_NOTIFICATION, config).then(res => res.data);
}

export const adminDeleteNotification = async(ids, status) => {
  const data = JSON.stringify({ ids, status });
  return await axios.post(API.ADMIN_DEL_NOTIFICATION, data, config).then(res => res.data);
}

export const fetchTableCount = async () => {
  return await axios.get(`${API.ADMIN_DASHBOARD_TABLECOUNT}`, config)
    .then((res) => res.data);
}
export const fetchTableData = async () => {
  return await axios.get(`${API.ADMIN_DASHBOARD_TABLEDATA}`, config)
    .then((res) => res.data);
}

export const fetchFeeValue = async () => {
  return await axios.get(`${API.ADMIN_DASHBOARD_FEE}`, config)
    .then((res) => res.data);
}
export const updateFeeValue = async (value) => {
  const data = JSON.stringify({ value });
  return await axios.post(API.ADMIN_DASHBOARD_FEE_UPDATE, data, config).then(res => res.data);
}

export const adminAllReferrals = async () => {  
  return await axios.get(API.ADMIN_ALL_REFERRALS, config).then(res => res.data);
}

export const adminAllPosts = async () => {  
  return await axios.get(API.ADMIN_ALL_POSTS, config).then(res => res.data);
}

export const adminAllEvents = async () => {  
  return await axios.get(API.ADMIN_ALL_EVENTS, config).then(res => res.data);
}

export const adminAllMedias = async () => {  
  return await axios.get(API.ADMIN_ALL_MEDIAS, config).then(res => res.data);
}
