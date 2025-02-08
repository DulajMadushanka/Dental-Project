import gql from 'graphql-tag';

export const UpdateProduct = gql`
    mutation updateShopProduct($input: UpdateShopProductInput!) {
        updateShopProduct(input: $input) {
            productId
            shopId
            productName
            quantityType{
                label
                value
            }
            productImage
            createdTime
            updatedTime
            description
            productPrice
        }
    }
`;

export const DeleteProduct = gql`
    mutation deleteShopProduct($input: DeleteShopProductInput!) {
        deleteShopProduct(input: $input) {
            productId
            shopId
            productName
            quantityType{
                label
                value
            }
            productImage
            createdTime
            updatedTime
            description
            productPrice
        }
    }
`;

export const CreateProduct = gql`
    mutation createShopProduct($input: CreateShopProductInput!) {
        createShopProduct(input: $input) {
            productId
            shopId
            productName
            quantityType{
                label
                value
            }
            productImage
            createdTime
            updatedTime
            productPrice
        }
    }
`;
