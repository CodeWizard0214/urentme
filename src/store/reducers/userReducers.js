import { SET_USER_ID, GET_USER_INFO, SET_USER_VERIFIED, SET_LICENSE_VERIFIED } from '../actionTypes';
import * as Constant from '../../constants/constant';

export const UserIdReducer = function(state = '', action) {
  switch (action.type) {
    case SET_USER_ID: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export const UserInfoReducer = function (state = {}, action) {
  switch (action.type) {
    case GET_USER_INFO: {
      return {...action.payload};
    }
    default: {
      return state;
    }
  }
};

export const UserVerifiedReducer = function(state = false, action) {
  switch (action.type) {
    case SET_USER_VERIFIED: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export const LicenseVerifiedReducer = function(state = Constant.LICENSE_STATUS_NONE, action) {
  switch (action.type) {
    case SET_LICENSE_VERIFIED: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
