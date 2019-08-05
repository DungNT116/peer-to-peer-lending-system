import {
  SET_IS_TRADING,
  SET_IS_VIEWDETAIL,
  SET_IS_HISTORY,
  SET_IS_HISTORY_DETAIL
} from "redux/action/types";
import { SET_IS_PAY_MANY, SET_IS_LEND_MANY } from "../action/types";
let STATE = {
  isTrading: false,
  isViewDetail: false,
  isHistory: false,
  isHistoryDetail: false,
  isLendMany: false,
  isPayMany: false
};

export const ViewDetailReducers = (state = STATE, action) => {
  switch (action.type) {
    case SET_IS_HISTORY:
      state = {
        ...state,
        isHistory: action.payload
      };
      break;
    case SET_IS_VIEWDETAIL:
      state = {
        ...state,
        isViewDetail: action.payload
      };
      break;
    case SET_IS_TRADING:
      state = {
        ...state,
        isTrading: action.payload
      };
      break;
    case SET_IS_HISTORY_DETAIL:
      state = {
        ...state,
        isHistoryDetail: action.payload
      };
      break;
    case SET_IS_LEND_MANY:
      state = {
        ...state,
        isLendMany: action.payload
      };
      break;
    case SET_IS_PAY_MANY:
      state = {
        ...state,
        isPayMany: action.payload
      };
      break;
    default:
      return state;
  }
  return state;
};
