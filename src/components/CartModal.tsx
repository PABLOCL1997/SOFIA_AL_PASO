import React, { FC, Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-apollo';
import { SET_USER } from '../graphql/user/mutations';
import { GET_USER } from '../graphql/user/queries';
import { GET_CART_ITEMS, GET_TOTAL, GET_QTY } from '../graphql/cart/queries';
import { useHistory } from 'react-router-dom';
import { ProductType } from '../graphql/products/type';
import { ADD_ITEM, DELETE_ITEM, EMPTY_CART } from '../graphql/cart/mutations';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'./Loader'));
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */'./Cta'));
const Close = React.lazy(() => import(/* webpackChunkName: "Close" */'./Images/Close'));
const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */'./Images/Chevron'));
const Delete = React.lazy(() => import(/* webpackChunkName: "Delete" */'./Images/Delete'));

const ModalCourtain = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0,.3);
    z-index: 4;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &.visible {
        display: flex;
    }
`

const Modal = styled.div`
    position: relative;
    padding: 42px;
    background: white;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 380px;
    max-width: 100%;
`

const CloseWrapper = styled.div`
    cursor: pointer;
    svg {
        margin-top: 4px;
        margin-left: 30px;
        path {
            stroke: var(--red);
        }
    }
    &:hover {
        opacity: .8;
    }
`

const Qty = styled.div`
    position:relative;
    display: flex;
    align-items: center;
    border: 1px solid var(--yellow);
    padding: 10px 0;
    border-radius: 30px;
    margin-right: 20px;
    select {
        cursor: pointer;
        -webkit-appearance: none;
        background: none;
        border: 0;
        width: 65px;
        padding-left: 25px;
        font-size: 12px;
        line-height: 12px;
    }
    svg {
        pointer-events: none;
        position: absolute;
        right: 10px;
    }
`

const Header = styled.div`
    display: flex;
    align-items: center;
    width: calc(100% + 84px);
    padding: 30px;
    margin-top: -42px;
    box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.1);
`

const Title = styled.h2`
    font-family: MullerMedium;
    font-size: 24px;
    line-height: 24px;
    color: var(--black);
    flex: 1;
`

const Count = styled.span`
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    span {
        font-family: MullerMedium;
    }
    b {
        color: var(--red);
        margin-right: 8px;
    }
`

const UnderBudget = styled.div`
    background: var(--red);
    width: calc(100% + 84px);
    padding: 20px;
    color: white;
    text-align: center;
    font-family: MullerBold;
    text-transform: uppercase;
    font-size: 12px;
`

const Items = styled.div`
    max-height: calc(100vh - 300px);
    overflow: auto;
`

const Row = styled.div`
    display: grid;
    grid-template-columns: auto 300px auto auto auto auto;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #ccc;
    width: 100%;
`

const Image = styled.img`
    width: 100px;
    margin-right: 20px;
`

const NameBox = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 20px;
    flex: 1;
`

const Name = styled.h3`
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    color: var(--black);
    margin-bottom: 5px;
`

const Units = styled.span`
    font-family: MullerMedium;
    font-size: 12px;
    line-height: 12px;
    color: var(--font);
    margin-right: 20px;
`

const UnitPrice = styled.span`
    font-family: MullerMedium;
    font-size: 12px;
    line-height: 12px;
    color: var(--font);
    margin-right: 5px;
`

const Price = styled.span`
    margin-right: 20px;
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
`

const DeleteWrapper = styled.div`
    cursor: pointer;
    &:hover {
        opacity: .8;
    }
`

const Totals = styled.div`
    padding: 30px 15px;
    display: flex;
    width: 100%;
`

const Subtotal = styled.span`
    flex: 1;
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
`

const Total = styled.span`
    font-family: MullerMedium;
    font-size: 18px;
    line-height: 18px;
    color: var(--red);
`

const Footer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0 15px;
`
const Disclaimer = styled.p`
    max-width: 290px;
    font-size: 11px;
    line-height: 18px;
    padding-right: 30px;
`

const Toolbox = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-end;
`

const Empty = styled.button`
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 20px;
    color: var(--black);
    background: none;
    border: 0;
    margin-right: 20px;
    &:hover {
        opacity: .8;
    }
`

const CtaWrapper = styled.div`
    button {
        padding: 10px 50px;
        text-transform: uppercase;
        span {
            font-size: 14px;
        }
    }
`

type Action = {
    qty?: number,
    product?: ProductType,
    action?: string
}

type Props = {}

const AuthModal: FC<Props> = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { data } = useQuery(GET_CART_ITEMS);
    const [action, setAction] = useState<Action>({});
    const { data: userData } = useQuery(GET_USER, {});
    const [closeCartModal] = useMutation(SET_USER, { variables: { user: { openCartModal: false } } });
    const [addItem] = useMutation(ADD_ITEM, { variables: { product: { ...action.product, qty: action.qty } } });
    const [deleteItem] = useMutation(DELETE_ITEM, { variables: { product: { ...action.product } } });
    const [emptyCart] = useMutation(EMPTY_CART, { variables: {} });

    const updateItem = (_qty: number, _product: ProductType) => {
        setAction({
            qty: _qty,
            product: _product,
            action: 'add'
        });
    }

    const removeRow = (_product: ProductType) => {
        setAction({
            product: _product,
            action: 'delete'
        });
    }

    const empty = () => {
        setAction({
            action: 'empty'
        });
    }

    const doAction = async (action: Action) => {
        console.log(action);
        if (action.action === 'add') {
            await addItem();
            setAction({});
        }
        else if (action.action === 'delete') {
            await deleteItem();
            setAction({});
            if (data && !data.cartItems.length) closeCartModal();
        }
        else if (action.action === 'empty') {
            await emptyCart();
            setAction({});
            closeCartModal();
        }
    }

    const checkout = () => {
        closeCartModal();
        history.push('/checkout');
    }

    useEffect(() => {
        doAction(action);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action])

    useEffect(() => {
        closeCartModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalAmount = GET_TOTAL(data.cartItems);

    return <Suspense fallback={<Loader />}>
        <ModalCourtain className={(!userData.userInfo.length || userData.userInfo[0].openCartModal) && 'visible'}>
            <Modal>
                <Header>
                    <Title>{t('cart.title')}</Title>
                    <Count>
                        <b>{GET_QTY(data.cartItems)}</b>
                        <span>{t('cart.items')}</span>
                    </Count>
                    <CloseWrapper onClick={() => closeCartModal()}><Close /></CloseWrapper>
                </Header>
                {totalAmount < 200 && <UnderBudget>{t('cart.under_budget')}</UnderBudget>}
                <Items>
                    {data && data.cartItems && data.cartItems.map((product: ProductType) => <Row key={product.entity_id}>
                        <Image src={product.image}></Image>
                        <NameBox>
                            <Name>{product.name}</Name>
                            <Units>{product.size} {product.unit}</Units>
                        </NameBox>
                        <Qty>
                            <select onChange={event => updateItem(Number(event.target.value), product)}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((opt: any, index: number) => <option key={index} value={opt}>{opt}</option>)}
                            </select>
                            <Chevron />
                        </Qty>
                        <UnitPrice>Bs. {product.special_price.toFixed(2).replace('.', ',')} c/u -</UnitPrice>
                        <Price>Bs. {(product.special_price * (product.qty ? product.qty : 0)).toFixed(2).replace('.', ',')}</Price>
                        <DeleteWrapper onClick={() => removeRow(product)}>
                            <Delete />
                        </DeleteWrapper>
                    </Row>)}
                </Items>
                <Totals>
                    <Subtotal>{t('cart.subtotal')}</Subtotal>
                    <Total>Bs. {totalAmount}</Total>
                </Totals>
                <Footer>
                    <Disclaimer>{t('cart.disclaimer')}</Disclaimer>
                    <Toolbox>
                        <Empty onClick={() => empty()}>{t('cart.empty')}</Empty>
                        <CtaWrapper>
                            <Cta filled={true} text={t('cart.pay')} action={checkout} />
                        </CtaWrapper>
                    </Toolbox>
                </Footer>
            </Modal>
        </ModalCourtain>
    </Suspense>
}

export default AuthModal;