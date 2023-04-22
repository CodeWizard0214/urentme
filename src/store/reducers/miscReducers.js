import moment from 'moment';
import { RESERVED_TIME, POLICY_DATA } from '../actionTypes';

const initReservedTime = {
  beginDate: moment(new Date()).add(2, 'day'),
  endDate: moment(new Date()).add(4, 'day'),
  startTime: 8,
  endTime: 8,
}

export const ReservedTimeReducer = function (state = initReservedTime, action) {
  switch (action.type) {
    case RESERVED_TIME: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}

const initPolicyData = {
  item_id: 0,
  note: '',
};

export const PolicyDataReducer = function (state = initPolicyData, action) {
  switch (action.type) {
    case POLICY_DATA: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}