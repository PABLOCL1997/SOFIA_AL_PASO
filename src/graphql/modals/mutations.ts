import gql from "graphql-tag";

export const SET_MODALS = gql`
  mutation addToModals($modals: Modals) {
    addToModals(modals: $modals) @client
  }
`;
