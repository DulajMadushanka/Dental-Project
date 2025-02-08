import {ModuleEvents} from "./Actions";
import {Actions} from "../../internals/app/Actions";
import {router} from "../../App";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

import moment from 'moment-timezone';

const todayDate = moment().tz("Asia/Colombo").format("YYYY-MM-DD");

export default {
  [ModuleEvents.CREATE_PATIENT_TREATMENT]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.patientTreatment.fetchAllPatientTreatments());
      dispatch(Actions.patientTreatment.changePatientTreatmentCreateLoading(false));
      dispatch(Actions.dashboard.getTodayPatientSummary({date: todayDate}));
      return success("Patient treatment successfully created");
    } else {
      dispatch(Actions.patientTreatment.changePatientTreatmentCreateLoading(false));
      return warning("Patient treatment creation failed!");
    }
  },
  [ModuleEvents.DELETE_PATIENT_TREATMENT]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.patientTreatment.fetchAllPatientTreatments());
      dispatch(Actions.dashboard.getTodayPatientSummary({date: todayDate}));
      return success("Patient treatment successfully deleted");
    } else {
      return warning("Patient treatment deletion failed!");
    }
  },
  [ModuleEvents.UPDATE_PATIENT_TREATMENT]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.patientTreatment.fetchAllPatientTreatments());
      dispatch(Actions.patientTreatment.changePatientTreatmentUpdateLoading(false));
      dispatch(Actions.dashboard.getTodayPatientSummary({date: todayDate}));
      return success("Patient treatment successfully updated");
    } else {
      dispatch(Actions.patientTreatment.changePatientTreatmentUpdateLoading(false));
      return warning("Patient treatment updation failed!");
    }
  },
  [ModuleEvents.SEARCH_PATIENT_TREATMENT]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.patientTreatment.changePatientTreatmentSearchLoading(false));
    } else {
      dispatch(Actions.patientTreatment.changePatientTreatmentSearchLoading(false));
    }
  },
  [ModuleEvents.FETCH_ALL_PATIENT_TREATMENTS]: ({ dispatch, payload, appState }) => {
    if (payload && !payload.error) {
      dispatch(Actions.patientTreatment.changePatientTreatmentSearchLoading(false));
    } else {
      dispatch(Actions.patientTreatment.changePatientTreatmentSearchLoading(false));
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
