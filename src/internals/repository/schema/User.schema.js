import gql from 'graphql-tag';

export const UpdateUser = gql`
    mutation updateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
            id
            createdTime
            email
            firstName
            lastName
            userStatus
            userType
            updatedTime
        }
    }
`;

export const GetUser = gql`
    query getUser($id: String!) {
        getUser(id: $id) {
            id
            createdTime
            email
            firstName
            lastName
            userStatus
            userType
            updatedTime
        }
    }
`;

