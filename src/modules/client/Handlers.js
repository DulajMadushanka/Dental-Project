import {ModuleEvents} from "./Actions";
import {Actions} from "../../internals/app/Actions";
import {router} from "../../App";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import moment from 'moment-timezone';

const todayDate = moment().tz("Asia/Colombo").format("YYYY-MM-DD");

export default {
  [ModuleEvents.CREATE_PATIENT]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.client.fetchAllPatients());
      dispatch(Actions.client.changePatientCreateLoading(false));
      dispatch(Actions.patientTreatment.fetchAllPatientTreatments());
      dispatch(Actions.dashboard.getTodayPatientSummary({date: todayDate}));
      return success("Patient successfully created");
    } else {
      dispatch(Actions.client.changePatientCreateLoading(false));
      return warning("Patient creation failed!");
    }
  },
  [ModuleEvents.DELETE_PATIENT]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.client.fetchAllPatients());
      dispatch(Actions.client.changePatientCreateLoading(false));
      dispatch(Actions.patientTreatment.fetchAllPatientTreatments());
      dispatch(Actions.dashboard.getTodayPatientSummary({date: todayDate}));
      return success("Patient successfully deleted");
    } else {
      return warning("Patient deletion failed!");
    }
  },
  [ModuleEvents.UPDATE_PATIENT]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.client.fetchAllPatients());
      dispatch(Actions.client.changePatientUpdateLoading(false));
      dispatch(Actions.patientTreatment.fetchAllPatientTreatments());
      dispatch(Actions.dashboard.getTodayPatientSummary({date: todayDate}));
      return success("Patient successfully updated");
    } else {
      dispatch(Actions.client.changePatientUpdateLoading(false));
      return warning("Patient updation failed!");
    }
  },
  [ModuleEvents.SEARCH_PATIENT]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.client.changePatientSearchLoading(false));
    } else {
      dispatch(Actions.client.changePatientSearchLoading(false));
    }
  },
  [ModuleEvents.FETCH_ALL_PATIENTS]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.client.changePatientSearchLoading(false));
    } else {
      dispatch(Actions.client.changePatientSearchLoading(false));
    }
  },
};


const warning = (alert) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    icon: "error",
    text: alert,
    title: "Oops...",
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonColor: "#FF3333",
  });
};

const success = (alert) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    icon: "success",
    text: alert,
    title: "Success",
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonColor: "#6D71F9",
  });
};
