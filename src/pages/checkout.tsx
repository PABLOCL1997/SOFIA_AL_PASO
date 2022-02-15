import React, { Suspense, FC, useEffect, useState, useContext, useMemo } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { CHECKOUT_TITLE } from "../meta";
import { useTranslation } from "react-i18next";

import { SET_USER } from "../graphql/user/mutations";
import { CREATE_ORDER, EMPTY_CART, TODOTIX_ORDER_INFO, SET_TEMP_CART } from "../graphql/cart/mutations";
import { GET_CART_ITEMS, TODOTIX, GET_TOTAL, CHECK_CART } from "../graphql/cart/queries";
import { ProductType } from "../graphql/products/type";
import { useHistory, useLocation } from "react-router-dom";
import { DETAILS, GET_USER } from "../graphql/user/queries";
import { trackOrder, initCheckout } from "../utils/dataLayer";
import { escapeSingleQuote, search } from "../utils/string";
import useCityPriceList from "../hooks/useCityPriceList";
import { GET_SAP_AGENCIES } from "../graphql/products/queries";
import { ShippingMethod } from "../components/CityModal/types";
import { GET_TIME_FRAMES } from "../graphql/metadata/queries";
import { HorarioCorte, TimeFrame } from "../types/TimeFrame";
import dayjs from "dayjs";
import { EBSProduct } from "../types/Product";
import useMinimumPrice from "../hooks/useMinimumPrice";
import * as SC from "../styled-components/pages/checkout";
import { getStep, handleNext, Steps } from "../types/Checkout";
import { Location } from "../context/Location";
import { Courtain } from "../context/Courtain";
import { UserDetails } from "../graphql/user/type";

const isoWeek = require("dayjs/plugin/isoWeek");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
const weekday = require("dayjs/plugin/weekday");
const es = require("dayjs/locale/es");

dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(es);

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/Loader"));
const Billing = React.lazy(() => import(/* webpackChunkName: "Billing" */ "../components/Checkout/Steps/Billing"));
const Shipping = React.lazy(() => import(/* webpackChunkName: "Shipping" */ "../components/Checkout/Steps/Shipping"));
const Payment = React.lazy(() => import(/* webpackChunkName: "Payment" */ "../components/Checkout/Steps/Payment"));
const Review = React.lazy(() => import(/* webpackChunkName: "Review" */ "../components/Checkout/Steps/Review"));
const Cart = React.lazy(() => import(/* webpackChunkName: "Cart" */ "../components/Checkout/Steps/Cart"));
const DeliveryDate = React.lazy(() => import(/* webpackChunkName: "DeliveryDate" */ "../components/Checkout/Steps/DeliveryDate"));
const Ticket = React.lazy(() => import(/* webpackChunkName: "Ticket" */ "../components/Checkout/Ticket"));
const ConfirmAddress = React.lazy(() => import(/* webpackChunkName: "ConfirmAddress" */ "../components/Checkout/ConfirmAddress"));

type Props = {};

type OrderData = {
  discount_amount: number;
  discount_type: string;
  coupon_code: string;
  items: Array<string>;
  delivery_price: number;
  customer_email: string;
  customer_firstname: string;
  customer_lastname: string;
  facturacion: string;
  envio: string;
  payment_method: string;
  DIRECCIONID?: string | null;
  agencia?: string | null;
  vh_inicio?: string | null;
  vh_fin?: string | null;
  delivery_date?: string | null;
};

const Checkout: FC<Props> = () => {
  const [daysAvailable] = useState<Array<dayjs.Dayjs>>([]);
  const daysRequired = 5;
  const SundayKey = 7;
  let counter = 0;
  while (counter < daysRequired) {
    const newDay = dayjs().add(counter, "days");

    if (!(newDay.isoWeekday() === SundayKey) && daysAvailable.length < daysRequired - 1) {
      const nextDay = dayjs().add(counter, "days");
      daysAvailable.push(nextDay);
    }
    counter++;
  }

  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const { idPriceList, agency, city } = useCityPriceList();
  const minimumPrice = useMinimumPrice();

  const [processing, setProcessing] = useState(false);

  const [order, setOrder] = useState<OrderData>();
  const [orderData, setOrderData] = useState<any>({});
  const [orderIsReady, setOrderIsReady] = useState<boolean>(true);
  const [billingChange, setBillingChange] = useState<any>({});
  const [mapUsed, setMapUsed] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [result, setResult] = useState<Array<{ entity_id: string; increment_id: string }>>([]);
  const [agencies, setAgencies] = useState<any>([]);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(ShippingMethod.Delivery);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<dayjs.Dayjs | null>(null);
  const [timeFrames, setTimeFrames] = useState<Array<TimeFrame>>([]);
  const [filteredTimeFrames, setFilteredTimeFrames] = useState<Array<TimeFrame>>([]);
  const [showTodotixPayment, setShowTodotixPayment] = useState(false);

  const { setLoading } = useContext(Courtain.Context);
  const currentStep = useContext(Location.Context);
  const step: Steps = useMemo(() => getStep(currentStep), [currentStep]);

  const { data: localUserData } = useQuery(GET_USER, {});
  const { data: userDetails } = useQuery(DETAILS, {});
  const { data } = useQuery(GET_CART_ITEMS);

  const [getDetails, { data: userData }] = useLazyQuery<UserDetails>(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {

    },
  });
  const [getTodotixLink, { data: todotixData }] = useLazyQuery(TODOTIX);
  const [toggleCartModal] = useMutation(SET_USER, {
    variables: { user: { openCartModal: true } },
  });
  const [setTempCart] = useMutation(SET_TEMP_CART);
  const [createOrder] = useMutation(CREATE_ORDER, {
    variables: {
      ...order,
    },
  });
  const [pay] = useMutation(TODOTIX_ORDER_INFO);
  const [emptyCart] = useMutation(EMPTY_CART, { variables: {} });
  const [showError] = useMutation(SET_USER, {
    variables: { user: { showError: t("checkout.error") } },
  });
  useQuery(GET_SAP_AGENCIES, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      setAgencies(d.agencies);
    },
  });

  useQuery(GET_TIME_FRAMES, {
    fetchPolicy: "network-only",
    variables: {
      city,
    },
    onCompleted: (d) => {
      setTimeFrames(d.timeFrames);
    },
  });

  const [checkAndNewOrder] = useLazyQuery(CHECK_CART, {
    fetchPolicy: "network-only",
    variables: {
      city,
      id_price_list: idPriceList,
      agency,
      cart: JSON.stringify(
        data?.cartItems?.map((p: ProductType) => ({
          entity_id: p.entity_id,
          qty: p.qty,
        }))
      ),
    },
    onCompleted: (data: any) => {
      const cartItems: ProductType[] = JSON.parse(data.checkCart.cart)
      if (cartItems && cartItems.length > 0) {
        setConfirmModalVisible(false);
        const items: Array<string> = validateOrder(cartItems);
        // control: no items
        if (!items.length) return;
        // show modal only on b2c, not on b2b nor pickup
        if (!(idPriceList > 0 || !!agency)) setConfirmModalVisible(true);
        
        const special_address = idPriceList > 0;
        const agencyObj = agency ? search("key", agency || "V07", agencies) : null;
        
        if (!items.length) return;

        const firstname = escapeSingleQuote(orderData.shipping.firstname)
        const lastname = escapeSingleQuote(orderData.shipping.lastname)
        const email = orderData?.billing?.email;
        const country_id = "BO"
        const street = escapeSingleQuote(
          special_address ? orderData.shipping.street.split("|")[0] :
            agency ? agencyObj.street : orderData.shipping.id ?
              orderData.shipping.street : `${orderData.shipping.address || ""}`
        )
        const latitude = agency ? String(agencyObj.latitude) : String((window as any).latitude)
        const longitude = agency ? String(agencyObj.longitude) : String((window as any).longitude)

        setOrder({
          DIRECCIONID: special_address ? String(orderData.shipping.id_address_ebs) : null,
          agencia: agency,
          discount_amount: parseFloat(orderData.coupon ? orderData.coupon.discount : 0),
          discount_type: orderData?.coupon?.type || "",
          coupon_code: orderData?.coupon?.coupon || "",
          items,
          delivery_price: 0,
          customer_email: email,
          customer_firstname: firstname,
          customer_lastname: lastname,
          facturacion: JSON.stringify({
            addressId: userData?.addressId || 0,
            firstname: firstname,
            lastname: lastname,
            fax: orderData.billing.nit,
            email,
            telephone: agency && agencyObj ? orderData.billing.phone : orderData.shipping.phone,
            country_id,
            city: escapeSingleQuote(localUserData?.userInfo[0]?.cityName || "SC"),
            latitude,
            longitude,
            street,
            reference: agency ? agencyObj.reference : escapeSingleQuote(orderData.shipping.reference),
          }),
          envio: JSON.stringify({
            entity_id: orderData.shipping.id,
            firstname: escapeSingleQuote(orderData.shipping.firstname),
            lastname: escapeSingleQuote(orderData.shipping.lastname),
            fax: orderData.shipping.nit,
            email,
            telephone: agency && agencyObj ? orderData.billing.phone : orderData.shipping.phone,
            street,
            city: escapeSingleQuote(orderData.shipping.city || localUserData.userInfo[0].cityName || "SC"),
            region: escapeSingleQuote(orderData.shipping.reference),
            country_id,
            latitude,
            longitude,
          }),
          payment_method: orderData.payment ? orderData.payment.method : "cashondelivery",
          vh_inicio: orderData.vh_inicio,
          vh_fin: orderData.vh_fin,
          delivery_date: orderData.delivery_date,
        });
      } else {
        showError();
      }
    }
  })

  const totalAmount = GET_TOTAL(data.cartItems);

  useEffect(() => {
    (window as any).updateMapUsed = () => setMapUsed(true);
    document.title = CHECKOUT_TITLE;
    (window as any).orderData = {};
    let params = new URLSearchParams(location.search);
    if (params.get("id")) {
      (async () => {
        try {
          const response = await pay({
            variables: {
              parent_ids: params.get("id"),
            },
          });
          setLoading(false);
          setResult(
            response.data.todotixPayment.map((co: any) => ({
              entity_id: co.entity_id,
              increment_id: co.increment_id,
            }))
          );
          window.history.pushState("checkout", "Tienda Sofia - Checkout", "/checkout");
          history.push(`/gracias?ids=${response.data.todotixPayment.map(({ increment_id }: any) => increment_id).join(",")}`);
        } catch (e) {
          setLoading(false);
          showError();
        }
      })();
    } else {
      // if this is not a todotix redirect then get user details
      getDetails();
    }

    const body = document.querySelector("body");
    if (body && window.innerWidth >= 768) body.style.overflow = "unset";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // initcheckout event on DataLayer
    if (userData && (userData as any).email) {
      initCheckout(parseFloat(totalAmount.replace(",", ".")), (userData as any).email, data.cartItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    // when there is a new order
    if (order) {
      (async () => {
        try {
          setLoading(true);
          setProcessing(true);
          const response = await createOrder();
          response.data.createOrder.forEach((co: any) => {
            trackOrder(
              {
                increment_id: co.increment_id,
                total: parseFloat(totalAmount.replace(",", ".")),
                coupon: orderData.coupon ? orderData.coupon.coupon : "",
                email: orderData.billing ? orderData.billing.email : "",
              },
              data.cartItems
            );
          });
          if (orderData.payment && orderData.payment.method === "todotix") {
            setLoading(false);
            getTodotixLink({
              variables: {
                orderIds: response.data.createOrder.map((co: any) => co.entity_id),
              },
            });
          } else {
            setResult(
              response.data.createOrder.map((co: any) => ({
                entity_id: co.entity_id,
                increment_id: co.increment_id,
              }))
            );
            emptyCart();
            setProcessing(false);
            setLoading(false);
            const pickup = agency ? agency : "";
            history.push(`/gracias?ids=${response.data.createOrder.map(({ increment_id }: any) => increment_id).join(",")}&pickup=${pickup}`);
          }
        } catch (e) {
          showError();
          setProcessing(false);
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    if (todotixData && todotixData.todotix) {
      setProcessing(false);
      setLoading(false);
      emptyCart();
      if (todotixData.todotix.url_pasarela_pagos) {
        setShowTodotixPayment(true);
      } else
        showError({
          variables: { user: { showError: t("checkout.todotix_error") } },
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todotixData]);

  useEffect(() => {
    if (agency) {
      setShippingMethod(ShippingMethod.Pickup);
    } else {
      setShippingMethod(ShippingMethod.Delivery);
    }
  }, [agency]);
  
  useEffect(() => {
    if (selectedTimeFrame?.turno?.inicio && selectedTimeFrame?.turno?.fin) {
      orderData.vh_inicio = selectedTimeFrame.turno.inicio;
      orderData.vh_fin = selectedTimeFrame.turno.fin;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeFrame]);

  useEffect(() => {
    if (deliveryDate) {
      orderData.delivery_date = dayjs(deliveryDate).toISOString();
      // calculate time frames for deliveryDate
      const dateComparator: dayjs.OpUnitType = "days";
      const hourComparator: dayjs.OpUnitType = "hours";

      const hoursUnitType: dayjs.UnitType = "hours";
      const minutesUnitType: dayjs.UnitType = "minutes";
      const today = dayjs();
      const tomorrow = dayjs().add(1, "day");

      if (dayjs(deliveryDate).isSame(today, dateComparator)) {
        // TODO: reducir codigo duplicado
        setFilteredTimeFrames(
          timeFrames.filter((timeFrame: TimeFrame) => {
            const hasSameDay = timeFrame.horario_corte.some(
              (horario: HorarioCorte) =>
                horario.mismo_dia &&
                dayjs().isBefore(
                  dayjs()
                    .set(hoursUnitType, parseInt(horario.horario.split(":")[0]))
                    .set(minutesUnitType, parseInt(horario.horario.split(":")[1])),
                  hourComparator
                )
            );
            return hasSameDay ? timeFrame : null;
          })
        );
      }

      if (dayjs(deliveryDate).isSame(tomorrow, dateComparator)) {
        // TODO: reducir codigo duplicado
        setFilteredTimeFrames(
          timeFrames.filter((timeFrame: TimeFrame) => {
            const hasBeforeDay = timeFrame.horario_corte.some(
              (horario: HorarioCorte) =>
                horario.dia_anterior &&
                dayjs().isBefore(
                  dayjs()
                    .set(hoursUnitType, parseInt(horario.horario.split(":")[0]))
                    .set(minutesUnitType, parseInt(horario.horario.split(":")[1])),
                  hourComparator
                )
            );
            return hasBeforeDay ? timeFrame : null;
          })
        );
      }

      // if it is after tomorrow
      if (dayjs(deliveryDate).isAfter(tomorrow, dateComparator)) {
        setFilteredTimeFrames(timeFrames);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryDate]);

  const validateOrder = (cartItems: ProductType[]) => {
    let items: Array<string> = [];
    const special_address = idPriceList > 0;
    const shippingServiceItem: EBSProduct = {
      CODIGO: "670000",
      DESCRIPCION: "SERVICIO DE TRANSPORTE DE PRODUCTOS",
      CANTIDAD: 1,
      UNIDAD: "UNI",
      PRECIO: 15,
    };

    cartItems.forEach((product: ProductType) => {
      items.push(
        JSON.stringify({
          entity_id: product.entity_id,
          sku: product.sku,
          category: product.category_name ? product.category_name.toLowerCase().trim() : "",
          name: product.name,
          price: product.special_price || product.price,
          quantity: product.qty,
          type_id: "simple",
          addQty: true,
          toSerialize: {
            info_buyRequest: {
              uenc: "",
              product: product.entity_id,
              form_key: "",
              related_product: "",
              super_attribute: {},
              qty: product.qty,
            },
          },
        })
      );
    });

    // if it isn't a pickup order
    // and order price is less than minimum price add the shipping item
    if (!agency && Number(totalAmount.replace(",", ".")) < minimumPrice) {
      items.push(
        JSON.stringify({
          entity_id: shippingServiceItem.CODIGO,
          sku: shippingServiceItem.CODIGO,
          category: "",
          name: shippingServiceItem.DESCRIPCION,
          price: shippingServiceItem.PRECIO,
          quantity: 1,
          type_id: "simple",
          addQty: true,
          toSerialize: {
            info_buyRequest: {
              uenc: "",
              product: shippingServiceItem.CODIGO,
              form_key: "",
              related_product: "",
              super_attribute: {},
              qty: 1,
            },
          },
        })
      );
    }

    document.querySelectorAll(`.error`).forEach((input: any) => {
      input?.classList.remove("error");
    });

    let missingField = false;
    const requiredFields = agency ? ["firstname", "lastname", "email", "nit", "phone"] : ["firstname", "lastname", "email", "nit"];
    requiredFields.forEach((key: string) => {
      if (orderData?.billing) {
        if (!orderData.billing[key] && !missingField) {
          missingField = true;
          const input = document.querySelector(`[name="billing-${key}"]`);
          if (input) {
            input.classList.add("error");
            window.scrollTo({
              top: (input as any).offsetTop - 170,
              behavior: "smooth",
            });
          }
          showError({
            variables: {
              user: {
                showError: t("checkout.missing_field", {
                  field: t("checkout.billing." + key),
                }),
              },
            },
          });
        }
      }
    });

    if (!mapUsed && !orderData.shipping.id && !special_address && !agency) {
      window.scrollTo({
        top: (document as any).getElementById("gmap").getBoundingClientRect().top + (window as any).scrollY - 170,
        behavior: "smooth",
      });
      showError({
        variables: {
          user: {
            showError: t("checkout.move_map"),
          },
        },
      });
      return [];
    }

    if (!missingField && !orderData.shipping.id && !agency) {
      ["firstname", "phone", "phone2", "nit", "city", "address", "reference"].forEach((key: string) => {
        if ((!orderData.shipping[key] || !orderData.shipping[key].trim()) && !missingField) {
          if (key === "building_name" && orderData.shipping.home_type === "Casa") return [];
          missingField = true;

          const input = document.querySelector(`[name="shipping-${key}"]`);
          if (input) {
            input.classList.add("error");
            window.scrollTo({
              top: (input as any).offsetTop - 170,
              behavior: "smooth",
            });
          }
          showError({
            variables: {
              user: {
                showError: t("checkout.missing_field", {
                  field: t("checkout.delivery." + key),
                }),
              },
            },
          });
        }
      });
    }

    if (!agency) {
      ["delivery_date", "vh_inicio", "vh_fin"].forEach((key: string, index: number) => {
        const keys = ["delivery_date", "time_frame"];
        if (!orderData[key] && !missingField) {
          missingField = true;

          const input: HTMLInputElement | null = document.querySelector(`[name="shipping-${key}"]`);
          if (input) {
            input.classList.add("error");
            window.scrollTo({
              top: input.offsetTop - 170,
              behavior: "smooth",
            });
          }
          showError({
            variables: {
              user: {
                showError: t("checkout.missing_field", {
                  field: t("checkout.delivery." + keys[index]),
                }),
              },
            },
          });
        }
      });
    }
    if (missingField) return [];
    return items;
  };

  const saveOrder = () => {
    checkAndNewOrder();
  };

  const updateOrderData = (key: string, values: any) => {
    if (key === "billing" && values.email) {
      setTempCart({
        variables: {
          email: values.email,
          items: JSON.stringify({
            firstname: values.firstname || "",
            items: data.cartItems.map((product: ProductType) => {
              return {
                name: product.name || "",
                image: product.image || "",
                price: product.special_price || 0,
                qty: product.qty || 0,
              };
            }),
          }),
        },
      });
    }

    if (key === "billing") setBillingChange(values);

    (window as any).orderData = {
      ...(window as any).orderData,
      [key]: values,
    };

    setOrderData((window as any).orderData);
  };

  return (
    <Suspense fallback={<Loader />}>
      <SC.Wrapper>
        <ConfirmAddress
          address={orderData.shipping && orderData.shipping.id && orderData.shipping.street ? orderData.shipping.street.replace(/\|/g, " ") : ""}
          visible={confirmModalVisible}
          confirm={saveOrder}
          cancel={() => setConfirmModalVisible(false)}
        />
        <div className="main-container">
          {!showTodotixPayment && !result.length && (
            <SC.CheckoutWrapper>
              <SC.ShippingMethodWrapper>
                <h4>
                  {step === Steps.Shipping && shippingMethod === ShippingMethod.Pickup ? t("checkout.title_pickup"):
                    step === Steps.Shipping && shippingMethod === ShippingMethod.Delivery ? t("checkout.title_delivery"):
                      step === Steps.Cart ? t("checkout.cart.title")
                      : t("checkout.title")}
                                    
                </h4>
                {step === Steps.Cart ? 
                  <a href="#" onClick={() => toggleCartModal()}>{t("checkout.cart.modify_cart")}</a>
                  : <a href="#" onClick={() => handleNext(history, `cart&next=${Steps[step]}`)}>{t("checkout.cart.check_cart")}</a>
                }
              </SC.ShippingMethodWrapper>
              <SC.Cols>
                <SC.Col1>
                  {step === Steps.Billing ? (
                    <SC.Steps>
                      <Billing updateOrder={updateOrderData } />
                    </SC.Steps>
                  ) : null}

                  {step === Steps.Shipping ? (
                    <SC.Steps>
                      <Shipping
                        updateOrder={updateOrderData}
                        confirmModalVisible={confirmModalVisible}
                        setOrderIsReady={setOrderIsReady}
                      />
                    </SC.Steps>
                  ) : null}

                  {step === Steps.Timeframe ? (
                    <SC.Steps>
                      <DeliveryDate
                        daysAvailable={daysAvailable}
                        timeFrames={filteredTimeFrames}
                        selectedTimeFrame={selectedTimeFrame}
                        setSelectedTimeFrame={setSelectedTimeFrame}
                        setDeliveryDate={setDeliveryDate}
                        deliveryDate={deliveryDate}
                      />                      
                    </SC.Steps>
                  ): null}

                  {step === Steps.Payment ? (
                    <SC.Steps>
                      <Payment
                        setOrderIsReady={setOrderIsReady}
                        totalAmount={totalAmount}
                        updateOrder={updateOrderData}
                        userDetails={userDetails}
                        orderData={orderData}
                      />
                    </SC.Steps>
                  ) : null}

                  {step === Steps.Review ? (
                    <SC.Steps>
                      <Review
                        orderData={orderData}
                        confirmOrder={saveOrder}
                        deliveryDate={deliveryDate}
                        selectedTimeFrame={selectedTimeFrame}
                        updateOrder={updateOrderData}
                      />
                    </SC.Steps>
                  ) : null}

                  {step === Steps.Cart ? (
                    <SC.Steps>
                      <Cart showGoBack updateOrder={updateOrderData} />
                    </SC.Steps>
                  ): null}
                </SC.Col1>
                <SC.Col2>
                  <Ticket
                    ready={orderIsReady}
                    userDetails={userDetails}
                    userData={localUserData}
                    processing={processing}
                    updateOrder={updateOrderData}
                    order={saveOrder}
                    step={step}
                  />
                </SC.Col2>
              </SC.Cols>
            </SC.CheckoutWrapper>
          )}

          {showTodotixPayment && <iframe src={todotixData.todotix.url_pasarela_pagos}></iframe>}
        </div>
      </SC.Wrapper>
    </Suspense>
  );
};

export default Checkout;
