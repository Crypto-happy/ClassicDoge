import { all, fork } from "redux-saga/effects";

import DataSaga from "./data/saga";

export default function* rootSaga() {
  yield all([fork(DataSaga)]);
}
