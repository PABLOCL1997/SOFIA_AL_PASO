import gql from 'graphql-tag';

export const ADD_ITEM = gql`
mutation addToCart($product: Product!) {
    addToCart(product: $product) @client
}
`;

export const DELETE_ITEM = gql`
mutation deleteFromCart($product: Product!) {
    deleteFromCart(product: $product) @client
}
`;

export const EMPTY_CART = gql`
mutation emptyCart {
    emptyCart @client
}
`;