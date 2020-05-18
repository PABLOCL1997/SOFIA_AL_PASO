import React, { Suspense, FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMutation } from "@apollo/react-hooks";
import { CHECKOUT_TITLE } from '../meta';
import { useTranslation } from 'react-i18next';
import { SET_USER } from '../graphql/user/mutations';
import { BREAKPOINT } from '../utils/constants';

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

const Checkout: FC<Props> = () => {
    const { t } = useTranslation();
    const [toggleCartModal] = useMutation(SET_USER, { variables: { user: { openCartModal: true } } });
    const [orderData, setOrderData] = useState({ increment_id: '' });

    useEffect(() => {
        document.title = CHECKOUT_TITLE;
    }, [])

    const order = () => {
        console.log(orderData);
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
                {!orderData.increment_id && <CheckoutWrapper>
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
                            <Ticket updateOrder={updateOrderData} order={order} />
                        </Col2>
                    </Cols>
                </CheckoutWrapper>}
                {!!orderData.increment_id && <ThanktWrapper>
                    <Thanks incrementId={orderData.increment_id} />
                </ThanktWrapper>}
            </Wrapper>
        </Suspense>
    );
}

export default Checkout;
