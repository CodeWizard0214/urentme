import * as APIHandler from '../../apis/APIHandler';
import { GET_USER_MESSAGES } from '../actionTypes.js';

export const getUserMessages = (userid) => (dispatch) => {
  APIHandler.getUserMessages(userid).then(data => {
    dispatch({
      type: GET_USER_MESSAGES,
      payload: data,
    })
  });
}