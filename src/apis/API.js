// Login
const IsDevelopment = true;

export const APP_PATH = IsDevelopment
  ? 'https://dev.urentme.com'
  : 'https://urentme.com';

export const STRIPE_PUBLICKEY = IsDevelopment
  ? 'pk_test_zZskLEvLXcrW3QdK6QczRj5D'
  : 'pk_live_51AF7hPE6KZSMDs3or8O8dr2lMbJCSFXSpjj5YZ3cwzm3dk7oQHof8dcu3jqHA3sYfFg4YVk1DLB30U45917GASQv00dA7LDt1L';
export const BASE_URI = IsDevelopment
  ? 'https://api.urentme.com/dev/v1/'
  : 'https://api.urentme.com/v1/';
export const IPAPI = 'http://ip-api.com/json';
export const ONESIGNAL_NOTIFICATION_URL =
  'https://onesignal.com/api/v1/notifications';

export const LOGIN = BASE_URI + 'Users/Auth/login.php?';
export const SENDRESETCODE = BASE_URI + 'Users/Auth/sendResetCode.php?';
export const RESETPWD = BASE_URI + 'Users/Auth/resetPwd.php?';
export const SIGNUP = BASE_URI + 'Users/signup.php';
export const ITEMLIST = BASE_URI + 'Items/all_list.php';
export const ITEMIMAGES = BASE_URI + 'Items/Images/list.php';
export const ITEMSEARCH = BASE_URI + 'Items/search.php?';
export const SEARCHBYDATE = BASE_URI + 'Items/all_search.php?';
export const BOOKINGLIST = BASE_URI + 'Bookings/list.php';
export const USERINFO = BASE_URI + 'Users/userinfo.php?';
export const ITEMFEATURELIST = BASE_URI + 'Items/Features/list.php';
export const ITEMCOURTESIES = BASE_URI + 'Items/Restrictions/list.php';
export const OWNERREVIEWS = BASE_URI + 'Users/owner_items.php?';

export const CATEGORIES_LIST = BASE_URI + 'Items/Categories/list.php';
export const CATEGORY_PRICE_LIST = BASE_URI + 'Items/Categories/pricelist.php';
export const MAKES_LIST = BASE_URI + 'Items/Makes/list.php';
export const MODEL_LIST = BASE_URI + 'Items/Models/list.php';
export const ADD_MAKE = BASE_URI + 'Items/Makes/add.php';
export const ADD_MODEL = BASE_URI + 'Items/Models/add.php';
export const ADD_ITEM = BASE_URI + 'Items/add.php?';
export const UPDATE_ITEM = BASE_URI + 'Items/update.php?';
export const UPLOAD_ITEM_IMAGE = BASE_URI + 'Items/Images/upload.php';
export const ADD_FEATURE = BASE_URI + 'Items/Features/add.php';
export const DELETE_ITEM = BASE_URI + 'Items/delete.php?';

// Profile Veify
export const UPLOAD_PROFILE_IMAGE = BASE_URI + 'Users/Images/upload.php';
export const PHONE_VERIFY = BASE_URI + 'Users/Auth/phoneverify.php?';
export const UPLOAD_DRIVER_LICENSE = BASE_URI + 'Users/Document/save-file.php';
export const ALL_DOCUMENT_LIST = BASE_URI + 'Users/Document/list.php';

export const UPDATE_USER = BASE_URI + 'Users/update.php';
export const MYWISH_LIST = BASE_URI + 'Users/user_wishlists.php?';
export const WISHING_ITEM = BASE_URI + 'Users/user_wishlist_update.php';

export const MESSAGE_LIST = BASE_URI + 'Users/Messages/list.php?';
export const ADD_MESSAGE = BASE_URI + 'Users/Messages/add.php';

export const ADD_BOOKING = BASE_URI + 'Bookings/add.php';
export const CHECK_BOOKING_DATE = BASE_URI + 'Bookings/bookable.php?';
export const UPDATE_BOOKING = BASE_URI + 'Bookings/update.php';

// Transaction
export const RENTER_TRANSACTION = BASE_URI + 'Users/transaction_user.php?';
export const OWNER_TRANSACTION = BASE_URI + 'Users/transaction_owner.php?';

// Review
export const GIVE_REVIEW = BASE_URI + 'Bookings/review.php';

// Bank Account update
export const OWNER_UPDATE = BASE_URI + 'Users/owner_update.php';
export const GET_BANKDETAILS = BASE_URI + 'Users/bankinfo.php?';

// Verify Renter's vehicle
export const UPLOAD_OWNER_VEHICLE_IMAGES =
  BASE_URI + 'Bookings/upload-photos.php';

// Notification
export const NOTIFICATION_URL = BASE_URI + 'Users/notifications.php';

// OneSignal
export const UPDATE_ONESIGNAL_ID = BASE_URI + 'Users/update_onesignal.php';

// vouched
export const UPDATE_VOUCHED_JOB = BASE_URI + 'Users/update_vouched.php';

// page content
export const TIPS_CONTENT = BASE_URI + 'Pages/tips.php';
export const INSURANCE_CONTENT = BASE_URI + 'Pages/insurance.php';
export const TERMS_CONTENT = BASE_URI + 'Pages/terms.php';
export const PRIVACY_CONTENT = BASE_URI + 'Pages/privacy.php';
export const DMCA_CONTENT = BASE_URI + 'Pages/Dmca/admin_list.php';
export const DEPOSIT_CONTENT = BASE_URI + 'Pages/deposit.php';
export const ABOUT_US = BASE_URI + 'Pages/aboutus.php';

// contact us
export const CONTACT_US = BASE_URI + 'Pages/contactus.php';

// Block date
export const ADD_BLOCK_DATE = BASE_URI + 'Items/Block/add.php?';
export const BLOCK_DATE_LIST = BASE_URI + 'Items/Block/list.php?';

// item image
export const UPLOAD_SIMPLE_ITEM_IMAGE = BASE_URI + 'Items/Images/simple_upload.php';

// admin
export const ADMIN_ALL_ADMINS = BASE_URI + 'Pages/Admins/admin_list.php';
export const ADMIN_ADD_ADMIN = BASE_URI + 'Pages/Admins/admin_add.php';
export const ADMIN_EDIT_ADMIN = BASE_URI + 'Pages/Admins/admin_edit.php';
export const ADMIN_IMAGE_ADMIN = BASE_URI + 'Pages/Admins/admin_image.php';
export const ADMIN_PASSWORD_ADMIN = BASE_URI + 'Pages/Admins/admin_password.php';
export const ADMIN_ALL_MEMBERS = BASE_URI + 'Pages/Users/admin_list.php';
export const ADMIN_DEL_MEMBER = BASE_URI + 'Pages/Users/admin_delete.php';
export const ADMIN_ACTIVE_MEMBER = BASE_URI + 'Pages/Users/admin_activate.php';
export const ADMIN_ADD_MEMBER = BASE_URI + 'Pages/Users/admin_add.php';
export const ADMIN_EDIT_MEMBER = BASE_URI + 'Pages/Users/admin_edit.php';
export const ADMIN_EMAIL_MEMBER = BASE_URI + 'Pages/Users/admin_email.php';
export const ADMIN_PASSWORD_MEMBER = BASE_URI + 'Pages/Users/admin_password.php';
export const ADMIN_LOGIN = BASE_URI + 'Pages/Login/login.php';
export const ADMIN_ALL_CATEGORIES = BASE_URI + 'Pages/Categories/admin_list.php';
export const ADMIN_ADD_CATEGORY = BASE_URI + 'Pages/Categories/admin_add.php';
export const ADMIN_EDIT_CATEGORY = BASE_URI + 'Pages/Categories/admin_edit.php';
export const ADMIN_DEL_CATEGORY = BASE_URI + 'Pages/Categories/admin_delete.php';
export const ADMIN_ACTIVE_CATEGORY = BASE_URI + 'Pages/Categories/admin_activate.php';
export const ADMIN_ALL_MAKES = BASE_URI + 'Pages/Makes/admin_list.php';
export const ADMIN_EDIT_MAKE = BASE_URI + 'Pages/Makes/admin_edit.php';
export const ADMIN_DEL_MAKE = BASE_URI + 'Pages/Makes/admin_delete.php';
export const ADMIN_ACTIVE_MAKE = BASE_URI + 'Pages/Makes/admin_activate.php';
export const ADMIN_ALL_MODELS = BASE_URI + 'Pages/Models/admin_list.php';
export const ADMIN_ADD_MODEL = BASE_URI + 'Pages/Models/admin_add.php';
export const ADMIN_EDIT_MODEL = BASE_URI + 'Pages/Models/admin_edit.php';
export const ADMIN_DEL_MODEL = BASE_URI + 'Pages/Models/admin_delete.php';
export const ADMIN_ACTIVE_MODEL = BASE_URI + 'Pages/Models/admin_activate.php';
export const ADMIN_ALL_USERIDS = BASE_URI + 'Pages/UserIds/admin_list.php';
export const ADMIN_ACTIVE_USERID = BASE_URI + 'Pages/UserIds/admin_activate.php';
export const ADMIN_DEL_USERID = BASE_URI + 'Pages/UserIds/admin_delete.php';
export const ADMIN_ALL_ITEMS = BASE_URI + 'Pages/Items/admin_list.php';
export const ADMIN_ACTIVE_ITEM = BASE_URI + 'Pages/Items/admin_activate.php';
export const ADMIN_EDIT_ITEM = BASE_URI + 'Pages/Items/admin_edit.php';
export const ADMIN_DEL_ITEM = BASE_URI + 'Pages/Items/admin_delete.php';
export const ADMIN_EMAIL_ITEM = BASE_URI + 'Pages/Items/admin_email.php';
export const ADMIN_ALL_FEATURES = BASE_URI + 'Pages/Features/admin_list.php';
export const ADMIN_ADD_FEATURE = BASE_URI + 'Pages/Features/admin_add.php';
export const ADMIN_DEL_FEATURE = BASE_URI + 'Pages/Features/admin_delete.php';
export const ADMIN_ALL_IMAGES = BASE_URI + 'Pages/ItemImages/admin_list.php';
export const ADMIN_ADD_IMAGE = BASE_URI + 'Pages/ItemImages/admin_add.php';
export const ADMIN_EDIT_IMAGE = BASE_URI + 'Pages/ItemImages/admin_edit.php';
export const ADMIN_DEL_IMAGE = BASE_URI + 'Pages/ItemImages/admin_delete.php';
export const ADMIN_ALL_BOOKINGS = BASE_URI + 'Pages/Booking/admin_list.php';
export const ADMIN_BOOKING_PHOTO_STATUS = BASE_URI + 'Pages/Booking/admin_photo_status.php';
export const ADMIN_BOOKING_OWNER_RECEIVABLE = BASE_URI + 'Pages/Booking/admin_edit_owner_receivable.php';
export const ADMIN_BOOKING_RELEASE_RENT = BASE_URI + 'Pages/Booking/admin_booking_release_rent.php';
export const ADMIN_BOOKING_REFUND_DEPOSIT = BASE_URI + 'Pages/Booking/admin_booking_refund_deposit.php';
export const ADMIN_BOOKING_TOTAL_AMOUNT = BASE_URI + 'Pages/Booking/admin_booking_total_amount.php';
export const ADMIN_BOOKING_RELEASE_DEPOSIT = BASE_URI + 'Pages/Booking/admin_booking_release_deposit.php';
export const ADMIN_BOOKING_FULL_PAID = BASE_URI + 'Pages/Booking/admin_booking_full_paid.php';
export const ADMIN_BOOKING_RESENT_EMAIL = BASE_URI + 'Pages/Booking/admin_resend_checkout_email.php';
export const ADMIN_BOOKING_PULL_INFORMATION = BASE_URI + 'Pages/Booking/admin_pull_transfer_information.php';
export const ADMIN_ALL_TRANSACTIONS = BASE_URI + 'Pages/Transactions/admin_transaction_list.php';
export const ADMIN_ALL_TRANSACTION_ATTEMPTS = BASE_URI + 'Pages/Transactions/admin_attempt_list.php';
export const ADMIN_ALL_TESTIMONIAL = BASE_URI + 'Pages/Testimonials/admin_list.php';
export const ADMIN_ACTIVE_TESTIMONIAL = BASE_URI + 'Pages/Testimonials/admin_activate.php';
export const ADMIN_ADD_TESTIMONIAL = BASE_URI + 'Pages/Testimonials/admin_add.php';
export const ADMIN_IMAGE_TESTIMONIAL = BASE_URI + 'Pages/Testimonials/admin_image.php';
export const ADMIN_EDIT_TESTIMONIAL = BASE_URI + 'Pages/Testimonials/admin_edit.php';
export const ADMIN_DEL_TESTIMONIAL = BASE_URI + 'Pages/Testimonials/admin_delete.php';
export const ADMIN_ALL_EMAIL_TEMPLATE = BASE_URI + 'Pages/EmailTemplates/admin_list.php';
export const ADMIN_ACTIVE_EMAIL_TEMPLATE = BASE_URI + 'Pages/EmailTemplates/admin_activate.php';
export const ADMIN_EDIT_EMAIL_TEMPLATE = BASE_URI + 'Pages/EmailTemplates/admin_edit.php';
export const ADMIN_DEPOSIT_LIST = BASE_URI + 'Pages/Deposit/admin_list.php';
export const ADMIN_ADD_DEPOSIT = BASE_URI + 'Pages/Deposit/admin_add.php';
export const ADMIN_EDIT_DEPOSIT = BASE_URI + 'Pages/Deposit/admin_edit.php';
export const ADMIN_DEL_DEPOSIT = BASE_URI + 'Pages/Deposit/admin_delete.php';
export const ADMIN_DMCA_LIST = BASE_URI + 'Pages/Dmca/admin_list.php';
export const ADMIN_ADD_DMCA = BASE_URI + 'Pages/Dmca/admin_add.php';
export const ADMIN_EDIT_DMCA = BASE_URI + 'Pages/Dmca/admin_edit.php';
export const ADMIN_DEL_DMCA = BASE_URI + 'Pages/Dmca/admin_delete.php';
export const ADMIN_ACTIVE_DMCA = BASE_URI + 'Pages/Dmca/admin_activate.php';
export const ADMIN_TERM_LIST = BASE_URI + 'Pages/Term/admin_list.php';
export const ADMIN_ADD_TERM = BASE_URI + 'Pages/Term/admin_add.php';
export const ADMIN_EDIT_TERM = BASE_URI + 'Pages/Term/admin_edit.php';
export const ADMIN_DEL_TERM = BASE_URI + 'Pages/Term/admin_delete.php';
export const ADMIN_ACTIVE_TERM = BASE_URI + 'Pages/Term/admin_activate.php';
export const ADMIN_POLICY_LIST = BASE_URI + 'Pages/Policy/admin_list.php';
export const ADMIN_ADD_POLICY = BASE_URI + 'Pages/Policy/admin_add.php';
export const ADMIN_EDIT_POLICY = BASE_URI + 'Pages/Policy/admin_edit.php';
export const ADMIN_DEL_POLICY = BASE_URI + 'Pages/Policy/admin_delete.php';
export const ADMIN_ACTIVE_POLICY = BASE_URI + 'Pages/Policy/admin_activate.php';
export const ADMIN_TIPS_LIST = BASE_URI + 'Pages/Tips/admin_list.php';
export const ADMIN_ADD_TIPS = BASE_URI + 'Pages/Tips/admin_add.php';
export const ADMIN_EDIT_TIPS = BASE_URI + 'Pages/Tips/admin_edit.php';
export const ADMIN_DEL_TIPS = BASE_URI + 'Pages/Tips/admin_delete.php';
export const ADMIN_ACTIVE_TIPS = BASE_URI + 'Pages/Tips/admin_activate.php';
export const ADMIN_PAGES_LIST = BASE_URI + 'Pages/Pages/admin_list.php';
export const ADMIN_ADD_PAGES = BASE_URI + 'Pages/Pages/admin_add.php';
export const ADMIN_EDIT_PAGES = BASE_URI + 'Pages/Pages/admin_edit.php';
export const ADMIN_DEL_PAGES = BASE_URI + 'Pages/Pages/admin_delete.php';
export const ADMIN_ACTIVE_PAGES = BASE_URI + 'Pages/Pages/admin_activate.php';
export const ADMIN_ABOUT_US_LIST = BASE_URI + 'Pages/AboutUs/admin_list.php';
export const ADMIN_ADD_ABOUT_US = BASE_URI + 'Pages/AboutUs/admin_add.php';
export const ADMIN_EDIT_ABOUT_US = BASE_URI + 'Pages/AboutUs/admin_edit.php';
export const ADMIN_DEL_ABOUT_US = BASE_URI + 'Pages/AboutUs/admin_delete.php';
export const ADMIN_ACTIVE_ABOUT_US = BASE_URI + 'Pages/AboutUs/admin_activate.php';
export const ADMIN_ALL_NOTIFICATION = BASE_URI + 'Pages/Notifications/admin_list.php';
export const ADMIN_DEL_NOTIFICATION = BASE_URI + 'Pages/Notifications/admin_delete.php';
export const ADMIN_DASHBOARD_TABLECOUNT = BASE_URI + 'Pages/Dashboard/table_count.php';
export const ADMIN_DASHBOARD_TABLEDATA = BASE_URI + 'Pages/Dashboard/table_data.php';
export const ADMIN_DASHBOARD_FEE = BASE_URI + 'Pages/Dashboard/fee_data.php';
export const ADMIN_DASHBOARD_FEE_UPDATE = BASE_URI + 'Pages/Dashboard/fee_data_update.php';
export const ADMIN_ALL_REFERRALS = BASE_URI + 'Pages/Referral/admin_list.php';
export const ADMIN_ALL_POSTS = BASE_URI + 'Pages/Post/admin_list.php';
export const ADMIN_ALL_EVENTS = BASE_URI + 'Pages/Event/admin_list.php';
export const ADMIN_ALL_MEDIAS = BASE_URI + 'Pages/Media/admin_list.php';
