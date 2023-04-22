import * as APIHandler from '../../apis/APIHandler';
import {
  GET_ALL_ITEMS,
  GET_ITEM_COURTESIES,
  GET_ITEM_FEATURES,
  GET_ITEM_IMAGES,
  GET_WISH_ITEMS,
  GET_USER_ITEMS,
  ITEM_TRIP_DATE,
} from '../actionTypes.js';

export const getAllItems = () => (dispatch) => {
  APIHandler.getAllItems().then(data => {
    dispatch({
      type: GET_ALL_ITEMS,
      payload: data,
    })
  });
};

export const getItemImages = () => (dispatch) => {
  APIHandler.getItemImages().then(data => {
    dispatch({
      type: GET_ITEM_IMAGES,
      payload: data,
    })
  });
};

export const getItemFeatures = () => (dispatch) => {
  APIHandler.getItemFeatures().then(data => {
    dispatch({
      type: GET_ITEM_FEATURES,
      payload: data,
    })
  });
};

export const getItemCourtesies = () => (dispatch) => {
  APIHandler.getItemCourtesies().then(data => {
    dispatch({
      type: GET_ITEM_COURTESIES,
      payload: data,
    })
  });
};

export const getWishItems = (userid) => (dispatch) => {
  APIHandler.getWishItems(userid).then(data => {
    if (data.type === 'success') {
      dispatch({
        type: GET_WISH_ITEMS,
        payload: data.response,
      })
    }
  });
}

export const getUserItems = (userid) => (dispatch) => {
  APIHandler.getUserItems(userid).then(data => {
    dispatch({
      type: GET_USER_ITEMS,
      payload: data,
    });
  });
}

export const setItemTripDate = (period) => (dispatch) => {
  dispatch({
    type: ITEM_TRIP_DATE,
    payload: period,
  })
}
