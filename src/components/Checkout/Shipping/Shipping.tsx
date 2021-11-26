import React, { FC, Suspense, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cities, KeyValue } from "../../../utils/string";
import { setLatLng } from "../../../utils/googlemaps";
import { useQuery, useMutation } from "react-apollo";
import { DETAILS, GET_USER } from "../../../graphql/user/queries";
import { AddressType } from "../../../graphql/user/type";
import { SET_USER } from "../../../graphql/user/mutations";
import { GET_SAP_AGENCIES } from "../../../graphql/products/queries";
import useCityPriceList from "../../../hooks/useCityPriceList";

import * as SC from "./style";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../Loader"));
const Map = React.lazy(() => import(/* webpackChunkName: "Map" */ "../../Map"));
const Switch = React.lazy(() => import(/* webpackChunkName: "Switch" */ "../../Switch"));
const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */ "../../Images/Chevron"));

const ChooseShipping = React.lazy(() => import(/* webpackChunkName: "ChooseShipping" */ "./ChooseShipping"));

const gridSpan2CSS = {
  gridColumn: "1 / span 2",
} as React.CSSProperties;

const emptyCSS = {} as React.CSSProperties;

type Props = {
  updateOrder: Function;
  orderData: any;
  billingChange: any;
  confirmModalVisible: boolean;
  localUserData: any;
  setOrderIsReady: Function;
};

const Shipping: FC<Props> = ({ updateOrder, orderData, billingChange, confirmModalVisible, localUserData, setOrderIsReady }) => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState<any>({
    addressType: t("checkout.delivery.street"),
  });
  const [agencies, setAgencies] = useState<any>([]);
  const { data: localData } = useQuery(GET_USER, {});
  const [showSuccess] = useMutation(SET_USER, {});

  const {} = useQuery(GET_SAP_AGENCIES, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      setAgencies(d.agencies);
    },
  });

  const [other, setOther] = useState(false);
  const { data: userData } = useQuery(DETAILS, {
    fetchPolicy: "network-only",
  });
  const [setUser] = useMutation(SET_USER);
  const { agency, setAgency, idPriceList } = useCityPriceList();
  const isEmployee = useMemo(() => userData && userData.details && userData.details.employee, [userData]);
  const newAddress = useMemo(() => !(localData.userInfo.length && localData.userInfo[0].defaultAddressId), [localData]);
  const addressId = useMemo(() => localData.userInfo.length && localData.userInfo[0].defaultAddressId, [localData]);
  const street = useMemo(() => localData.userInfo.length && localData.userInfo[0].defaultAddressLabel, [localData]);

  const onChange = (key: string, value: string | number | null, preventMap: boolean = false) => {
    if (key.indexOf("phone") >= 0 && String(value).length > 8) value = String(value).substring(0, 8);
    setInputs({
      ...inputs,
      [key]: value,
    });
    if (key === "city" && value && !preventMap) {
      setLatLng(String(value));
      let c: KeyValue | undefined = cities.find((c: KeyValue) => c.value === value);
      if (c) {
        setUser({
          variables: {
            user: {
              cityKey: c.key,
              cityName: c.value,
              openCityModal: false,
              defaultAddressId: null,
              defaultAddressLabel: "",
            },
          },
        });
      }
    }
  };

  const selectAddress = (address: AddressType | any) => {
    if (address && address.id) {
      onChange("addressId", Number(address.id));
      updateOrder("shipping", address);
      setOther(false);
      let c: KeyValue | undefined = cities.find(({ value }: KeyValue) => value === address.city);

      if (!c) {
        let city: KeyValue | undefined = cities.find(({ key }: KeyValue) => key === address.city);
        if (city) {
          setUser({
            variables: {
              user: {
                cityKey: city.key,
                cityName: city.value,
              },
            },
          });
        }
      }

      if (c) {
        setUser({
          variables: {
            user: {
              cityKey: c.key,
              cityName: c.value,
            },
          },
        });
      }

      (window as any).latitude = address.latitude;
      (window as any).longitude = address.longitude;
      const prev = localData?.userInfo[0]?.idPriceList || 0;
      const newVal = address?.id_price_list || 0;

      // check if pick-up address
      if (address && address.isAgency) {
        showSuccess({
          variables: { user: { showModal: "Cambiaste de dirección|Recuerda que al elegir esta dirección debes pasar a retirar a la agencia Sofía al Paso seleccionada." } },
        });
        setUser({
          variables: {
            user: {
              agency: address.key,
            },
          },
        });
      } else {
        setAgency(null);

        if (prev > 0 && newVal == 0) {
          showSuccess({
            variables: { user: { showModal: t("cart.change_employee") } },
          });
        } else {
          if (localData?.userInfo[0]?.cityName !== address?.city) {
            setOrderIsReady(true);
            showSuccess({
              variables: { user: { showModal: t("cart.change_msg") } },
            });
          }
        }

        setUser({
          variables: {
            user: {
              openCityModal: false,
              defaultAddressId: address.id,
              defaultAddressLabel: address.street,
              idPriceList: address?.id_price_list || 0,
              agency: null,
            },
          },
        });
      }
    }
  };

  const showOther = () => {
    onChange("addressId", null);
  };

  const addressTypes = [
    {
      title: t("checkout.delivery.street"),
      value: t("checkout.delivery.street"),
    },
    {
      title: t("checkout.delivery.avenue"),
      value: t("checkout.delivery.avenue"),
    },
  ];

  const options: { [key: string]: Array<string> } = {
    city: cities.map((c: KeyValue) => c.value),
    home_type: ["Casa", "Departamento"],
  };

  useEffect(() => {
    if (localData.userInfo.length && other) {
      onChange("city", localData.userInfo[0].cityName, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [other]);

  useEffect(() => {
    if (!Object.keys(billingChange).length) return;
    let obj = { ...inputs };
    ["firstname", "lastname", "nit"].forEach((key: string) => {
      if (billingChange[key]) {
        obj[key] = billingChange[key];
      }
    });
    setInputs(obj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingChange]);

  useEffect(() => {
    if (localData && localData.userInfo.length && localData.userInfo[0].defaultAddressId && userData && userData.details.addresses) {
      if (!agency) {
        let _a = userData.details.addresses.findIndex((a: AddressType) => Number(a.id) === Number(localData.userInfo[0].defaultAddressId));
        if (_a) selectAddress(userData.details.addresses[_a]);
        else selectAddress(userData.details.addresses[0]);
      }
      setOther(false);
    } else {
      if (!agency) {
        setOther(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, agency]);

  useEffect(() => {
    if (!inputs.addressId)
      updateOrder("shipping", {
        ...inputs,
        latitude: (window as any).latitude,
        longitude: (window as any).longitude,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  return (
    <Suspense fallback={<Loader />}>
      <React.Fragment>
        <SC.Title>
          <h2>{t("checkout.delivery.title")}</h2>
        </SC.Title>

        <ChooseShipping isAgency={!!agency} isEmployee={!!idPriceList} isDelivery={!(agency || idPriceList)} street={street} addressId={addressId} />

        {!isEmployee && (
          <>
            <SC.OtherAddressWrapper>
              <SC.Other onClick={showOther} margin>
                {t("checkout.delivery.other_address")}
              </SC.Other>
            </SC.OtherAddressWrapper>

            {/* <Form hidden={!other}> */}
            <SC.Form id="nueva-direccion" hidden={!newAddress}>
              {["firstname", "lastname", "phone", "phone2", "city", "address", "reference"].map((key: string) => {
                return (
                  <SC.InputGroup withLabel={key !== "street"} key={key} style={key === "reference" ? gridSpan2CSS : emptyCSS}>
                    <label>{t("checkout.delivery." + key)}</label>
                    {options[key] && (
                      <SC.SelectWrapper>
                        <select name={`shipping-${key}`} onChange={(evt) => onChange(key, evt.target.value)} value={inputs[key] || ""}>
                          <option value="">{t("checkout.delivery." + key)}</option>
                          {options[key].map((opt: string) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                        <Chevron />
                      </SC.SelectWrapper>
                    )}
                    {(key === "address" || key === "reference") && (
                      <input name={`shipping-${key}`} value={inputs[key] || ""} onChange={(evt) => onChange(key, evt.target.value)} type="text" placeholder={t("checkout.delivery." + key + "_ph")} />
                    )}
                    {key === "street" && <Switch changeOption={(value: string) => onChange("addressType", value)} option={inputs.addressType} values={addressTypes} />}
                    {key !== "street" && key !== "address" && key !== "reference" && !options[key] && (
                      <input
                        name={`shipping-${key}`}
                        value={inputs[key] || ""}
                        onChange={(evt) => onChange(key, evt.target.value)}
                        pattern={key.indexOf("phone") >= 0 || key === "nit" ? "[0-9]*" : ""}
                        type={key.indexOf("phone") >= 0 || key === "nit" ? "number" : "text"}
                        placeholder={t("checkout.delivery." + key)}
                      />
                    )}
                  </SC.InputGroup>
                );
              })}
            </SC.Form>
          </>
        )}
        {newAddress && !confirmModalVisible && <Map />}
      </React.Fragment>
    </Suspense>
  );
};

export default Shipping;
