import React from 'react';

const Home = React.lazy(() => import('../pages/home/Home'));
const Insurance = React.lazy(() => import('../pages/insurance/Insurance'));
const ItemDetailScreen = React.lazy(() => import('../pages/items/ItemDetailScreen'));
const ItemCheckoutScreen = React.lazy(() => import('../pages/checkout/ItemCheckoutScreen'));
const TipsScreen = React.lazy(() => import('../pages/tips/NewTipsScreen'));
const TermsScreen = React.lazy(() => import('../pages/terms/TermsScreen'));
const PrivacyPolicy = React.lazy(() => import('../pages/policy/PrivacyPolicy'));
const DMCA = React.lazy(() => import('../pages/policy/DMCA'));
const CancelationPolicy = React.lazy(() => import('../pages/policy/CancelationPolicy'));
const PreviewAgreement = React.lazy(() => import('../pages/policy/PreviewAgreement'));
const Account = React.lazy(() => import('../pages/account/AccountScreen'));
const Payment = React.lazy(() => import('../pages/payment/PaymentScreen'));
const MyFavorites = React.lazy(() => import('../pages/favorite/MyFavorites'));
const ContactUs = React.lazy(() => import('../pages/contactus/ContactUs'));
const AboutUs = React.lazy(() => import('../pages/aboutus/AboutUs'));
const HostScreen = React.lazy(() => import('../pages/host/HostScreen'));
const EditHostScreen = React.lazy(() => import('../pages/host/EditHostScreen'));
const TransactionScreen = React.lazy(() => import('../pages/host/TransactionScreen'));
const BookingsScreen = React.lazy(() => import('../pages/bookings/BookingsScreen'));
const TripsScreen = React.lazy(() => import('../pages/trips/TripsScreen'));
const MessageScreen = React.lazy(() => import('../pages/message/MessageScreen'));
const ProfileInfoScreen = React.lazy(() => import('../pages/profile/ProfileInfoScreen'));
const SearchScreen = React.lazy(() => import('../pages/search/SearchScreen'));
const AdminLogin = React.lazy(() => import('../pages/admin/login/AdminLogin'));
const AdminDashboard = React.lazy(() => import('../pages/admin/dashboard/AdminDashboard'));
const AdminAdministrator = React.lazy(() => import('../pages/admin/user/AdminAdministrator'));
const AdminEditAdmin = React.lazy(() => import('../pages/admin/user/AdminEditAdmin'));
const AdminMembers = React.lazy(() => import('../pages/admin/user/AdminMembers'));
const AdminEditMember = React.lazy(() => import('../pages/admin/user/AdminEditMember'));
const AdminTestimonials = React.lazy(() => import('../pages/admin/testimonial/AdminTestimonials'));
const AdminEditTestimonial = React.lazy(() => import('../pages/admin/testimonial/AdminEditTestimonial'));
const AdminEmailTemplates = React.lazy(() => import('../pages/admin/emailTemplate/AdminEmailTemplates'));
const AdminCategories = React.lazy(() => import('../pages/admin/category/AdminCategories'));
const AdminMakes = React.lazy(() => import('../pages/admin/category/AdminMakes'));
const AdminModels = React.lazy(() => import('../pages/admin/category/AdminModels'));
const AdminUserIds = React.lazy(() => import('../pages/admin/userid/AdminUserIds'));
const AdminItems = React.lazy(() => import('../pages/admin/item/AdminItems'));
const AdminEditItem = React.lazy(() => import('../pages/admin/item/AdminEditItem'));
const AdminEditImage = React.lazy(() => import('../pages/admin/item/AdminEditImage'));
const AdminBookings = React.lazy(() => import('../pages/admin/booking/AdminBookings'));
const AdminTransactions = React.lazy(() => import('../pages/admin/transaction/AdminTransactions'));
const AdminTransactionAttempts = React.lazy(() => import('../pages/admin/transaction/AdminTransactionAttempts'));
const AdminDeposit = React.lazy(() => import('../pages/admin/depositInsurance/AdminDeposit'));
const AdminDMCA = React.lazy(() => import('../pages/admin/contents/AdminDmca'));
const AdminTerm = React.lazy(() => import('../pages/admin/contents/AdminTerm'));
const AdminPolicy = React.lazy(() => import('../pages/admin/contents/AdminPolicy'));
const AdminTips = React.lazy(() => import('../pages/admin/contents/AdminTips'));
const AdminPages = React.lazy(() => import('../pages/admin/contents/AdminPages'));
const AdminAboutUs = React.lazy(() => import('../pages/admin/contents/AdminAboutUs'));
const AdminNotifications = React.lazy(() => import('../pages/admin/notification/AdminNotifications'));
const AdminReferrals = React.lazy(() => import('../pages/admin/referral/AdminReferrals'));
const AdminPosts = React.lazy(() => import('../pages/admin/post/AdminPosts'));
const AdminEvents = React.lazy(() => import('../pages/admin/event/AdminEvents'));
const AdminMedias = React.lazy(() => import('../pages/admin/media/AdminMedias'));

const frontRoutes = [
  { path: '/', name: 'Landing Page', component: Home, exact: true },
  { path: '/insurance', name: 'Insurance', component: Insurance, exact: true },
  { path: '/items/:id', name: 'Item Details', component: ItemDetailScreen},
  { path: '/checkout/:id', name: 'Item Checkout', component: ItemCheckoutScreen},
  { path: '/tips', name: 'Tips', component: TipsScreen},
  { path: '/trips/:id', name: 'Item Details', component: ItemDetailScreen},
  { path: '/terms', name: 'Terms and Conditions', component: TermsScreen, exact: true},
  { path: '/dmca', name: 'DMCA', component: DMCA, exact: true},
  { path: '/policy/privacy', name: 'Privacy Policy', component: PrivacyPolicy, exact: true},
  { path: '/policy/cancelation', name: 'Cancelation Policy', component: CancelationPolicy, exact: true},
  { path: '/policy/risk', name: 'Preview Risk', component: PreviewAgreement, exact: true},
  { path: '/policy/helmet', name: 'Preview Helmet', component: PreviewAgreement, exact: true},
  { path: '/pages/contact', name: 'ContactUs', component: ContactUs, exact: true},
  { path: '/aboutus', name: 'About Us', component: AboutUs, exact: true},
  { path: '/messages', name: 'Messages', component: MessageScreen, exact: true},
  { path: '/profile/:id', name: 'ProfileInfo', component: ProfileInfoScreen},
  { path: '/search', name: 'Search', component: SearchScreen},
];

const innerRoutes = [
  { path: '/account', name: 'Account', component: Account, exact: true },
  { path: '/payment', name: 'Payment', component: Payment, exact: true },
  { path: '/favorites', name: 'My Favorites', component: MyFavorites, exact: true },
  { path: '/host', name: 'Hosts', component: HostScreen, exact: true },
  { path: '/host/reviews', name: 'Hosts', component: HostScreen, exact: true },
  { path: '/host/:id', name: 'VehicleInfo', component: EditHostScreen },
  { path: '/transactions', name: 'Transactions', component: TransactionScreen, exact: true },
  { path: '/bookings', name: 'Bookings', component: BookingsScreen, exact: true },
  { path: '/trips', name: 'Trips', component: TripsScreen, exact: true },
  { path: '/trips/pending', name: 'Trips Pending', component: TripsScreen, exact: true },
];

const adminRoutes = [
  { path: '/admin', name: 'Admin Login', component: AdminLogin, exact: true },
  { path: '/admin/dashboard', name: 'Dashboard', component: AdminDashboard, exact: true },
  { path: '/admin/admins', name: 'Administrator', component: AdminAdministrator, exact: true },
  { path: '/admin/admin/edit/:id', name: 'Edit Admin', component: AdminEditAdmin },
  { path: '/admin/admin/view/:id', name: 'View Admin', component: AdminEditAdmin },
  { path: '/admin/admin/add', name: 'View Admin', component: AdminEditAdmin, exact: true },
  { path: '/admin/users', name: 'Members', component: AdminMembers, exact: true },
  { path: '/admin/user/edit/:id', name: 'Edit Member', component: AdminEditMember },
  { path: '/admin/user/view/:id', name: 'View Member', component: AdminEditMember },
  { path: '/admin/user/add', name: 'View Member', component: AdminEditMember, exact: true },
  { path: '/admin/testimonials', name: 'Testimonials', component: AdminTestimonials, exact: true },
  { path: '/admin/testimonial/edit/:id', name: 'Edit Testimonials', component: AdminEditTestimonial },
  { path: '/admin/testimonial/add', name: 'Add Testimonials', component: AdminEditTestimonial, exact: true },
  { path: '/admin/email_templates', name: 'Email Templates', component: AdminEmailTemplates, exact: true },
  { path: '/admin/categories', name: 'Categories', component: AdminCategories, exact: true },
  { path: '/admin/makes', name: 'Makes', component: AdminMakes, exact: true },
  { path: '/admin/models', name: 'Models', component: AdminModels, exact: true },
  { path: '/admin/userids', name: 'UserIds', component: AdminUserIds, exact: true },
  { path: '/admin/items', name: 'Items', component: AdminItems, exact: true },
  { path: '/admin/item/edit/:id', name: 'Edit Item', component: AdminEditItem },
  { path: '/admin/item/view/:id', name: 'View Item', component: AdminEditItem },
  { path: '/admin/item/image/:id', name: 'Upload Image', component: AdminEditImage },
  { path: '/admin/bookings', name: 'Bookings', component: AdminBookings, exact: true },
  { path: '/admin/transactions', name: 'Transactions', component: AdminTransactions, exact: true },
  { path: '/admin/transaction_attempts', name: 'Transaction Attempts', component: AdminTransactionAttempts, exact: true },
  { path: '/admin/deposit', name: 'Deposit', component: AdminDeposit, exact: true },
  { path: '/admin/dmca', name: 'Dmca', component: AdminDMCA, exact: true },
  { path: '/admin/term', name: 'Term', component: AdminTerm, exact: true },
  { path: '/admin/policy', name: 'Policy', component: AdminPolicy, exact: true },
  { path: '/admin/tips', name: 'Tips', component: AdminTips, exact: true },
  { path: '/admin/pages', name: 'Tips', component: AdminPages, exact: true },
  { path: '/admin/about_us', name: 'Tips', component: AdminAboutUs, exact: true },
  { path: '/admin/notifications', name: 'Notifications', component: AdminNotifications, exact: true },
  { path: '/admin/referrals', name: 'Referrals', component: AdminReferrals, exact: true },
  { path: '/admin/posts', name: 'Posts', component: AdminPosts, exact: true },
  { path: '/admin/events', name: 'Events', component: AdminEvents, exact: true },
  { path: '/admin/medias', name: 'Medias', component: AdminMedias, exact: true },
];

export { frontRoutes, innerRoutes, adminRoutes };
