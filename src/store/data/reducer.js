import { GET_DATA, GET_DATA_FAIL, GET_DATA_SUCCESS } from "./actionTypes";

const initialState = {
  data: [],
  loadingData: true,
  error: {
    message: "",
  },
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      state = { ...state, loadingData: true };
      break;

    case GET_DATA_SUCCESS:
      state = { ...state, data: action.payload, loadingData: false };
      break;

    case GET_DATA_FAIL:
      state = {
        ...state,
        error: {
          message: "Error",
        },
        loadingData: false,
      };
      break;

    default:
      state = { ...state };
  }

  return state;
};

export default dataReducer;
