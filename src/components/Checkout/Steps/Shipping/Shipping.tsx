import React, { FC, Suspense, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { cities, KeyValue, search } from "../../../../utils/string";
import { setLatLng } from "../../../../utils/googlemaps";
import { useQuery, useMutation } from "react-apollo";
import { DETAILS, GET_USER } from "../../../../graphql/user/queries";
import { AddressType } from "../../../../graphql/user/type";
import { SET_USER } from "../../../../graphql/user/mutations";
import { handleNext } from "../../../../types/Checkout";
import useCityPriceList from "../../../../hooks/useCityPriceList";

import * as SC from "./style";
import arrow from "../../../../assets/images/arrow-back-checkout.svg";
import { Checkout, IShipping } from "../../../../utils/validations";
import Input from "../../../Formik/components/Input";
import { FormikProvider, useFormik } from "formik";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../../Loader"));
const Map = React.lazy(() => import(/* webpackChunkName: "Map" */ "../../../Map"));
const CallToAction = React.lazy(() => import(/* webpackChunkName: "CallToAction" */ "../../../Cta"));
const ChooseShipping = React.lazy(() => import(/* webpackChunkName: "ChooseShipping" */ "./ChooseShipping"));

const previousStep = "billing";
const shippingFields = [
  "firstname",
  "lastname",
  "nit",
  "phone",
  "phone2",
  "city",
  "address",
  "reference",
]

const Shipping: FC<{
    updateOrder: (field: string, values: IShipping) => void;
    confirmModalVisible: boolean;
    setOrderIsReady: Function;
  }> = ({ updateOrder, confirmModalVisible, setOrderIsReady }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { agency, setAgency, idPriceList, agencies } = useCityPriceList();
  const { data: localData } = useQuery(GET_USER, {});
  const [showSuccess] = useMutation(SET_USER, {});
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      nit: "",
      phone: "",
      phone2: "",
      city: "",
      address: "",
      reference: "",
    },
    validationSchema: Checkout.Validators.shippingSchema,
    onSubmit: () => {}
  })
  const [formIsValid, setFormIsValid] = useState(false);

  const [other, setOther] = useState(false);
  const addressId = useMemo(() => localData.userInfo.length && localData.userInfo[0].defaultAddressId, [localData]);

  const { data: userDetails } = useQuery(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      if (d.details) {
        const address = d.details.addresses.find((a: AddressType) => a.id === addressId);
        if (address) {
          updateOrder("shipping", {
            ...address,
          });
          formik.setValues({
            ...address,
            address: address?.street || "",
          });
        }
      }
    }
  });

  const [setUser] = useMutation(SET_USER);

  const newAddress = useMemo(() => !(localData.userInfo.length && localData.userInfo[0].defaultAddressId), [localData]);
  const street = useMemo(() => localData.userInfo.length && localData.userInfo[0].defaultAddressLabel, [localData]);
  const nextStep = useMemo(() => agency ? "payment" : "timeframe", [agency]);

  const onChange = (key: string, value: string | number | null, preventMap: boolean = false) => {
    formik.setFieldValue(key, value);
    updateOrder("shipping", {
      ...formik.values,
      [key]: value }
    );
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

  useEffect(() => {
    if (localData.userInfo.length && other) {
      onChange("city", localData.userInfo[0].cityName, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [other]);


  useEffect(() => {
    if (localData?.userInfo?.length
      && localData?.userInfo[0]?.defaultAddressId
        && userDetails?.details?.addresses) {
      if (!agency) {
        let _a = userDetails.details.addresses.findIndex((a: AddressType) => Number(a.id) === Number(localData.userInfo[0].defaultAddressId));
        if (_a) selectAddress(userDetails.details.addresses[_a]);
        else selectAddress(userDetails.details.addresses[0]);
      }
      setOther(false);
    } else {
      if (!agency) {
        setOther(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails, agency]);

  useEffect(() => {
    if (agency && agencies) {
      const agencyObj = agency ? search("key", agency || "V07", agencies) : null;
      if (agencyObj) {
        updateOrder("shipping", {
          ...agencyObj,
          address: agencyObj.street,
        })
      }
    }
  }, [agency, agencies])

  useEffect(() => {
    const checkShipping = async () => {
      try {
        await Checkout.Validations.Shipping(formik.values as IShipping)
        setFormIsValid(true);
      } catch (error) {
        setFormIsValid(false);
      }
    }

    checkShipping();
      
  }, [formik]);

  return (
    <Suspense fallback={<Loader />}>
      <React.Fragment>
        <SC.Back.Wrapper onClick={() => handleNext(history, previousStep)}>
          <img src={arrow} alt={t("controls.back_arrow")} width={16} height={11} />
        </SC.Back.Wrapper>
        <SC.Title>
          <img onClick={() => handleNext(history, previousStep)} src={arrow} alt={t("controls.back_arrow")} width={16} height={11} />
          <h2>{t("checkout.delivery.title")}</h2>
        </SC.Title>

        <ChooseShipping
          isAgency={!!agency}
          isEmployee={!!idPriceList}
          isDelivery={!(agency || idPriceList)}
          street={street}
          addressId={addressId}
          setShowNewAddress={() => {}}
        />

        {!agency &&
          <FormikProvider value={formik} >
            <SC.Form id="nueva-direccion" hidden={false}>
              {shippingFields.map((key: string) => {
                return (
                  <Input
                    name={key}
                    label={t(`checkout.delivery.${key}`)}
                    readOnly={!!agency || key === "city"}
                    placeholder={t(`checkout.delivery.${key}`)}
                    onChange={(evt) => onChange(key, evt.target.value)}
                  />
                );
              })}
            </SC.Form>
          </FormikProvider>
        }

        {newAddress && !confirmModalVisible && <Map />}
        <SC.Next.Wrapper>
          <CallToAction
            text={t("general.next")}
            action={() => handleNext(history, nextStep)}
            active={(agency || formIsValid) as boolean}
            filled
          />
        </SC.Next.Wrapper>
      </React.Fragment>
    </Suspense>
  );
};

export default Shipping;
