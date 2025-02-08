import { Map } from "immutable";
import {ModuleEvents} from "./Actions";

const initialState = Map({
  allPatientTreatmentList: [],
  mapPatientList: [],
  isPatientTreatmentCreateLoading: false,
  isPatientTreatmentUpdateLoading: false,
  isPatientTreatmentSearchLoading: false
});

export const Reducer = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ModuleEvents.FETCH_ALL_PATIENT_TREATMENTS: {
      if (payload && !payload.error) {
        // const mapList =
        return state.set("allPatientTreatmentList", [...payload.items])
      }
      return state;
    }
    case ModuleEvents.SEARCH_PATIENT_TREATMENT: {
      if (payload && !payload.error) {
        // const mapList =
        return state.set("allPatientTreatmentList", [...payload]);
      }
      return state;
    }
    case ModuleEvents.CHANGE_PATIENT_TREATMENT_CREATE_LOADING: {
      return state.set("isPatientTreatmentCreateLoading", payload)
    }
    case ModuleEvents.CHANGE_PATIENT_UPDATE_LOADING: {
      return state.set("isPatientTreatmentUpdateLoading", payload)
    }
    case ModuleEvents.CHANGE_PATIENT_TREATMENT_SEARCH_LOADING: {
      return state.set("isPatientTreatmentSearchLoading", payload)
    }

    default:
      return state;
  }
};

export default Reducer;
