import { useEffect } from "react";
import { useMutation, useQuery, useApolloClient } from "react-apollo";
import { GET_CHECKOUT } from "../graphql/checkout/queries";
import { SET_CHECKOUT } from "../graphql/checkout/mutations";

interface Checkout {
  redirectToCheckout: boolean;
  isGuestOrder: boolean;
}

export const INITIAL_CHECKOUT = {
  __typename: "Checkout",
  redirectToCheckout: false,
  isGuestOrder: false,
};

const useCheckout = () => {
  const aClient = useApolloClient();
  const { data } = useQuery(GET_CHECKOUT);
  const checkout: Checkout = data?.checkout || INITIAL_CHECKOUT;
  const [addToCheckout] = useMutation(SET_CHECKOUT);

  const handleRedirectToCheckout = (value: boolean) => {
    addToCheckout({
      variables: { checkout: { redirectToCheckout: value } },
    }).then(() => {});
  };

  const handleIsGuestOrder = (value: boolean) => {
    addToCheckout({
      variables: { checkout: { isGuestOrder: value } },
    }).then(() => {});
  };

  useEffect(() => {
    // if state are not in cache, initialize it
    if (!data) {
      aClient.writeQuery({
        query: GET_CHECKOUT,
        data: { checkout: INITIAL_CHECKOUT },
      });
    }
  }, [data]);

  return {
    checkout,
    handleRedirectToCheckout,
    handleIsGuestOrder,
  };
};

export default useCheckout;
