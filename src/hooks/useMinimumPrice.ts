import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import { ORDER_MINIMUM_PRICE } from "../graphql/cart/queries";
import { SET_USER } from "../graphql/user/mutations";
import useCityPriceList from "./useCityPriceList";

const useMinimumPrice = () => {
  const topPricePickup: number = 90; // Bs. 90
  const { city, idPriceList, agency } = useCityPriceList();
  const [setUserMinimumPrice] = useMutation(SET_USER);

  const [getMinimumPrice] = useLazyQuery(ORDER_MINIMUM_PRICE, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      if (d && d.minimum_price) {
        setMinimumPrice(d.minimum_price);
      }
    },
  });
  const [store, setStore] = useState<string>("b2c");
  const [minimumPrice, setMinimumPrice] = useState(200);

  useEffect(() => {
    getMinimumPrice({
      variables: {
        city: agency ? agency : city,
        store,
      },
    });
  }, [city, store, agency]);

  useEffect(() => {
    if (idPriceList > 0) {
      setStore("b2e");
    } else {
      setStore("b2c");
    }
  }, [city, idPriceList]);

  return minimumPrice;
};

export default useMinimumPrice;
