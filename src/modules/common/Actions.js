export const ModuleEvents = {
  LOADING_STARTED: "LOADING_STARTED",
  LOADING_FINISHED: "LOADING_FINISHED",
  OPEN_ALERT_BOX: "OPEN_ALERT_BOX",
};

const createAction =
  (type, action = () => {}, meta) =>
  (...args) => ({
    type,
    payload: action(...args),
    meta,
  });

const loadingStarted = createAction(
  ModuleEvents.LOADING_STARTED,
  (action) => action
);

const loadingFinished = createAction(
  ModuleEvents.LOADING_FINISHED,
  (action) => action
);

const openAlertBox = createAction(
  ModuleEvents.OPEN_ALERT_BOX,
  async (alertType, status, successStatus = true, message = "") => ({
    status,
    alertType,
    successStatus,
    message,
  })
);

const exportedFuction = {
  loadingStarted,
  loadingFinished,
  openAlertBox,
};

export default exportedFuction;
