import gql from 'graphql-tag';

export const updateWithdrawal = gql`
    mutation updateWithdrawal($input: UpdateWithdrawRequestInput!) {
        updateWithdrawRequest(input: $input) {
            requestId
            message
            withdrawalAmount
            userId
            createdTime
            adminMessage
            status
            receiptId
        }
    }
`;

export const updateCompanyWithdrawal = gql`
    mutation updateWithdrawal($input: UpdateCompanyWithdrawalInput!) {
        updateCompanyWithdrawal(input: $input) {
            withdrawalId
            message
            withdrawalAmount
            userId
            createdTime
            adminMessage
            status
            receiptId
            adminId
        }
    }
`;
