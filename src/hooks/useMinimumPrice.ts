import { useEffect, useState } from "react";
import { useLazyQuery } from "react-apollo";
import { ORDER_MINIMUM_PRICE } from "../graphql/cart/queries";
import useCityPriceList from "./useCityPriceList";

const useMinimumPrice = () => {
  const { city, idPriceList, agency, isExpress } = useCityPriceList();
  const [store, setStore] = useState<string>("b2c");
  const [minimumPrice, setMinimumPrice] = useState(150);

  const [getMinimumPrice] = useLazyQuery(ORDER_MINIMUM_PRICE, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      if (d && d.minimum_price) {
        setMinimumPrice(d.minimum_price);
      }
    },
  });

  useEffect(() => {
    getMinimumPrice({
      variables: {
        city: agency ? agency : city,
        store,
      },
    });
  }, [city, store, agency]);

  useEffect(() => {
    if (isExpress) {
      setStore("express");
    } else {
      if (idPriceList > 0) {
        setStore("b2e");
      } else {
        setStore("b2c");
      }
    }
  }, [city, idPriceList, isExpress]);

  return minimumPrice;
};

export default useMinimumPrice;
