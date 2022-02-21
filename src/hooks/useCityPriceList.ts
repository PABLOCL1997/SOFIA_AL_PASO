// this hook return city and id price list
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { DETAILS, GET_USER } from "../graphql/user/queries";
import { GET_EXPRESS_AGENCIES, GET_SAP_AGENCIES } from "../graphql/products/queries";
import Agency from "../types/Agency";

type usePriceListType = {
  city: string;
  idPriceList: number;
  agency: string | null;
  setAgency: Function;
  agencies: Array<Agency>;
  express: Array<Agency>;
  hasB2EAddress: boolean;
};

const useCityPriceList = (): usePriceListType => {
  const { data: userData } = useQuery(GET_USER, {});
  const { data: details } = useQuery(DETAILS, {});
  const { data: agencies } = useQuery(GET_SAP_AGENCIES, {
    fetchPolicy: "network-only",
  });
  const { data: express } = useQuery(GET_EXPRESS_AGENCIES, {
    fetchPolicy: "network-only",
  });



  const [city, setCity] = useState<string>("SC");
  const [idPriceList, setIdPriceList] = useState<number>(-1);
  const [agency, setAgency] = useState<string | null>(null);

  useEffect(() => {
    // update price list
    if (userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList >= 0) {
      if (userData.userInfo[0].idPriceList !== idPriceList) {
        setIdPriceList(userData.userInfo[0].idPriceList);
        setAgency(null);
      }
    }
    // update city
    if (userData?.userInfo.length && userData.userInfo[0].cityKey) {
      if (userData.userInfo[0].cityKey !== city) {
        setCity(userData.userInfo[0].cityKey);
        setAgency(null);
      }
    }

    // update agency
    if (userData?.userInfo.length && userData.userInfo[0].agency) {
      if (userData.userInfo[0].agency !== agency) {
        setAgency(userData.userInfo[0].agency);
      }
    }
  }, [userData]);

  const hasB2EAddress: boolean = useMemo(() => {
    if (details?.details && details.details.addresses.length) {
      const isEmployee = details.details.addresses.some((address: any) => address.id_price_list);
      return isEmployee;
    }
    return false;
  }, [details]);

  return {
    city,
    idPriceList,
    agencies: agencies?.agencies,
    express: express?.express,
    agency: userData?.userInfo[0]?.agency || null,
    setAgency,
    hasB2EAddress };
};

export default useCityPriceList;
