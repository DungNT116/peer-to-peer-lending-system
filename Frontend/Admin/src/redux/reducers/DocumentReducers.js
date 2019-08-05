import {
  SET_DETAIL_DOCUMENT_DATA,
  SET_TYPE_DOCUMENT_DATA
} from "redux/action/types";
let STATE = {
  userInfo: {},
  docType: {}
};

export const DocumentReducers = (state = STATE, action) => {
  switch (action.type) {
    case SET_DETAIL_DOCUMENT_DATA:
      state = {
        ...state,
        userInfo: action.payload
      };
      break;
    case SET_TYPE_DOCUMENT_DATA:
      state = {
        ...state,
        docType: action.payload
      };
      break;
    default:
      return state;
  }
  return state;
};
