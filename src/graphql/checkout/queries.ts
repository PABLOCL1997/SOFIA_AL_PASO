import gql from "graphql-tag";

export const GET_CHECKOUT = gql`
  query GetCheckout {
    checkout @client {
      redirectToCheckout,
      isGuestOrder
    }
  }
`;
