import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import {
  AllItemReducer,
  ItemCourtesyReducer,
  ItemFeatureReducer,
  ItemImageReducer,
  WishItemReducer,
  UserItemReducer,
  ItemTripDateReducer,
} from './reducers/itemReducers';
import {
  UserIdReducer,
  UserInfoReducer,
  UserVerifiedReducer,
  LicenseVerifiedReducer,
} from './reducers/userReducers';
import {
  UserMessageReducer
} from './reducers/messageReducers';
import {
  PendingTripsReducer,
  PendingBookingReducer
} from './reducers/bookingReducers';
import {
  DocumentReducer
} from './reducers/documentReducers';
import {
  ReservedTimeReducer,
  PolicyDataReducer,
} from './reducers/miscReducers';

const initialState = {};
const rootReducer = combineReducers({
  allItems: AllItemReducer,
  allItemImages: ItemImageReducer,
  allItemFeatures : ItemFeatureReducer,
  allItemCourtesies : ItemCourtesyReducer,
  userId: UserIdReducer,
  userVerified: UserVerifiedReducer,
  licenseVerified: LicenseVerifiedReducer,
  userInfo: UserInfoReducer,
  wishItems: WishItemReducer,
  userItems: UserItemReducer,
  userMessages: UserMessageReducer,
  pendingTrips: PendingTripsReducer,
  pendingBookings: PendingBookingReducer,
  documents: DocumentReducer,
  itemTripDates: ItemTripDateReducer,
  reservedTime: ReservedTimeReducer,
  policyData: PolicyDataReducer,
});

export default createStore(
  rootReducer,
  initialState,
  compose(applyMiddleware(thunk))
);