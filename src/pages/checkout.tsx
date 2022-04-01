import React, { Suspense, FC, useEffect, useState, useContext, useMemo } from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { CHECKOUT_TITLE } from "../meta";
import { useTranslation } from "react-i18next";
import { SET_USER } from "../graphql/user/mutations";
import { CREATE_ORDER, EMPTY_CART, TODOTIX_ORDER_INFO, SET_TEMP_CART } from "../graphql/cart/mutations";
import { TODOTIX, CHECK_CART } from "../graphql/cart/queries";
import { ProductType } from "../graphql/products/type";
import { useHistory, useLocation } from "react-router-dom";
import { trackOrder, initCheckout } from "../utils/dataLayer";
import { escapeSingleQuote, search } from "../utils/string";
import { EBSProduct } from "../types/Product";
import { getStep, handleNext, Steps } from "../types/Checkout";
import { Order, OrderData, orderDataInitValues } from "../types/Order";
import { Location } from "../context/Location";
import { Courtain } from "../context/Courtain";
import { UserDetails } from "../graphql/user/type";
import { DETAILS, GET_USER } from "../graphql/user/queries";

import * as SC from "../styled-components/pages/checkout";
import useUser from "../hooks/useUser";
import useCityPriceList from "../hooks/useCityPriceList";
import useMinimumPrice from "../hooks/useMinimumPrice";
import useCart from "../hooks/useCart";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/Loader"));
const Billing = React.lazy(() => import(/* webpackChunkName: "Billing" */ "../components/Checkout/Steps/Billing"));
const Shipping = React.lazy(() => import(/* webpackChunkName: "Shipping" */ "../components/Checkout/Steps/Shipping"));
const Payment = React.lazy(() => import(/* webpackChunkName: "Payment" */ "../components/Checkout/Steps/Payment"));
const Review = React.lazy(() => import(/* webpackChunkName: "Review" */ "../components/Checkout/Steps/Review"));
const Cart = React.lazy(() => import(/* webpackChunkName: "Cart" */ "../components/Checkout/Steps/Cart"));
const DeliveryDate = React.lazy(() => import(/* webpackChunkName: "DeliveryDate" */ "../components/Checkout/Steps/DeliveryDate"));
const Ticket = React.lazy(() => import(/* webpackChunkName: "Ticket" */ "../components/Checkout/Ticket"));
const ConfirmAddress = React.lazy(() => import(/* webpackChunkName: "ConfirmAddress" */ "../components/Checkout/ConfirmAddress"));

const Checkout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const { idPriceList, agency, city, agencies, express } = useCityPriceList();
  const { store } = useUser();
  const minimumPrice = useMinimumPrice();
  const { cart: data, totalAmount } = useCart();

  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<Order>();
  const [orderData, setOrderData] = useState<OrderData>(orderDataInitValues);
  const [orderIsReady, setOrderIsReady] = useState<boolean>(true);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [result, setResult] = useState<Array<{ entity_id: string; increment_id: string }>>([]);
  const [showTodotixPayment, setShowTodotixPayment] = useState(false);

  const { setLoading } = useContext(Courtain.Context);
  const currentStep = useContext(Location.Context);
  const step: Steps = useMemo(() => getStep(currentStep), [currentStep]);

  const { data: localUserData } = useQuery(GET_USER, {});
  const { data: userDetails } = useQuery(DETAILS, {});

  const [getDetails, { data: userData }] = useLazyQuery<UserDetails>(DETAILS, {
    fetchPolicy: "network-only",
  });
  const [getTodotixLink, { data: todotixData }] = useLazyQuery(TODOTIX);
  const [removeCoupon] = useMutation(SET_USER, {
    variables: { user: { coupon: null } },
  });
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
      const cartItems: ProductType[] = JSON.parse(data.checkCart.cart);
      if (cartItems && cartItems.length > 0) {
        setConfirmModalVisible(false);
        const items: Array<string> = validateOrder(cartItems);
        // control: no items
        if (!items.length) return;
        // show modal only on b2c, not on b2b nor pickup
        if (!(idPriceList > 0 || !!agency)) setConfirmModalVisible(true);

        const special_address = idPriceList > 0;
        let agencyObj = null;
        if (store === "EXPRESS") {
          agencyObj = agency ? search("key", agency, express) : null;
        } else {
          agencyObj = agency ? search("key", agency, agencies) : null;
        }
        const isPickup = store === "PICKUP";
        if (!items.length) return;

        const delivery_price = store === "EXPRESS" ? 15 : 0;
        const firstname = escapeSingleQuote(orderData.shipping.firstname || orderData.billing.firstname);
        const lastname = escapeSingleQuote(orderData.shipping.lastname || orderData.billing.lastname);
        const email = orderData?.billing?.email;
        const country_id = "BO";
        const street = escapeSingleQuote(
          special_address ? orderData.shipping.street.split("|")[0] : isPickup ? agencyObj.street : orderData.shipping.id ? orderData.shipping.street : `${orderData.shipping.address || ""}`
        );
        const latitude = isPickup ? String(agencyObj.latitude) : String((window as any).latitude);
        const longitude = isPickup ? String(agencyObj.longitude) : String((window as any).longitude);

        setOrder({
          SISTEMA: store,
          agencia: agency,
          items,
          delivery_price,
          DIRECCIONID: special_address ? String(orderData.shipping.id_address_ebs) : null,
          discount_amount: orderData.coupon.discount,
          discount_type: orderData?.coupon?.type || "",
          coupon_code: orderData?.coupon?.coupon || "",
          customer_email: email,
          customer_firstname: firstname,
          customer_lastname: lastname,
          facturacion: JSON.stringify({
            addressId: userData?.addressId || 0,
            firstname: firstname,
            lastname: lastname,
            fax: orderData.billing.nit,
            email,
            telephone: isPickup && agencyObj ? orderData.billing.phone : orderData.shipping.phone,
            country_id,
            city: escapeSingleQuote(localUserData?.userInfo[0]?.cityName || "SC"),
            latitude,
            longitude,
            street,
            reference: isPickup ? agencyObj.reference : escapeSingleQuote(orderData.shipping.reference),
          }),
          envio: JSON.stringify({
            entity_id: orderData.shipping.id,
            firstname: escapeSingleQuote(orderData.shipping.firstname),
            lastname: escapeSingleQuote(orderData.shipping.lastname),
            fax: orderData.shipping.nit,
            email,
            telephone: isPickup && agencyObj ? orderData.billing.phone : orderData.shipping.phone,
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
        removeCoupon();
      } else {
        showError();
      }
    },
  });

  useEffect(() => {
    document.title = CHECKOUT_TITLE;
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
          initCheckout(parseFloat(totalAmount.replace(",", ".")), (userData as any).email || "Guest", data.cartItems);
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
                coupon: orderData.coupon.coupon || "",
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
            const pickup = store === "PICKUP" ? agency : "";
            initCheckout(parseFloat(totalAmount.replace(",", ".")), (userData as any).email, data.cartItems);
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

  const validateOrder = (cartItems: ProductType[]) => {
    let items: Array<string> = [];

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
    if (store !== "PICKUP" && store !== "EXPRESS" && Number(totalAmount.replace(",", ".")) < minimumPrice) {
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
    const requiredFields = store === "EXPRESS" || store === "PICKUP" ? ["firstname", "lastname", "email", "nit", "phone"] : ["firstname", "lastname", "email", "nit"];
    requiredFields.forEach((key: string) => {
      // @ts-ignore
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
    });

    if (!missingField && !orderData.shipping.id && store !== "PICKUP") {
      const shippingFields = store === "EXPRESS" ? ["firstname", "phone", "nit", "city", "address"] : ["firstname", "phone", "phone2", "nit", "city", "address", "reference"];
      shippingFields.forEach((key: string) => {
        // @ts-ignore
        if ((!orderData.shipping[key] || (typeof orderData.shipping[key] === "string" && !orderData.shipping[key].trim())) && !missingField) {
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

    if (store !== "EXPRESS" && store !== "PICKUP") {
      ["delivery_date", "vh_inicio", "vh_fin"].forEach((key: string, index: number) => {
        const keys = ["delivery_date", "time_frame"];
        // @ts-ignore
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
    // show popup with map (get coords) to confirm order
    if (!(window as any).latitude || !(window as any).longitude) {
      return setConfirmModalVisible(true);
    }
    return checkAndNewOrder();
  };

  const updateOrderData = (key: string, values: any) => {
    setOrderData({
      ...orderData,
      [key]: values,
    });

    if (key === "billing" && values.email) {
      setTempCart({
        variables: {
          email: values.email,
          items: JSON.stringify({
            firstname: values.firstname || "",
            items:
              data?.cartItems?.map((product: ProductType) => {
                return {
                  name: product.name || "",
                  image: product.image || "",
                  price: product.special_price || 0,
                  qty: product.qty || 0,
                };
              }) || [],
          }),
        },
      });
    }
  };

  return (
    <Suspense fallback={<Loader />}>
      <ConfirmAddress
        address={orderData.shipping.street ? orderData.shipping.street.replace(/\|/g, " ") : ""}
        visible={confirmModalVisible}
        confirm={saveOrder}
        cancel={() => setConfirmModalVisible(false)}
      />
      <SC.Wrapper>
        <div className="main-container">
          {!showTodotixPayment && !result.length && (
            <SC.CheckoutWrapper>
              <SC.ShippingMethodWrapper>
                <h4>
                  {step === Steps.Shipping && store === "PICKUP"
                    ? t("checkout.title_pickup")
                    : step === Steps.Shipping && store !== "PICKUP"
                    ? t("checkout.title_delivery")
                    : step === Steps.Cart
                    ? t("checkout.cart.title")
                    : t("checkout.title")}
                </h4>
                {step === Steps.Cart ? (
                  <a href="#" onClick={() => toggleCartModal()}>
                    {t("checkout.cart.modify_cart")}
                  </a>
                ) : (
                  <a href="#" onClick={() => handleNext(history, `cart&next=${Steps[step]}`)}>
                    {t("checkout.cart.check_cart")}
                  </a>
                )}
              </SC.ShippingMethodWrapper>
              <SC.Cols>
                <SC.Col1>
                  {step === Steps.Billing ? (
                    <SC.Steps>
                      <Billing updateOrder={updateOrderData} />
                    </SC.Steps>
                  ) : null}

                  {step === Steps.Shipping ? (
                    <SC.Steps>
                      <Shipping updateOrder={updateOrderData} confirmModalVisible={confirmModalVisible} setOrderIsReady={setOrderIsReady} orderData={orderData} />
                    </SC.Steps>
                  ) : null}

                  {step === Steps.Timeframe ? (
                    <SC.Steps>
                      <DeliveryDate updateOrder={updateOrderData} setOrderData={setOrderData} orderData={orderData} />
                    </SC.Steps>
                  ) : null}

                  {step === Steps.Payment ? (
                    <SC.Steps>
                      <Payment setOrderIsReady={setOrderIsReady} totalAmount={totalAmount} updateOrder={updateOrderData} userDetails={userDetails} orderData={orderData} />
                    </SC.Steps>
                  ) : null}

                  {step === Steps.Review ? (
                    <SC.Steps>
                      <Review orderData={orderData} confirmOrder={saveOrder} updateOrder={updateOrderData} />
                    </SC.Steps>
                  ) : null}

                  {step === Steps.Cart ? (
                    <SC.Steps>
                      <Cart showGoBack updateOrder={updateOrderData} />
                    </SC.Steps>
                  ) : null}
                </SC.Col1>
                <SC.Col2>
                  <Ticket ready={orderIsReady} userDetails={userDetails} userData={localUserData} processing={processing} updateOrder={updateOrderData} order={saveOrder} step={step} />
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
