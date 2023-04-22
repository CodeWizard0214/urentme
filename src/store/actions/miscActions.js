import { RESERVED_TIME, POLICY_DATA } from '../actionTypes';

export const setReservedTime = (period) => (dispatch) => {
  dispatch({
    type: RESERVED_TIME,
    payload: period,
  })
}

export const setPolicyData = (item_id, note) => (dispatch) => {
  dispatch({
    type: POLICY_DATA,
    payload: {item_id, note},
  })
}