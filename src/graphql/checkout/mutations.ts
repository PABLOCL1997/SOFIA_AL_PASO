import gql from "graphql-tag";

export const SET_CHECKOUT = gql`
  mutation addToCheckout($checkout: Checkout) {
    addToCheckout(checkout: $checkout) @client
  }
`;
