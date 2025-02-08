import CustomerRepository from "../../internals/repository/CustomerRepository";
import UserRepository from "../../internals/repository/UserRepository";
import PatientRepository from "../../internals/repository/PatientRepository";
import {mapPatients} from "../../internals/manager/PatientManager";

export const ModuleEvents = {
    FETCH_ALL_PATIENTS: "FETCH_ALL_PATIENTS",
  UPDATE_CLIENT: 'UPDATE_CLIENT',
    CREATE_PATIENT: 'CREATE_PATIENT',
    FETCH_PATIENT_TREATMENTS: 'FETCH_PATIENT_TREATMENTS',
    CLEAR_PATIENT_TREATMENTS: 'CLEAR_PATIENT_TREATMENTS',
    UPDATE_PATIENT: 'UPDATE_PATIENT',
    DELETE_PATIENT: 'DELETE_PATIENT',
    CHANGE_PATIENT_CREATE_LOADING: 'CHANGE_PATIENT_CREATE_LOADING',
    CHANGE_PATIENT_UPDATE_LOADING: 'CHANGE_PATIENT_UPDATE_LOADING',
    SEARCH_PATIENT: 'SEARCH_PATIENT',
    CHANGE_PATIENT_SEARCH_LOADING: 'CHANGE_PATIENT_SEARCH_LOADING'
};

const createAction =
  (type, action = () => {}, meta) =>
  (...args) => ({
    type,
    payload: action(...args),
    meta,
  });

const fetchAllPatients = createAction(
  ModuleEvents.FETCH_ALL_PATIENTS,
  async () => {
    const result = await PatientRepository.fetchAllPatients();
    const mapList = await mapPatients(result.items)
    return {result, mapList};
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

const updatePatient = createAction(
  ModuleEvents.UPDATE_PATIENT,
  async (param) => {
    const result = await PatientRepository.updatePatient(param);
    return result;
  }
);

const createPatient = createAction(
    ModuleEvents.CREATE_PATIENT,
    async (param) => {
        const result = await PatientRepository.createPatient(param);
        return result;
    }
);

const deletePatient = createAction(
    ModuleEvents.DELETE_PATIENT,
    async (param) => {
        const result = await PatientRepository.deletePatient(param);
        return result;
    }
);

const searchPatient = createAction(
    ModuleEvents.SEARCH_PATIENT,
    async (param) => {
        const result = await PatientRepository.searchPatient(param);
        return result;
    }
);


const changePatientCreateLoading = createAction(
    ModuleEvents.CHANGE_PATIENT_CREATE_LOADING,
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

const changePatientSearchLoading = createAction(
    ModuleEvents.CHANGE_PATIENT_SEARCH_LOADING,
    async (status) => {
        return status;
    }
);

const exportedFuction = {
    fetchAllPatients,
    updatePatient,
    createPatient,
    fetchPatientTreatments,
    clearPatientTreatments,
    deletePatient,
    changePatientCreateLoading,
    changePatientUpdateLoading,
    searchPatient,
    changePatientSearchLoading
};

export default exportedFuction;
