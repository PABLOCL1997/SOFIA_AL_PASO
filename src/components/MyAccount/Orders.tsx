import React, { FC, Suspense, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ORDERS, ORDER } from '../../graphql/user/queries';
import { BREAKPOINT } from '../../utils/constants';
import { useQuery, useLazyQuery } from 'react-apollo';
import { UserOrder, UserOrderItem } from '../../graphql/user/type';
import { toLocalDate } from '../../utils/date';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const Eye = React.lazy(() => import(/* webpackChunkName: "Eye" */'../Images/Eye'));
const ContinueArrow = React.lazy(() => import(/* webpackChunkName: "ContinueArrow" */'../Images/ContinueArrow'));

const Title = styled.div`
    display: flex;
    align-items: center;
    h1 {
        font-family: MullerMedium;
        font-size: 24px;
        line-height: 24px;
        letter-spacing: 0.01em;
        color: var(--black);
        flex: 1;
    }
`;

const Grid = styled.div`
    margin: 40px 0 20px;
    @media screen and (max-width: ${BREAKPOINT}) {
        max-width: calc(100% - 20px);
        overflow: auto;
    }
`

const Row = styled.div`
    display: grid;
    grid-template-columns: 55px 100px 1fr 120px 140px;
    @media screen and (max-width: ${BREAKPOINT}) {
        grid-template-columns: 55px 100px 120px 120px 140px
    }
`

const Head = styled.div`
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: var(--red);
    margin-bottom: 10px;
`

const Body = styled.div`
    display: grid;
    grid-template-columns: 55px 100px 1fr 120px 140px;
    padding: 20px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.11);
    @media screen and (max-width: ${BREAKPOINT}) {
        grid-template-columns: 55px 100px 120px 120px 140px
    }
    span {
        font-size: 12px;
        line-height: 12px;
        color: var(--black);
        &.recibimos-tu-pedido {
            line-height: 1.5em;
            font-family: MullerBold;
            color: var(--green);
        }
        &.canceled {
            color: var(--m-gray);
        }
    }
    &:last-child {
        border-bottom: 0;
    }
    button {
        background: none;
        border: 0;
        cursor: pointer;
        &:hover {
            opacity: .8;
        }
    }
    svg {
        cursor: pointer;
    }
`

const FormWrapper = styled.div``

const SectionTitle = styled.h2`
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    letter-spacing: 0.01em;
    color: var(--red);
    margin: 32px 0;
`

const Form = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    row-gap: 30px;
    @media screen and (max-width: ${BREAKPOINT}) {
        grid-template-columns: 1fr;
        column-gap: 0;
    }
`

const InputGroup = styled.div<{ key?: string }>`
    display: flex;
    flex-direction: column;
    label {
        font-family: MullerMedium;
        font-size: 10px;
        line-height: 10px;
        letter-spacing: 0.01em;
        text-transform: uppercase;
        color: var(--font);
        padding-left: 20px;
    }
    input {
        background: var(--whiter);
        border-radius: 44px;
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        display: flex;
        align-items: center;
        letter-spacing: 0.01em;
        color: var(--font);
        padding: 12px 20px;
        border: 0;
        margin-top: 10px;
    }
`

const Order = styled.div``

const HeaderLink = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 20px 0;
    cursor: pointer;
    span {
        font-family: MullerMedium;
        font-size: 12px;
        line-height: 12px;
        color: var(--font);
    }
    svg {
        transform: rotate(180deg);
        margin-right: 5px;
        path {
            stroke: var(--font);
        }
    }
    &:hover {
        opacity: .8;
    }
`

const Header = styled.div`
    display: flex;
    align-items: center;

    h2 {
        font-family: MullerMedium;
        font-size: 20px;
        line-height: 20px;
        letter-spacing: 0.01em;
        color: var(--red);
        flex: 1;
    }
    span {
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        color: var(--black);
        margin-left: 30px;
        &.recibimos-tu-pedido {
            line-height: 1.5em;
            font-family: MullerBold;
            color: var(--green);
        }
        &.canceled {
            color: var(--m-gray);
        }
    }
`

const Detail = styled.div`
    position: relative;
    margin: 50px 0;
    background: url(/images/order-detail.png) no-repeat bottom center;
    background-size: 100%;
    padding: 0 86px 125px;
    margin-bottom: -80px;
    z-index: 2;
    min-width: 620px;

    @media screen and (max-width: ${BREAKPOINT}) {
        background: none;
        margin: 20px 0;
        padding: 0;
        min-width: auto;
    }

    h2 {
        font-family: MullerMedium;
        font-size: 20px;
        line-height: 20px;
        letter-spacing: 0.01em;
        color: var(--red);
        text-align: center;
        margin-bottom: 30px;
        @media screen and (max-width: ${BREAKPOINT}) {
            text-align: left;
        }
    }

    > div {
        position: relative;
        padding: 25px 40px;
        background: linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%);
        @media screen and (max-width: ${BREAKPOINT}) {
            padding: 25px 0;
            background: none;
        }
    }
`

const Background = styled.div`
    position: absolute;
    background: var(--red);
    height: 180px;
    width: 100%;
    margin-left: -40px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    bottom: 0;
    z-index: 1;

    @media screen and (max-width: ${BREAKPOINT}) {
        position: static;
        height: 100px;
        width: calc(100% + 80px);
    }
`

const Item = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    span {
        font-size: 14px;
        line-height: 1.5em;
        color: var(--font);
        text-transform: capitalize;
        &:first-child {
            flex: 1;
        }
        &:last-child {
            width: 120px;
            text-align: right;
        }
    }
`

const Subtotal = styled.div`
    display: flex;
    align-items: center;
    margin: 30px 0;
    b {
        font-family: MullerBold;
        font-size: 14px;
        line-height: 14px;
        color: var(--black);
        &:first-child {
            flex: 1;
        }
        &:last-child {
            width: 120px;
            text-align: right;
        }
    }
`

const Envio = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 2px solid rgba(0, 0, 0, 0.11);
    padding-bottom: 20px;
    span {
        font-size: 14px;
        line-height: 14px;
        color: var(--black);
        &:first-child {
            flex: 1;
        }
        &:last-child {
            width: 120px;
            text-align: right;
            color: var(--green);
        }
    }
    `

const Total = styled.div`
    display: flex;
    align-items: center;
    margin-top: 25px;
    b {
        font-family: MullerBold;
        font-size: 20px;
        line-height: 20px;
        color: var(--black);
        &:first-child {
            flex: 1;
        }
        &:last-child {
            width: 120px;
            text-align: right;
        }
    }
`

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 150px;
    img {
        width: 40px;
    }
`

const NoResults = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--font);
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 1.5em;
    letter-spacing: 0.1em;
    max-width: 320px;
    text-align: center;
    margin: 40px auto 0;
`

const LoaderWrapperBig = styled.div`
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
        width: 50px;
    }
`

type Props = {}

const Orders: FC<Props> = () => {
    const { t } = useTranslation();
    const [orderId, setOrderId] = useState(0);
    const [order, setOrder] = useState<UserOrder | any>({});

    const { data: orders, loading } = useQuery(ORDERS, {
        fetchPolicy: 'cache-and-network'
    });
    const [getOrder, { loading: orderLoading }] = useLazyQuery(ORDER, {
        variables: { orderId },
        fetchPolicy: 'network-only',
        onCompleted: (d) => {
            setOrder(d.order);
        }
    });

    useEffect(() => {
        if (orderId) getOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    return <Suspense fallback={<Loader />}>
        <>
            <Title>
                <h1>{t('account.orders.title')}</h1>
            </Title>
            {orderId === 0 && <Grid>
                <Row>
                    <Head>{t('account.orders.see')}</Head>
                    <Head>{t('account.orders.date')}</Head>
                    <Head>{t('account.orders.number')}</Head>
                    <Head>{t('account.orders.value')}</Head>
                    <Head>{t('account.orders.status')}</Head>
                </Row>
                {loading && <LoaderWrapper><img src="/images/loader.svg" alt="loader" /></LoaderWrapper>}
                {!loading && orders && !!orders.orders.length && orders.orders.map((order: UserOrder) => <Body key={order.id}>
                    <span><button onClick={() => setOrderId(order.id)}><Eye /></button></span>
                    <span>{toLocalDate(order.createdAt)}</span>
                    <span>{order.incrementId}</span>
                    <span>Bs. {order.total.toFixed(2).replace('.', ',')}</span>
                    <span className={order.status.toLowerCase().replace(/ /g, '-')}>{order.status}</span>
                </Body>)}
                {!loading && orders && !orders.orders.length && <NoResults>{t('account.orders.no_results')}</NoResults>}
            </Grid>}
            {orderId > 0 && orderLoading && <LoaderWrapperBig><img src="/images/loader.svg" alt="loader" /></LoaderWrapperBig>}
            {orderId > 0 && order && !orderLoading && <Order>
                <HeaderLink onClick={() => setOrderId(0)}>
                    <ContinueArrow />
                    <span>{t('account.order.back')}</span>
                </HeaderLink>
                <Header>
                    <h2>{t('account.order.title', { increment_id: order.incrementId })}</h2>
                    <span className={order.status && order.status.toLowerCase().replace(/ /g, '-')}>{order.status}</span>
                </Header>
                <FormWrapper>
                    <SectionTitle>{t('account.order.billing.title')}</SectionTitle>
                    <Form>
                        {['billingFirstname', 'billingLastname', 'billingEmail', 'billingNit'].map((key: string) => <InputGroup key={key}>
                            <label>{t('account.order.billing.' + key)}</label>
                            <input value={(order as any)[key] || ''} readOnly={true} type={'text'} placeholder={t('account.order.billing.' + key)} />
                        </InputGroup>)}
                    </Form>
                </FormWrapper>
                <FormWrapper>
                    <SectionTitle>{t('account.order.shipping.title')}</SectionTitle>
                    <Form>
                        {['shippingFirstname', 'shippingLastname', 'shippingPhone', 'shippingNit', 'shippingStreet', 'shippingCity', 'shippingReference'].map((key: string) => <InputGroup key={key}>
                            <label>{t('account.order.shipping.' + key)}</label>
                            <input value={(order as any)[key] || ''} readOnly={true} type={'text'} placeholder={t('account.order.shipping.' + key)} />
                        </InputGroup>)}
                    </Form>
                </FormWrapper>
                <Detail>
                    <div>
                        <h2>{t('account.order.detail')}</h2>
                        {order.items && order.items.map((item: UserOrderItem) => <Item key={item.itemId}>
                            <span>{String(item.name).toLowerCase()}</span>
                            <span>Bs. {item.price.toFixed(2).replace('.', ',')}</span>
                        </Item>)}
                        <Subtotal>
                            <b>{t('account.order.subtotal')}</b>
                            <b>Bs. {order.subtotal && order.subtotal.toFixed(2).replace('.', ',')}</b>
                        </Subtotal>
                        <Envio>
                            <span>{t('account.order.shippingPrice')}</span>
                            <span>Bs. {order.shippingPrice ? Number(order.shippingPrice).toFixed(2).replace('.', ',') : '0,00'}</span>
                        </Envio>
                        <Total>
                            <b>{t('account.order.total')}</b>
                            <b>Bs. {order.total && order.total.toFixed(2).replace('.', ',')}</b>
                        </Total>
                    </div>
                </Detail>
                <Background />
            </Order>}
        </>
    </Suspense>
}

export default Orders;