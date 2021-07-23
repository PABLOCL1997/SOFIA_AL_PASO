import React, { Suspense, FC, useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { CHECKOUT_TITLE } from "../meta";
import { useTranslation } from "react-i18next";
import useMinimumPrice from "../hooks/useMinimumPrice";

import { SET_USER } from "../graphql/user/mutations";
import { BREAKPOINT } from "../utils/constants";
import {
  CREATE_ORDER,
  EMPTY_CART,
  TODOTIX_ORDER_INFO,
  SET_TEMP_CART
} from "../graphql/cart/mutations";
import {
  GET_CART_ITEMS,
  TODOTIX,
  GET_TOTAL,
} from "../graphql/cart/queries";
import { ProductType } from "../graphql/products/type";
import { useHistory, useLocation } from "react-router-dom";
import { DETAILS, GET_USER } from "../graphql/user/queries";
import { trackOrder, initCheckout } from "../utils/dataLayer";
import { escapeSingleQuote } from "../utils/string";
import useCityPriceList from "../hooks/useCityPriceList";

const Loader = React.lazy(
  () => import(/* webpackChunkName: "Loader" */ "../components/Loader")
);
const Billing = React.lazy(
  () =>
    import(/* webpackChunkName: "Billing" */ "../components/Checkout/Billing")
);
const Shipping = React.lazy(
  () =>
    import(/* webpackChunkName: "Shipping" */ "../components/Checkout/Shipping")
);
const Payment = React.lazy(
  () =>
    import(/* webpackChunkName: "Payment" */ "../components/Checkout/Payment")
);
const Ticket = React.lazy(
  () => import(/* webpackChunkName: "Ticket" */ "../components/Checkout/Ticket")
);
const Thanks = React.lazy(
  () => import(/* webpackChunkName: "Thanks" */ "../components/Checkout/Thanks")
);
const ConfirmAddress = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ConfirmAddress" */ "../components/Checkout/ConfirmAddress"
    )
);

const Wrapper = styled.div`
  padding: 60px 100px;
  background: var(--bkg);
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 20px;
  }
`;

const CheckoutWrapper = styled.div``;

const ThanktWrapper = styled.div``;

const Cols = styled.div`
  display: flex;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
  }
`;

const Col1 = styled.div`
  flex: 1;
`;

const Col2 = styled.div`
  width: 364px;
  margin-left: 16px;
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    margin-left: 0;
    margin-top: 40px;
  }
`;

const Title = styled.div`
  display: flex;
  padding-right: 380px;
  align-items: center;
  margin-bottom: 25px;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding-right: 0;
  }
  h2 {
    flex: 1;
    font-family: MullerMedium;
    font-size: 32px;
    line-height: 32px;
    color: var(--black);
  }
  button {
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 14px;
    text-align: right;
    text-decoration-line: underline;
    color: var(--red);
    background: none;
    border: 0;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const Steps = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 20px;
  }
`;

const Line = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.11);
  margin: 48px 0;
`;

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
  DIRECCIONID?: number;
  agencia?:string
};

const Checkout: FC<Props> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const minimumPrice = useMinimumPrice()
  const { idPriceList } = useCityPriceList()

  const [processing, setProcessing] = useState(false);
  const [userData, setUserData] = useState({});
  const [order, setOrder] = useState<OrderData>();
  const [orderData, setOrderData] = useState<any>({});
  const [orderIsReady, setOrderIsReady] = useState<boolean>(true);
  const [billingChange, setBillingChange] = useState<any>({});
  const [mapUsed, setMapUsed] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [result, setResult] = useState<
    Array<{ entity_id: string; increment_id: string }>
  >([]);

  const { data: localUserData } = useQuery(GET_USER, {});
  const {data: userDetails} = useQuery(DETAILS, {})
  const { data } = useQuery(GET_CART_ITEMS);
  const [getDetails] = useLazyQuery(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: d => {
      setUserData(d.details);
    }
  });
  const [getTodotixLink, { data: todotixData }] = useLazyQuery(TODOTIX);
  const [toggleCartModal] = useMutation(SET_USER, {
    variables: { user: { openCartModal: true } }
  });
  const [setTempCart] = useMutation(SET_TEMP_CART);
  const [createOrder] = useMutation(CREATE_ORDER, {
    variables: {
      ...order
    }
  });
  const [pay] = useMutation(TODOTIX_ORDER_INFO);
  const [emptyCart] = useMutation(EMPTY_CART, { variables: {} });
  const [showError] = useMutation(SET_USER, {
    variables: { user: { showError: t("checkout.error") } }
  });

  const totalAmount = GET_TOTAL(data.cartItems);

  useEffect(() => {
    if (
      localUserData &&
      localUserData.userInfo[0] &&
      !localUserData.userInfo[0].isLoggedIn
    ) {
      (window as any).location = "/";
    }
  }, [localUserData]);

  useEffect(() => {
    (window as any).updateMapUsed = () => setMapUsed(true);
    document.title = CHECKOUT_TITLE;
    (window as any).orderData = {};
    let params = new URLSearchParams(location.search);
    if (
      params.get("id")
    ) {
      (async () => {
        try {
          const response = await pay({
            variables: {
              parent_ids: params.get("id")
            }
          });
          setResult(
            response.data.todotixPayment.map((co: any) => ({
              entity_id: co.entity_id,
              increment_id: co.increment_id
            }))
          );
          window.history.pushState(
            "checkout",
            "Tienda Sofia - Checkout",
            "/checkout"
          );
        } catch (e) {
          showError();
        }
      })();
    } else {
      if (data && !data.cartItems.length) history.push("/");
      else if (
        parseFloat(totalAmount.replace(",", ".")) < minimumPrice
      )
        history.push("/");
      else {
        getDetails();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData && (userData as any).email) {
      initCheckout(
        parseFloat(totalAmount.replace(",", ".")),
        (userData as any).email,
        data.cartItems
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    if (order) {
      (async () => {
        try {
          setProcessing(true);
          const response = await createOrder();
          response.data.createOrder.forEach((co: any) => {
            trackOrder(
              {
                increment_id: co.increment_id,
                total: parseFloat(totalAmount.replace(",", ".")),
                coupon: orderData.coupon ? orderData.coupon.coupon : "",
                email: orderData.billing ? orderData.billing.email : ""
              },
              data.cartItems
            );
          });
          if (orderData.payment && orderData.payment.method === "todotix") {
            getTodotixLink({
              variables: {
                orderIds: response.data.createOrder.map(
                  (co: any) => co.entity_id
                )
              }
            });
          } else {
            setResult(
              response.data.createOrder.map((co: any) => ({
                entity_id: co.entity_id,
                increment_id: co.increment_id
              }))
            );
            emptyCart();
            setProcessing(false);
          }
        } catch (e) {
          showError();
          setProcessing(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    if (todotixData && todotixData.todotix) {
      setProcessing(false);
      emptyCart();
      if (todotixData.todotix.url_pasarela_pagos)
        window.location = todotixData.todotix.url_pasarela_pagos;
      else
        showError({
          variables: { user: { showError: t("checkout.todotix_error") } }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todotixData]);

  const validateOrder = () => {
    let items: Array<string> = [];
    const special_address = idPriceList > 0

    data &&
      data.cartItems &&
      data.cartItems.forEach((product: ProductType) => {
        items.push(
          JSON.stringify({
            entity_id: product.entity_id,
            sku: product.sku,
            category: product.category_name
              ? product.category_name.toLowerCase().trim()
              : "",
            name: product.name,
            price: product.special_price
              ? product.special_price
              : product.price,
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
                qty: product.qty
              }
            }
          })
        );
      });

    document.querySelectorAll(`.error`).forEach((input: any) => {
      input?.classList.remove("error");
    });

    let missingField = false;
    ["firstname", "lastname", "email", "nit"].forEach((key: string) => {
      if (!orderData.billing[key] && !missingField) {
        missingField = true;
        const input = document.querySelector(`[name="billing-${key}"]`);
        if (input) {
          input.classList.add("error");
          window.scrollTo({
            top: (input as any).offsetTop - 170,
            behavior: "smooth"
          });
        }
        showError({
          variables: {
            user: {
              showError: t("checkout.missing_field", {
                field: t("checkout.billing." + key)
              })
            }
          }
        });
      }
    });

    if (!mapUsed && !orderData.shipping.id && !special_address) {
      window.scrollTo({
        top:
          (document as any).getElementById("gmap").getBoundingClientRect().top +
          (window as any).scrollY -
          170,
        behavior: "smooth"
      });
      showError({
        variables: {
          user: {
            showError: t("checkout.move_map")
          }
        }
      });
      return [];
    }

    if (!missingField && !orderData.shipping.id) {
      [
        "firstname",
        "lastname",
        "phone",
        "phone2",
        "nit",
        "city",
        "address",
        "reference"
      ].forEach((key: string) => {
        if (
          (!orderData.shipping[key] || !orderData.shipping[key].trim()) &&
          !missingField
        ) {
          if (
            key === "building_name" &&
            orderData.shipping.home_type === "Casa"
          )
            return [];
          missingField = true;
          const input = document.querySelector(`[name="shipping-${key}"]`);
          if (input) {
            input.classList.add("error");
            window.scrollTo({
              top: (input as any).offsetTop - 170,
              behavior: "smooth"
            });
          }
          showError({
            variables: {
              user: {
                showError: t("checkout.missing_field", {
                  field: t("checkout.delivery." + key)
                })
              }
            }
          });
        }
      });
    }

    if (missingField) return [];
    return items;
  };

  const saveOrder = () => {
    setConfirmModalVisible(false);
    const items: Array<string> = validateOrder();
    const special_address = idPriceList > 0
    if (!items.length) return;

    setOrder({
      DIRECCIONID: special_address ? orderData.shipping.street.split("|")[1].replace(/ /g,"") : null,
      agencia: undefined,
      discount_amount: parseFloat(
        orderData.coupon ? orderData.coupon.discount : 0
      ),
      discount_type: orderData.coupon ? orderData.coupon.type : "",
      coupon_code: orderData.coupon ? orderData.coupon.coupon : "",
      items: items,
      delivery_price: 0,
      customer_email: orderData.billing.email,
      customer_firstname: escapeSingleQuote(orderData.billing.firstname),
      customer_lastname: escapeSingleQuote(orderData.billing.lastname),
      facturacion: JSON.stringify({
        addressId: userData && (userData as any).addressId
            ? (userData as any).addressId
            : 0,
        firstname: escapeSingleQuote(orderData.billing.firstname),
        lastname: escapeSingleQuote(orderData.billing.lastname),
        fax: orderData.billing.nit,
        email: orderData.billing.email,
        telephone: orderData.shipping.phone2,
        country_id: "BO",
        city: escapeSingleQuote(
          localUserData &&
            localUserData.userInfo &&
            localUserData.userInfo.length
            ? localUserData.userInfo[0].cityName
            : "-"
        ),
        latitude: String((window as any).latitude),
        longitude: String((window as any).longitude),
        street: escapeSingleQuote(
          special_address ? orderData.shipping.street.split("|")[0] :
          orderData.shipping.id
            ? orderData.shipping.street
            : `${orderData.shipping.address || ""}`
        ),
        reference: escapeSingleQuote(orderData.shipping.reference)
      }),
      envio: JSON.stringify({
        entity_id: orderData.shipping.id,
        firstname: escapeSingleQuote(orderData.shipping.firstname),
        lastname: escapeSingleQuote(orderData.shipping.lastname),
        fax: orderData.shipping.nit,
        email: orderData.billing.email,
        telephone: orderData.shipping.phone,
        street: escapeSingleQuote(
          special_address ? orderData.shipping.street.split("|")[0] :
          orderData.shipping.id
            ? orderData.shipping.street
            : `${orderData.shipping.address || ""}`
        ),
        city: escapeSingleQuote(
          orderData.shipping.city ||
            (localUserData &&
            localUserData.userInfo &&
            localUserData.userInfo.length
              ? localUserData.userInfo[0].cityName
              : "-")
        ),
        region: escapeSingleQuote(orderData.shipping.reference),
        country_id: "BO",
        latitude: String((window as any).latitude),
        longitude: String((window as any).longitude)
      }),
      payment_method: orderData.payment
        ? orderData.payment.method
        : "cashondelivery"
    });
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
                qty: product.qty || 0
              };
            })
          })
        }
      });
    }

    if (key === "billing") setBillingChange(values);
    (window as any).orderData = {
      ...(window as any).orderData,
      [key]: values
    };
    setOrderData((window as any).orderData);
  };

  const showConfirmAddress = () => {
    const items: Array<string> | boolean = validateOrder();
    let b2e = false
    try {
      b2e = idPriceList > 0
    } catch (e) {
      b2e = false
    }
    console.log('show', b2e, items.length )
    if (!b2e && items.length) setConfirmModalVisible(true);
    if (b2e && items.length) saveOrder();
    // setConfirmModalVisible(true);
  };

  return (
    <Suspense fallback={<Loader />}>
      <Wrapper>
        <ConfirmAddress
          address={
            orderData.shipping &&
            orderData.shipping.id &&
            orderData.shipping.street
              ? orderData.shipping.street.replace(/\|/g, " ")
              : ""
          }
          visible={confirmModalVisible}
          confirm={saveOrder}
          cancel={() => setConfirmModalVisible(false)}
        />
        <div className="main-container">
          {!result.length && (
            <CheckoutWrapper>
              <Title>
                <h2>{t("checkout.title")}</h2>
                <button onClick={() => toggleCartModal()}>
                  {t("checkout.modify_cart")}
                </button>
              </Title>
              <Cols>
                <Col1>
                  <Steps>
                    <Billing updateOrder={updateOrderData} localUserData={localUserData} />
                    <Line />
                    <Shipping
                      updateOrder={updateOrderData}
                      orderData={orderData}
                      billingChange={billingChange}
                      confirmModalVisible={confirmModalVisible}
                      localUserData={localUserData}
                      setOrderIsReady={setOrderIsReady}
                    />
                    <Line />
                    <Payment
                      setOrderIsReady={setOrderIsReady}
                      totalAmount={totalAmount}
                      updateOrder={updateOrderData}
                      userData={localUserData}
                      userDetails={userDetails}
                    />
                  </Steps>
                </Col1>
                <Col2>
                  <Ticket
                    ready={orderIsReady}
                    userDetails={userDetails}
                    userData={localUserData}
                    processing={processing}
                    updateOrder={updateOrderData}
                    order={showConfirmAddress}
                  />
                </Col2>
              </Cols>
            </CheckoutWrapper>
          )}
          {!!result.length && (
            <ThanktWrapper>
              <Thanks orders={result} />
            </ThanktWrapper>
          )}
        </div>
      </Wrapper>
    </Suspense>
  );
};

export default Checkout;
