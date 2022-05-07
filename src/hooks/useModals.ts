import { useMutation, useQuery } from "react-apollo";
import { SET_MODALS } from "../graphql/modals/mutations";
import { GET_MODALS } from "../graphql/modals/queries";

interface Modals {
  showChooseUserType: boolean;
  showRegisterModal: boolean;
}

export const INITIAL_MODALS = {
  __typename: "Modals",
  showChooseUserType: false,
  showRegisterModal: false,
};

const useModals = () => {
  const { data } = useQuery(GET_MODALS);
  const modals: Modals = data.modals;
  const [addToModals] = useMutation(SET_MODALS);

  const handleChooseUserType = (value: boolean) => {
    addToModals({
      variables: { modals: { showChooseUserType: value } },
    }).then(() => {});
  };

  const handleRegisterModal = (value: boolean) => {
    addToModals({
      variables: { modals: { showRegisterModal: value } },
    }).then(() => {});
  };

  const handleResetModals = () => {
    addToModals({
      variables: {
        modals: {
          showRegisterModal: false,
          showChooseUserType: false,
        },
      },
    }).then(() => {});
  };

  return {
    modals,
    handleChooseUserType,
    handleRegisterModal,
    handleResetModals,
  };
};

export default useModals;
