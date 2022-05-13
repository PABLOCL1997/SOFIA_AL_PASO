import React, { FC, Suspense, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { cities, KeyValue, search } from "../../../../utils/string";
import { setLatLng } from "../../../../utils/googlemaps";
import { useMutation, useLazyQuery } from "react-apollo";
import { DETAILS } from "../../../../graphql/user/queries";
import { AddressType } from "../../../../graphql/user/type";
import { SET_USER } from "../../../../graphql/user/mutations";
import { handleNext } from "../../../../types/Checkout";
import useCityPriceList from "../../../../hooks/useCityPriceList";

import * as SC from "./style";
import arrow from "../../../../assets/images/arrow-back-checkout.svg";
import { Checkout, IShipping } from "../../../../utils/validations";
import Input from "../../../Formik/components/Input";
import { FormikProvider, useFormik } from "formik";
import useUser from "../../../../hooks/useUser";
import { OrderData } from "../../../../types/Order";
import { useUrlQuery } from "../../../../hooks/useUrlQuery";
import useCheckout from "../../../../hooks/useCheckout";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../../Loader"));
const Map = React.lazy(() => import(/* webpackChunkName: "Map" */ "../../../Map"));
const CallToAction = React.lazy(() => import(/* webpackChunkName: "CallToAction" */ "../../../Cta"));
const ChooseShipping = React.lazy(() => import(/* webpackChunkName: "ChooseShipping" */ "./ChooseShipping"));

const previousStep = "billing";
const shippingFields = ["firstname", "lastname", "nit", "phone", "phone2", "city", "address", "reference"];

const Shipping: FC<{
  orderData: OrderData;
  updateOrder: (field: string, values: Partial<IShipping>) => void;
  confirmModalVisible: boolean;
  setOrderIsReady: Function;
}> = ({ updateOrder, confirmModalVisible, setOrderIsReady, orderData }) => {
  const { t } = useTranslation();
  const query = useUrlQuery();
  const history = useHistory();
  const { user: localData, store } = useUser();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { agency, setAgency, agencies } = useCityPriceList();
  const [showSuccess] = useMutation(SET_USER, {});
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      nit: 0,
      phone: "",
      phone2: "",
      city: "",
      address: "",
      reference: "",
      street: ""
    },
    validationSchema: Checkout.Validators.shippingSchema,
    onSubmit: () => {},
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const [other, setOther] = useState(false);
  const addressId = useMemo(() => localData.userInfo.length && localData.userInfo[0].defaultAddressId, [localData]);
  const { checkout: { isGuestOrder } } = useCheckout();

  const [getDetails, { data: userDetails }] = useLazyQuery(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      if (d.details) {
        let address = d.details.addresses.find((a: AddressType) => a.id === addressId);
        if (address) {
          const values = {
            firstname: orderData.billing.firstname,
            lastname: orderData.billing.lastname,
            nit: Number(orderData.billing.nit),
            phone: orderData.billing.phone,
            phone2: "",
            city: localData?.userInfo[0]?.cityName || address.city,
            address: address.street,
            street: address.street,
            reference: address.reference,            
          };
          formik.setValues(values);
          updateOrder("shipping", {
            ...address,
            ...values,
          });
          setShowAddressForm(false);
        };
      }
    },    
  });

  const [setUser] = useMutation(SET_USER);

  const newAddress = useMemo(() => !(localData.userInfo.length && localData.userInfo[0].defaultAddressId), [localData]);
  const street = useMemo(() => {    
    const s = localData.userInfo.length && localData.userInfo[0].defaultAddressLabel;
    if (s) {
      const result = cities.find(((c: KeyValue) => c.value === s));
      if (result) return "";
      return s;
    }
    return "";
  }, [localData]);
  const _nextStep = useMemo(() => (store === "PICKUP" || store === "EXPRESS" ? "payment" : "timeframe"), [store]);
  const nextStep: string = useMemo(() => (query?.get("next")?.length ? query?.get("next") || _nextStep : _nextStep), [store, query?.get("next")]);
  const onChange = (key: string, value: string | number | null, preventMap: boolean = false) => {
    const validateNit = Checkout.ValidationsForm.Billing.nit(key, String(value));
    if (!validateNit) return;
    formik.setFieldValue(key, value);
    if (key === "address") {
      formik.setFieldValue("street", value);
      updateOrder("shipping", {
        ...formik.values,
        address: value as string,
        street: value as string
      });
    } else {
      updateOrder("shipping", {
        ...formik.values,
        [key]: value,
      });
    }
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
      // onChange("addressId", Number(address.id));
      // updateOrder("shipping", {
      //   ...address,
      //   nit: formik.values.nit
      // });
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
    if (localData?.userInfo?.length && localData?.userInfo[0]?.defaultAddressId && userDetails?.details?.addresses) {
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


  // Update order when pickup is selected
  useEffect(() => {
    if (agencies && agency && store === "PICKUP") {
      const agencyObj = agency ? search("key", agency, agencies) : null;
      if (agencyObj) {
        updateOrder("shipping", {
          firstname: "",
          phone: "",
          address: agencyObj.street,
          street: agencyObj.street,
          city: agencyObj.city,
          reference: agencyObj.reference
        });
      }
    }
  }, [agency, store, agencies, formik.values]);  

  // Validate form
  useEffect(() => {
    const checkShipping = async () => {
      try {
        if (store === "B2E") {
          await Checkout.Validations.ShippingB2E(formik.values as IShipping);
        } else {
          await Checkout.Validations.Shipping(formik.values as IShipping);
        }
        setFormIsValid(true);
      } catch (error) {
        setFormIsValid(false);
      }
    };

    if (formik) {
      checkShipping();
    }    
  }, [formik, userDetails, store]);  

  // enable form if user not have an address
  useEffect(() => {
    if ((!formik.values.street || !formik.values.address) && (store !== "PICKUP")) { 
      setShowAddressForm(true);          
    }
  }, [formik.values.street, formik.values.address, store, setShowAddressForm]);

  // Complete form only first time open
  useEffect(() => {
    if (showAddressForm) {
      formik.setValues({
        firstname: orderData.billing.firstname,
        lastname: orderData.billing.lastname,
        nit: Number(orderData.billing.nit),
        phone: orderData.shipping.phone || orderData.billing.phone,
        phone2: orderData.shipping.phone2,
        city: localData?.userInfo[0]?.cityName,
        address: orderData.shipping.address,
        street: orderData.shipping.street,
        reference: orderData.shipping.reference, 
      })
    }
  }, [showAddressForm]); 

  // get details when store change
  useEffect(() => {
    getDetails();
  },[store, street]);  

  // update order
  useEffect(() => {
    if (formIsValid) {
      updateOrder("shipping", {
        ...orderData.shipping,
        ...formik.values,
        city: localData?.userInfo[0]?.cityName,
        address: store === "EXPRESS" ? street : formik.values.address,
        street: store === "EXPRESS" ? street : formik.values.address,
      });
    }
  },[formIsValid, localData?.userInfo[0]?.cityName, street, store]);

  // update order express
  useEffect(() => {
    if (store === "EXPRESS") {
      updateOrder("shipping", {
        firstname: orderData.billing.firstname,
        lastname: orderData.billing.lastname,
        nit: Number(orderData.billing.nit),
        phone: orderData.billing.phone,
        city: localData?.userInfo[0]?.cityName,
        address: street,
        street: street,
      });
    }
  }, [store, localData?.userInfo[0]?.cityName, street]);

  return (
    <Suspense fallback={<Loader />}>     
      <React.Fragment>
        <SC.Back.Wrapper onClick={() => handleNext(history, previousStep)}>
          <img src={arrow} alt={t("controls.back_arrow")} width={16} height={11} />
        </SC.Back.Wrapper>
        <SC.Title>
          <img onClick={() => handleNext(history, previousStep)} src={arrow} alt={t("controls.back_arrow")} width={16} height={11} />
          {isGuestOrder ? <SC.TitleGuest>{t("checkout.delivery.title_guest")}</SC.TitleGuest> :<h2>{t("checkout.delivery.title")}</h2>}
        </SC.Title>
        
        <ChooseShipping street={street} addressId={addressId} showNewAddress={showAddressForm} />

        {showAddressForm && (store === "B2E" || store === "ECOMMERCE") && (
          <FormikProvider value={formik}>
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
        )}

        {showAddressForm && newAddress && (store === "B2E" || store === "ECOMMERCE") && !confirmModalVisible && <Map />}
        <SC.Next.Wrapper>
          <CallToAction text={t("general.next")} action={() => handleNext(history, nextStep)} active={(agency || formIsValid) as boolean} filled />
        </SC.Next.Wrapper>
      </React.Fragment>
    </Suspense>
  );
};

export default Shipping;
