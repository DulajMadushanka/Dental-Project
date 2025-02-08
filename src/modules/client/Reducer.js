import { Map } from "immutable";
import {ModuleEvents} from "./Actions";

const initialState = Map({
  patientList: [],
  patientTreatmentList: [],
  mapPatientList: [],
  isPatientCreateLoading: false,
  isPatientUpdateLoading: false,
  isPatientSearchLoading: false
});

export const Reducer = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ModuleEvents.FETCH_ALL_PATIENTS: {
      const { result, mapList } = payload;
      if (result && !result.error) {
        // const mapList =
        return state.set("patientList", [...result.items]).set("mapPatientList", [...mapList]);
      }
      return state;
    }
    case ModuleEvents.SEARCH_PATIENT: {
      if (payload && !payload.error) {
        // const mapList =
        return state.set("patientList", [...payload.items]);
      }
      return state;
    }
    case ModuleEvents.FETCH_PATIENT_TREATMENTS: {
      if (payload && !payload.error) {
        return state.set("patientTreatmentList", [...payload.items]);
      }
      return state;
    }
    case ModuleEvents.CLEAR_PATIENT_TREATMENTS: {
      return state.set("patientTreatmentList", [])
    }
    case ModuleEvents.CHANGE_PATIENT_CREATE_LOADING: {
      return state.set("isPatientCreateLoading", payload)
    }
    case ModuleEvents.CHANGE_PATIENT_UPDATE_LOADING: {
      return state.set("isPatientUpdateLoading", payload)
    }
    case ModuleEvents.CHANGE_PATIENT_SEARCH_LOADING: {
      return state.set("isPatientSearchLoading", payload)
    }

    default:
      return state;
  }
};

export default Reducer;
