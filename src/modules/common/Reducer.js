import React from "react";
import { List, Map } from "immutable";
import { ModuleEvents } from "./Actions";

const initialState = Map({
  alertStatus: {
    message: "",
    alertType: null,
    successStatus: null,
    isOpenFailedAlert: false,
    isOpenWarningAlert: false,
    isOpenSuccessAlert: false,
  },
  loadingAction: { loading: false, action: {} },
});

export const Reducer = (state = initialState, action) => {
  const { payload, type, error } = action;

  switch (action.type) {
    case ModuleEvents.LOADING_STARTED: {
      return state.set("loadingAction", { loading: true, action: payload });
    }
    case ModuleEvents.LOADING_FINISHED: {
      return state.set("loadingAction", { loading: false, action: payload });
    }
    case ModuleEvents.OPEN_ALERT_BOX: {
      const { alertType, status, successStatus, message } = payload;
      let alertStatus = state.get("alertStatus");
      alertStatus.alertType = alertType;
      alertStatus.successStatus = successStatus;
      if (
        alertType === "CREATE" ||
        alertType === "UPDATE" ||
        alertType === "DELETE"
      ) {
        if (successStatus === "SUCCESS") {
          alertStatus.isOpenSuccessAlert = status;
        } else {
          alertStatus.isOpenFailedAlert = status;
        }
      } else {
        alertStatus.message = message;
        alertStatus.isOpenWarningAlert = status;
      }
      return state.set("alertStatus", { ...alertStatus });
    }
    default:
      return state;
  }
};
export default Reducer;
