// this hook return city and id price list
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { DETAILS, GET_USER } from "../graphql/user/queries";
import { GET_EXPRESS_AGENCIES, GET_SAP_AGENCIES } from "../graphql/products/queries";
import Agency from "../types/Agency";
const axios = require("axios");

type usePriceListType = {
  city: string;
  idPriceList: number;
  agency: string | null;
  setAgency: Function;
  agencies: Array<Agency>;
  express: Array<Agency>;
  isExpress: boolean;
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
  const [isExpress, setIsExpress] = useState(false);

  useEffect(() => {
    (async () => {
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

      // update express
      if (userData?.userInfo.length && userData.userInfo[0].store === "EXPRESS") {
        setIsExpress(true);
      } else {
        setIsExpress(false);
      }

      if (userData?.userInfo.length && !userData.userInfo[0].id) {
        if (navigator.geolocation) {
          try {
            navigator.geolocation.getCurrentPosition(
              function (position) {
                (async () => {
                  const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&components=city&key=AIzaSyAbyXaPzFnajVWEEEWt3ynctZ_YavSFuFU`;
                  const geolocationResult = await axios({
                    url: geocodingUrl,
                    method: "get",
                  });
                  if (geolocationResult.data.status === "OK") {
                    const { results } = geolocationResult.data;
                    results.forEach((result: any) => {
                      result.types.forEach((type: any) => {
                        if (type === "administrative_area_level_1") {
                          const city = result.address_components[0].short_name.toLowerCase();
                          if (city.includes("la paz")) {
                            setCity("LP");
                          } else if (city.includes("el alto")) {
                            setCity("EA");
                          } else if (city.includes("cochabamba")) {
                            setCity("CB");
                          }
                        }
                      });
                    });
                  }
                })();
              },
              function (errors) {
                console.log(errors);
              },
              {
                timeout: 5000,
              }
            );
          } catch (error) {
            console.error(error);
          }
        }
      }
    })();
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
    agencies: agencies?.agencies || [],
    express: express?.express || [],
    isExpress,
    agency: userData?.userInfo[0]?.agency || null,
    setAgency,
    hasB2EAddress,
  };
};

export default useCityPriceList;
