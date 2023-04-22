import * as APIHandler from '../../apis/APIHandler';
import { GET_PENDING_TRIPS, GET_PENDING_BOOKINGS } from '../actionTypes';

export const getPendingTrips = (userId) => (dispatch) => {
  APIHandler.getPendingTrips(userId).then(data => {
    dispatch({
      type: GET_PENDING_TRIPS,
      payload: data,
    })
  })
}

export const getPendingBookings = (ownerId) => (dispatch) => {
  APIHandler.getPendingBookings(ownerId).then(data => {
    dispatch({
      type: GET_PENDING_BOOKINGS,
      payload: data,
    })
  })
}