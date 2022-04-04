import { useEffect, useState } from "react";
import { useLazyQuery } from "react-apollo";
import { ORDER_MINIMUM_PRICE } from "../graphql/cart/queries";
import useCityPriceList from "./useCityPriceList";

const useMinimumPrice = () => {
  const { city, idPriceList, agency, express, isExpress } = useCityPriceList();
  const [store, setStore] = useState<string>("b2c");
  const [minimumPrice, setMinimumPrice] = useState(200);

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
        city: agency ? agency : express ? express : city,
        store,
      },
    });
  }, [city, store, agency, express]);

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
  }, [city, idPriceList]);

  return minimumPrice;
};

export default useMinimumPrice;
