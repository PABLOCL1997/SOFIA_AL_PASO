import React, { Suspense, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { CHECKOUT_TITLE } from '../meta';
import { useTranslation } from 'react-i18next';
import { SET_USER } from '../graphql/user/mutations';
import { BREAKPOINT } from '../utils/constants';
import { CREATE_ORDER, EMPTY_CART, PAY } from '../graphql/cart/mutations';
import { GET_CART_ITEMS, TODOTIX } from '../graphql/cart/queries';
import { ProductType } from '../graphql/products/type';
import { useHistory, useLocation } from 'react-router-dom';
import { DETAILS, GET_USER } from '../graphql/user/queries';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../components/Loader'));
const Billing = React.lazy(() => import(/* webpackChunkName: "Billing" */'../components/Checkout/Billing'));
const Shipping = React.lazy(() => import(/* webpackChunkName: "Shipping" */'../components/Checkout/Shipping'));
const Payment = React.lazy(() => import(/* webpackChunkName: "Payment" */'../components/Checkout/Payment'));
const Ticket = React.lazy(() => import(/* webpackChunkName: "Ticket" */'../components/Checkout/Ticket'));
const Thanks = React.lazy(() => import(/* webpackChunkName: "Thanks" */'../components/Checkout/Thanks'));

const Wrapper = styled.div`
    padding: 60px 100px;
    background: var(--bkg);
    @media screen and (max-width: ${BREAKPOINT}) {
        padding: 20px;
    }
`

const CheckoutWrapper = styled.div``

const ThanktWrapper = styled.div``

const Cols = styled.div`
    display: flex;
    @media screen and (max-width: ${BREAKPOINT}) {
        flex-direction: column;
    }
`

const Col1 = styled.div`
    flex: 1;
`

const Col2 = styled.div`
    width: 364px;
    margin-left: 16px;
    @media screen and (max-width: ${BREAKPOINT}) {
        width: 100%;
        margin-left: 0;
        margin-top: 40px;
    }
`

const Title = styled.div`
    display: flex;
    padding-right: 380px;
    align-items: center;
    margin-bottom: 25px;
    @media screen and (max-width: ${BREAKPOINT}) {
        padding-right: 0;
    }
    h1 {
        flex: 1;
        font-family: MullerMedium;
        font-size: 32px;
        line-height: 32px;
        color: var(--black);
    }
    button {
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        text-align: right;
        text-decoration-line: underline;
        color: var(--red);
        background: none;
        border: 0;
        &:hover {
            opacity: .8;
        }
    }
`

const Steps = styled.div`
    background: white;
    border-radius: 20px;
    padding: 40px;
    @media screen and (max-width: ${BREAKPOINT}) {
        padding: 40px 20px;
    }
`

const Line = styled.div`
    border-top: 1px solid rgba(0, 0, 0, 0.11);
    margin: 48px 0;
`

type Props = {}

type OrderData = {
    discount_amount: number,
    discount_type: string,
    coupon_code: string,
    items: Array<string>,
    delivery_price: number,
    customer_email: string,
    customer_firstname: string,
    customer_lastname: string,
    facturacion: string,
    envio: string,
    payment_method: string
};

const Checkout: FC<Props> = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const [processing, setProcessing] = useState(false);
    const [userData, setUserData] = useState({});
    const [order, setOrder] = useState<OrderData>();
    const [orderData, setOrderData] = useState<any>({});
    const [result, setResult] = useState<Array<{ entity_id: string, increment_id: string }>>([]);

    const { data: localUserData } = useQuery(GET_USER, {});
    const { data } = useQuery(GET_CART_ITEMS);
    const [getDetails] = useLazyQuery(DETAILS, {
        fetchPolicy: 'network-only',
        onCompleted: (d) => {
            setUserData(d.details);
        }
    });
    const [getTodotixLink, { data: todotixData }] = useLazyQuery(TODOTIX);
    const [toggleCartModal] = useMutation(SET_USER, { variables: { user: { openCartModal: true } } });
    const [createOrder] = useMutation(CREATE_ORDER, {
        variables: {
            ...order
        }
    })
    const [pay] = useMutation(PAY);
    const [emptyCart] = useMutation(EMPTY_CART, { variables: {} });
    const [showError] = useMutation(SET_USER, { variables: { user: { showError: t('checkout.error') } } });

    useEffect(() => {
        document.title = CHECKOUT_TITLE;
        if (data && !data.cartItems.length) history.push('/');

        let params = new URLSearchParams(location.search);
        if (params.get('orderIds') && params.get('transaction_id')) {
            (async () => {
                try {
                    const response = await pay({
                        variables: {
                            parent_ids: params.get('orderIds'),
                            last_trans_id: params.get('transaction_id')
                        }
                    });
                    setResult(response.data.addPayment.map((co: any) => ({ entity_id: co.entity_id, increment_id: co.increment_id })));
                    emptyCart();
                    window.history.pushState('checkout', 'Tienda Sofia - Checkout', '/checkout');
                } catch (e) {
                    showError();
                }
            })();
        }

        getDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (order) {
            (async () => {
                try {
                    setProcessing(true);
                    const response = await createOrder();
                    if (orderData.payment && orderData.payment.method === 'todotix') {
                        getTodotixLink({ variables: { orderIds: response.data.createOrder.map((co: any) => co.entity_id) } });
                    } else {
                        setResult(response.data.createOrder.map((co: any) => ({ entity_id: co.entity_id, increment_id: co.increment_id })));
                        emptyCart();
                    }
                } catch (e) {
                    showError();
                }
                setProcessing(false);
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

    useEffect(() => {
        if (todotixData && todotixData.todotix) {
            if (todotixData.todotix.url_pasarela_pagos)
                window.location = todotixData.todotix.url_pasarela_pagos
            else
                showError({ variables: { user: { showError: t('checkout.todotix_error') } } });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todotixData])

    const saveOrder = () => {
        let items: Array<string> = [];
        data && data.cartItems && data.cartItems.forEach((product: ProductType) => {
            items.push(JSON.stringify({
                entity_id: product.entity_id,
                sku: product.sku,
                name: product.name,
                price: product.price,
                quantity: product.qty,
                type_id: 'simple',
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
            }));
        })
        setOrder({
            discount_amount: parseFloat(orderData.coupon.discount),
            discount_type: orderData.coupon.type,
            coupon_code: orderData.coupon.coupon,
            items: items,
            delivery_price: 0,
            customer_email: orderData.billing.email,
            customer_firstname: orderData.billing.firstname,
            customer_lastname: orderData.billing.lastname,
            facturacion: JSON.stringify({
                addressId: userData && (userData as any).addressId ? (userData as any).addressId : 0,
                firstname: orderData.billing.firstname,
                lastname: orderData.billing.lastname,
                fax: orderData.billing.nit,
                email: orderData.billing.email,
                telephone: orderData.billing.phone,
                country_id: 'BO',
                city: localUserData && localUserData.userInfo && localUserData.userInfo.length ? localUserData.userInfo[0].cityName : '-',
                latitude: '-',
                longitude: '-',
                street: '-',
                reference: '-',
            }),
            envio: JSON.stringify({
                entity_id: orderData.shipping.id,
                firstname: orderData.shipping.firstname,
                lastname: orderData.shipping.lastname,
                fax: orderData.shipping.nit,
                email: orderData.billing.email,
                telephone: orderData.shipping.phone,
                street: `${orderData.shipping.address} ${orderData.shipping.number} ${orderData.shipping.home_type} ${orderData.shipping.apt_number} ${orderData.shipping.building_name}`,
                city: orderData.shipping.city,
                region: orderData.shipping.reference,
                country_id: 'BO',
                latitude: orderData.shipping.latitude,
                longitude: orderData.shipping.longitude
            }),
            payment_method: orderData.payment ? orderData.payment.method : 'cashondelivery'
        });
    }

    const updateOrderData = (key: string, values: any) => {
        setOrderData({
            ...orderData,
            [key]: values
        })
    }

    return (
        <Suspense fallback={<Loader />}>
            <Wrapper>
                <div className="main-container">
                    {!result.length && <CheckoutWrapper>
                        <Title>
                            <h1>{t('checkout.title')}</h1>
                            <button onClick={() => toggleCartModal()}>{t('checkout.modify_cart')}</button>
                        </Title>
                        <Cols>
                            <Col1>
                                <Steps>
                                    <Billing updateOrder={updateOrderData} />
                                    <Line />
                                    <Shipping updateOrder={updateOrderData} />
                                    <Line />
                                    <Payment updateOrder={updateOrderData} />
                                </Steps>
                            </Col1>
                            <Col2>
                                <Ticket processing={processing} updateOrder={updateOrderData} order={saveOrder} />
                            </Col2>
                        </Cols>
                    </CheckoutWrapper>}
                    {!!result.length && <ThanktWrapper>
                        <Thanks orders={result} />
                    </ThanktWrapper>}
                </div>
            </Wrapper>
        </Suspense>
    );
}

export default Checkout;
