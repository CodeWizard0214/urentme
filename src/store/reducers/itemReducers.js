import moment from 'moment';
import {
  GET_ALL_ITEMS,
  GET_ITEM_COURTESIES,
  GET_ITEM_FEATURES,
  GET_ITEM_IMAGES,
  GET_WISH_ITEMS,
  GET_USER_ITEMS,
  ITEM_TRIP_DATE
} from '../actionTypes';

const initialState = [];

export const AllItemReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_ITEMS: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};

export const ItemFeatureReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_ITEM_FEATURES: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};

export const ItemCourtesyReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_ITEM_COURTESIES: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};

export const ItemImageReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_ITEM_IMAGES: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};

export const WishItemReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_WISH_ITEMS: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};

export const UserItemReducer = function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_ITEMS: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};

export const ItemTripDateReducer = function (state = {
  itemId: 0,
  beginDate: moment(new Date()).add(2, 'day'),
  endDate: moment(new Date()).add(4, 'day'),
  startTime: 8,
  endTime: 8,
}, action) {
  switch (action.type) {
    case ITEM_TRIP_DATE: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
