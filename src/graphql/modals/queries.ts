import gql from "graphql-tag";

export const GET_MODALS = gql`
  query GetModals {
    modals @client {
      showChooseUserType,
      showRegisterModal
    }
  }
`;
