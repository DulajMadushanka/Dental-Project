import Repository from './Repository';
import { GetUser } from './schema/User.schema';
import { API, graphqlOperation } from '@aws-amplify/api';
import { v4 as uuid } from 'uuid';
import {
  CreatePatient,
  CreatePatientTreatment,
  DeletePatient,
  UpdatePatient,
  UpdatePatientTreatment
} from "./schema/Patient.schema";

class PatientRepository extends Repository {
  async createPatient(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/create-patient',
        message,
      });
      return result.data.patientResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async searchPatient(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/patient/search',
        message,
      });
      return result.data.patientResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async searchPatientTreatment(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/patient-treatment/search',
        message,
      });
      return result.data.treatmentResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async updatePatient(param) {
    try {
      const updatedResult = await API.graphql(graphqlOperation(UpdatePatient, {input: param} ));
      return updatedResult.data.updatePatient;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async createPatientTreatment(param) {
    try {
      const createdResult = await API.graphql(graphqlOperation(CreatePatientTreatment, {input: param} ));
      return createdResult.data.createPatientTreatement;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async updatePatientTreatment(param) {
    try {
      const updatedResult = await API.graphql(graphqlOperation(UpdatePatientTreatment, {input: param} ));
      return updatedResult.data.updatePatientTreatement;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async deletePatient(param) {
    try {
      const deletedResult = await API.graphql(graphqlOperation(UpdatePatient, {input: param} ));
      return deletedResult.data.updatePatient;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async fetchAllPatients() {
    const message = this.buildMessage({});
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/patients',
        message,
      });
      return result.data.patientResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async fetchAllPatientTreatments() {
    const message = this.buildMessage({});
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/patient-treatments/all',
        message,
      });
      return result.data.treatmentResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  };

  async fetchPatientTreatments(param) {
    const message = this.buildMessage(param);
    try {
      const result = await this.apiPost({
        apiName: this.API_NAME,
        path: '/patient-treatments',
        message,
      });
      return result.data.treatmentResult;
    } catch (error) {
      console.warn('error', error);
      return { error };
    }
  }
}

export default new PatientRepository();
