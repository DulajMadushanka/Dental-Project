import gql from 'graphql-tag';

export const UpdatePatient = gql`
    mutation updateShopProduct($input: UpdatePatientInput!) {
        updatePatient(input: $input) {
            firstName
            lastName
            birthdate
            patientId
            createdTime
            updatedTime
            profileImage
            email
            phoneNumber
            createdDate
            age
            address
            createdUserId
            updatedUserId
            deletedUserId
            name
            status
            searchedName
        }
    }
`;

export const DeletePatient = gql`
    mutation deletePatient($input: DeletePatientInput!) {
        deletePatient(input: $input) {
            firstName
            lastName
            birthdate
            patientId
            createdTime
            updatedTime
            profileImage
            createdDate
            email
            phoneNumber
            age
            address
            createdUserId
            updatedUserId
            deletedUserId
            name
            status
            searchedName
        }
    }
`;

export const CreatePatient = gql`
    mutation createPatient($input: CreatePatientInput!) {
        createPatient(input: $input) {
            firstName
            lastName
            birthdate
            patientId
            createdTime
            updatedTime
            profileImage
            createdDate
            email
            phoneNumber
            age
            address
            createdUserId
            updatedUserId
            deletedUserId
            name
            status
            searchedName
        }
    }
`;

export const CreatePatientTreatment = gql`
    mutation createPatientTreatement($input: CreatePatientTreatementInput!) {
        createPatientTreatement(input: $input) {
            treatementId
            patientId
            amount
            files{
              key
              name
              extension
              size
              sizeReadable
            } 
            createdTime
            status
            treatements
            updatedTime
            createdUserId
            updatedUserId
            createdDate
        }
    }
`;

export const UpdatePatientTreatment = gql`
    mutation updatePatientTreatement($input: UpdatePatientTreatementInput!) {
        updatePatientTreatement(input: $input) {
            treatementId
            patientId
            amount
            files{
              key
              name
              extension
              size
              sizeReadable
            } 
            createdTime
            status
            treatements
            updatedTime
            createdUserId
            updatedUserId
            createdDate
        }
    }
`;
