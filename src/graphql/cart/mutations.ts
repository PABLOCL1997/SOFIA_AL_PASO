import gql from 'graphql-tag';

export const ADD_ITEM = gql`
mutation addToCart($product: Product!) {
    addToCart(product: $product) @client
}
`;