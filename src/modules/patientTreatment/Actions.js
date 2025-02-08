import CustomerRepository from "../../internals/repository/CustomerRepository";
import UserRepository from "../../internals/repository/UserRepository";
import PatientRepository from "../../internals/repository/PatientRepository";
import {mapPatients} from "../../internals/manager/PatientManager";

export const ModuleEvents = {
    FETCH_ALL_PATIENT_TREATMENTS: "FETCH_ALL_PATIENT_TREATMENTS",
  UPDATE_CLIENT: 'UPDATE_CLIENT',
    CREATE_PATIENT_TREATMENT: 'CREATE_PATIENT_TREATMENT',
    FETCH_PATIENT_TREATMENTS: 'FETCH_PATIENT_TREATMENTS',
    CLEAR_PATIENT_TREATMENTS: 'CLEAR_PATIENT_TREATMENTS',
    UPDATE_PATIENT_TREATMENT: 'UPDATE_PATIENT_TREATMENT',
    DELETE_PATIENT_TREATMENT: 'DELETE_PATIENT_TREATMENT',
    CHANGE_PATIENT_TREATMENT_CREATE_LOADING: 'CHANGE_PATIENT_TREATMENT_CREATE_LOADING',
    CHANGE_PATIENT_UPDATE_LOADING: 'CHANGE_PATIENT_UPDATE_LOADING',
    SEARCH_PATIENT_TREATMENT: 'SEARCH_PATIENT_TREATMENT',
    CHANGE_PATIENT_TREATMENT_SEARCH_LOADING: 'CHANGE_PATIENT_TREATMENT_SEARCH_LOADING',
    CHANGE_PATIENT_TREATMENT_UPDATE_LOADING: 'CHANGE_PATIENT_TREATMENT_UPDATE_LOADING',
};

const createAction =
  (type, action = () => {}, meta) =>
  (...args) => ({
    type,
    payload: action(...args),
    meta,
  });

const fetchAllPatientTreatments = createAction(
  ModuleEvents.FETCH_ALL_PATIENT_TREATMENTS,
  async () => {
    const result = await PatientRepository.fetchAllPatientTreatments();
    return result
  }
);

const fetchPatientTreatments = createAction(
    ModuleEvents.FETCH_PATIENT_TREATMENTS,
    async (param) => {
        const result = await PatientRepository.fetchPatientTreatments(param);
        return result
    }
);

const clearPatientTreatments = createAction(
    ModuleEvents.CLEAR_PATIENT_TREATMENTS,
    async (param) => {
        return null
    }
);

const updatePatientTreatment = createAction(
  ModuleEvents.UPDATE_PATIENT_TREATMENT,
  async (param) => {
    const result = await PatientRepository.updatePatientTreatment(param);
    return result;
  }
);

const createPatientTreatment = createAction(
    ModuleEvents.CREATE_PATIENT_TREATMENT,
    async (param) => {
        const result = await PatientRepository.createPatientTreatment(param);
        return result;
    }
);

const deletePatientTreatment = createAction(
    ModuleEvents.DELETE_PATIENT_TREATMENT,
    async (param) => {
        const result = await PatientRepository.updatePatientTreatment(param);
        return result;
    }
);

const searchPatientTreatment = createAction(
    ModuleEvents.SEARCH_PATIENT_TREATMENT,
    async (param) => {
        const result = await PatientRepository.searchPatientTreatment(param);
        return result;
    }
);


const changePatientTreatmentCreateLoading = createAction(
    ModuleEvents.CHANGE_PATIENT_TREATMENT_CREATE_LOADING,
    async (status) => {
        return status;
    }
);

const changePatientTreatmentUpdateLoading = createAction(
    ModuleEvents.CHANGE_PATIENT_TREATMENT_UPDATE_LOADING,
    async (status) => {
        return status;
    }
);

const changePatientUpdateLoading = createAction(
    ModuleEvents.CHANGE_PATIENT_UPDATE_LOADING,
    async (status) => {
        return status;
    }
);

const changePatientTreatmentSearchLoading = createAction(
    ModuleEvents.CHANGE_PATIENT_TREATMENT_SEARCH_LOADING,
    async (status) => {
        return status;
    }
);

const exportedFuction = {
    fetchAllPatientTreatments,
    updatePatientTreatment,
    createPatientTreatment,
    fetchPatientTreatments,
    clearPatientTreatments,
    deletePatientTreatment,
    changePatientTreatmentCreateLoading,
    changePatientUpdateLoading,
    searchPatientTreatment,
    changePatientTreatmentSearchLoading,
    changePatientTreatmentUpdateLoading
};

export default exportedFuction;
