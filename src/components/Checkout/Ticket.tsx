import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { CHECK_COUPON } from "../../graphql/cart/mutations";
import { GET_CART_ITEMS, GET_TOTAL, COMPARE_PRICES } from "../../graphql/cart/queries";
import { useQuery, useMutation, useLazyQuery } from "react-apollo";
import { ProductType } from "../../graphql/products/type";
import { SET_USER } from "../../graphql/user/mutations";
import { GET_USER } from "../../graphql/user/queries";
import useMinimumPrice from "../../hooks/useMinimumPrice";
import useCityPriceList from "../../hooks/useCityPriceList";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Loader"));
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));
const DiscountCall = React.lazy(() => import(/* webpackChunkName: "DiscountCall" */ "../Discount"));

const Container = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0px 12px 106px rgba(0, 0, 0, 0.12);
  position: sticky;
  top: 140px;
`;

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  color: var(--red);
  margin-bottom: 24px;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  span {
    font-size: 14px;
    line-height: 14px;
    color: var(--font);
    &:first-child {
      flex: 1;
      padding-right: 15px;
      line-height: 18px;
    }
  }
`;

const Subtotal = styled.div`
  display: flex;
  margin-bottom: 20px;
  b {
    font-family: MullerBold;
    font-size: 14px;
    line-height: 14px;
    color: var(--black);
    &:first-child {
      flex: 1;
      padding-right: 15px;
    }
  }
`;

const Shipping = styled.div`
  display: flex;
  margin-bottom: 20px;
  span {
    font-size: 14px;
    line-height: 14px;
    color: var(--font);
    flex: 1;
    padding-right: 15px;
  }
  b {
    font-size: 14px;
    line-height: 14px;
    color: var(--green);
  }
`;

const Coupon = styled.div`
  &:after {
    content: "";
    display: block;
    clear: both;
  }
  > button {
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    text-align: right;
    text-decoration-line: underline;
    color: var(--red);
    background: none;
    border: 0;
    float: right;
    &:hover {
      opacity: 0.8;
    }
  }
`;

const InputBox = styled.div`
  position: relative;
  input {
    font-family: MullerRegular;
    background: var(--whiter);
    border-radius: 44px;
    border: 0;
    padding: 12px 20px;
    letter-spacing: 0.01em;
    color: var(--font);
    font-size: 14px;
    line-height: 14px;
    width: calc(100% - 40px);
  }
  button {
    background: var(--whiter);
    border: 1px solid var(--m-gray);
    box-sizing: border-box;
    font-family: MullerBold;
    font-size: 12px;
    line-height: 12px;
    text-transform: uppercase;
    color: var(--font);
    padding: 12px 20px;
    border-radius: 20px;
    position: absolute;
    right: 0;
    transition: all 0.2s linear;
    &:hover {
      background: var(--m-gray);
    }
    &.add {
      background: var(--yellow);
      border: 1px solid var(--yellow);
      color: var(--black);
      &:hover {
        background: transparent;
      }
    }
  }
`;

const Discount = styled.div`
  display: flex;
  margin-top: 20px;
  span {
    font-size: 14px;
    line-height: 14px;
    color: var(--green);
    &:first-child {
      flex: 1;
      padding-right: 15px;
    }
  }
`;

const Line = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.11);
  margin: 20px 0;
`;

const Total = styled.div`
  display: flex;
  margin-bottom: 30px;
  b {
    font-family: MullerMedium;
    font-size: 20px;
    line-height: 20px;
    color: var(--black);
    &:first-child {
      flex: 1;
      padding-right: 15px;
    }
  }
`;

const CtaWrapper = styled.div`
  button {
    width: 100%;
    padding: 10px;
  }
`;

const LoaderWrapper = styled.div`
  img {
    margin: 30px auto 0;
    display: block;
    width: 20px;
  }
`;

const EmployeeMsg = styled.span`
  display: block;
  margin-top: -20px;
  margin-bottom: 30px;
  text-align: right;
  font-size: 12px;
  line-height: 18px;
  color: var(--red);
`;

const ErrorText = styled.div<{ margin: boolean }>`
  font-family: MullerMedium;
  font-size: 14px;
  line-height: 14px;
  text-decoration-line: none;
  color: var(--red);
  border: 0;
  background: none;
  margin: 20px 0 ${(props) => (props.margin ? "40px" : "0")};
  &:hover {
    opacity: 0.8;
  }
`;

type Props = {
  order: Function;
  updateOrder: Function;
  processing: boolean;
  userData: any;
  userDetails: any;
  ready: boolean;
};

const Ticket: FC<Props> = ({ order, updateOrder, processing, userData, userDetails, ready }) => {
  const { t } = useTranslation();
  const minimumPrice = useMinimumPrice();
  const { agency } = useCityPriceList();
  const [type, setType] = useState("");
  const [discount, setDiscount] = useState("0");
  const [discountAmount, setDiscountAmount] = useState<any>(0);
  const [showCoupon, setShowCoupon] = useState(false);
  const [shippingPrice, setShippingPrice] = useState<number>(0);

  const [bsDiscount, setBsDiscount] = useState(0);
  let arr: any[] = [];
  const [coupon, setCoupon] = useState("");
  const [getCartItems] = useLazyQuery(GET_CART_ITEMS, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      const prodQty = d.cartItems.map(({ name, qty }: ProductType) => {
        return { name, qty };
      });
      if (localUserData.userInfo[0].idPriceList && localUserData.userInfo[0].idPriceList > 0) {
        getDiscounts({
          variables: {
            city: localUserData?.userInfo[0]?.cityKey || "SC",
            id_price_list: String(localUserData?.userInfo[0]?.idPriceList) || "0",
            prodQty,
          },
        });
      }
    },
  });
  const { data } = useQuery(GET_CART_ITEMS, {});
  const { data: localUserData } = useQuery(GET_USER, {});
  const [getDiscounts, { data: dataDiscounts }] = useLazyQuery(COMPARE_PRICES, {
    fetchPolicy: "network-only",
    onCompleted: (d) => console.log("get disc", d),
  });
  const [checkCoupon] = useMutation(CHECK_COUPON, {
    variables: { name: coupon },
  });
  const totalAmount = GET_TOTAL(data.cartItems);
  const [showError] = useMutation(SET_USER, {
    variables: { user: { showError: t("checkout.ticket.coupon.error") } },
  });

  const addCoupon = async () => {
    try {
      const response: any = await checkCoupon();
      setType(response.data.coupon.type);
      if (response.data.coupon.type === "%") {
        setDiscount(parseFloat(String(Number(response.data.coupon.discount_amount))).toFixed(2));
        setDiscountAmount(parseFloat(String(Number((totalAmount.replace(",", ".") * response.data.coupon.discount_amount) / 100))).toFixed(2));
      } else {
        setDiscount(String(response.data.coupon.discount_amount));
        setDiscountAmount(String(response.data.coupon.discount_amount));
      }
      setCoupon(response.data.coupon.code);
    } catch (e) {
      showError();
    }
  };

  const removeCoupon = () => {
    setDiscount("0");
    setCoupon("");
  };
  useEffect(() => {
    updateOrder("coupon", {
      coupon,
      discount,
      type,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discount]);

  useEffect(() => {
    getCartItems();
  }, [localUserData]);

  useEffect(() => {
    const shippingCost = 15; // Bs. 15
    const noShippingCost = 0; // Bs. 0
    if ((totalAmount.replace(",", ".")) < minimumPrice && !agency) {
      setShippingPrice(shippingCost); 
    } else {
      setShippingPrice(noShippingCost);
    }
  }, [minimumPrice, totalAmount, agency])

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        <Title>{t("checkout.ticket.title")}</Title>
        <Rows>
          {data &&
            data.cartItems &&
            data.cartItems.map((product: ProductType, index: number) => (
              <Row key={product.entity_id}>
                <span>
                  {product.qty} x {product.useKGS ? `${product.name} DE ${Number(product.weight).toFixed(2).replace(".", ",")} KGS APROX.` : product.name}
                </span>
                <span>
                  Bs.{" "}
                  {Number((product?.qty ?? 0) * product.special_price)
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              </Row>
            ))}
        </Rows>
        <Subtotal>
          <b>{t("checkout.ticket.subtotal")}</b>
          <b>Bs. {totalAmount}</b>
        </Subtotal>
        {/* Show shipping price only on b2e, b2c */}
        {!agency && (
          <Shipping>
            <span>{t("checkout.ticket.delivery")}</span>
            {shippingPrice ? 
            <b>Bs. {String(shippingPrice.toFixed(2)).replace('.',',')}</b>
            :
            <b>GRATIS</b>
          }
          </Shipping>
        )}
        {/* only on b2c */}
        {localUserData && !localUserData?.userInfo[0]?.agency && !localUserData?.userInfo[0]?.idPriceList ? (
          <Coupon>
            {!showCoupon && <button onClick={() => setShowCoupon(true)}>{t("checkout.ticket.coupon.ask")}</button>}
            {showCoupon && (
              <InputBox>
                <input value={coupon} onChange={(evt) => setCoupon(evt.target.value)} type="text" placeholder={t("checkout.ticket.coupon.placeholder")} />
                {Number(discount) === 0 && (
                  <button onClick={addCoupon} className="add">
                    {t("checkout.ticket.coupon.add")}
                  </button>
                )}
                {Number(discount) > 0 && <button onClick={removeCoupon}>{t("checkout.ticket.coupon.delete")}</button>}
              </InputBox>
            )}
          </Coupon>
        ) : null}
        {Number(discountAmount) > 0 && (
          <Discount>
            <span>{t("checkout.ticket.discount")}</span>
            <span>- Bs. {discountAmount.replace(".", ",")}</span>
          </Discount>
        )}
        <Line />
        <Total>
          <b>{t("checkout.ticket.total")}</b>
          <b>
            Bs.{" "}
            {String(
              Number(shippingPrice + Number(totalAmount.replace(",", ".")) - parseFloat(discountAmount)).toFixed(2)
            ).replace(".", ",")}
          </b>
        </Total>
        {dataDiscounts &&
          !localUserData?.userInfo[0]?.agency &&
          !!(localUserData && localUserData?.userInfo[0]?.idPriceList && localUserData?.userInfo[0]?.idPriceList > 0) &&
          userDetails.details.employee && (
            <EmployeeMsg>
              ¡Te has ahorrado Bs.{" "}
              {Number(dataDiscounts?.comparePrices || 0)
                .toFixed(2)
                .replace(".", ",")}{" "}
              por ser colaborador!
            </EmployeeMsg>
          )}

        <CtaWrapper>
          {!processing && (
            <Cta
              active={ready && Number(totalAmount.replace(",", ".")) > 0}
              filled={true}
              text={t("checkout.ticket.send")}
              action={order}
            />
          )}
          {processing && (
            <LoaderWrapper>
              <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
            </LoaderWrapper>
          )}
        </CtaWrapper>
        {shippingPrice > 0 ? 
          <ErrorText margin={false}>A partir de Bs. {minimumPrice} el envio es gratis.</ErrorText>
        : null}
      </Container>
    </Suspense>
  );
};

export default Ticket;
