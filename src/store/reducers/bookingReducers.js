import { GET_PENDING_TRIPS, GET_PENDING_BOOKINGS } from '../actionTypes';

const initialState = [];

export const PendingTripsReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_PENDING_TRIPS: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};

export const PendingBookingReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_PENDING_BOOKINGS: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};
  