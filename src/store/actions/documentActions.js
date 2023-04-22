import * as APIHandler from '../../apis/APIHandler';
import { GET_DOCUMENTS } from '../actionTypes';

export const getUserDocuments = (userId) => (dispatch) => {
  APIHandler.getAllDocuments(userId).then(data => {
    dispatch({
      type: GET_DOCUMENTS,
      payload: data,
    });
  });
};
