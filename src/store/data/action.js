import { GET_DATA, GET_DATA_SUCCESS, GET_DATA_FAIL } from "./actionTypes";

export const getData = () => {
  return {
    type: GET_DATA,
  };
};

export const getDataSuccess = (data) => {
  return {
    type: GET_DATA_SUCCESS,
    payload: data,
  };
};

export const getDataFail = (error) => {
  return {
    type: GET_DATA_FAIL,
    payload: error,
  };
};
