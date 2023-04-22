import { GET_USER_MESSAGES } from '../actionTypes';

export const UserMessageReducer = function (state = [], action) {
  switch (action.type) {
    case GET_USER_MESSAGES: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};
