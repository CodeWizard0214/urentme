import { GET_DOCUMENTS } from '../actionTypes';

export const DocumentReducer = (state = [], action) => {
  switch (action.type) {
    case GET_DOCUMENTS: {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};
