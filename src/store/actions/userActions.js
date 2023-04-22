import * as APIHandler from '../../apis/APIHandler';
import { GET_USER_INFO, SET_USER_ID, SET_USER_VERIFIED, SET_LICENSE_VERIFIED } from '../actionTypes';

export const setUserId = (userId) => (dispatch) => {
  dispatch({
    type: SET_USER_ID,
    payload: userId,
  })
}

export const getUserInfo = (userid) => (dispatch) => {
  APIHandler.getUserInfo(userid).then(data => {
    dispatch({
      type: GET_USER_INFO,
      payload: data,
    })
  });
}

export const setUserVerified = (verified) => (dispatch) => {
  dispatch({
    type: SET_USER_VERIFIED,
    payload: verified,
  })
}

export const setLicenseVerified = (verified) => (dispatch) => {
  dispatch({
    type: SET_LICENSE_VERIFIED,
    payload: verified,
  })
}
