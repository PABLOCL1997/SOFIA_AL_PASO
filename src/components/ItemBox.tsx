import React, { FC, Suspense, useState } from 'react';
import styled from 'styled-components';
import { ProductType } from '../graphql/products/type';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { toLink } from '../utils/string';
import { ADD_ITEM } from '../graphql/cart/mutations';
import { BREAKPOINT } from '../utils/constants';
import { GET_USER } from '../graphql/user/queries';
import { SET_USER } from '../graphql/user/mutations';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'./Loader'));
const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */'./Images/Chevron'));

const Container = styled.div`
    position: relative;
    background: #FFFFFF;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    margin: 40px 10px;
    padding: 30px;
`

const Discount = styled.div`
    position: absolute;
    top: -10px;
    right: 20px;
    background: var(--yellow);
    box-shadow: 0px 8px 29px rgba(254, 205, 0, 0.4);
    border-radius: 3px;
    font-family: MullerBold;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    text-align: center;
    color: var(--black);
    padding: 8px 10px;
`

const Link = styled.div`
    cursor: pointer;
`

const Category = styled.h3`
    font-size: 14px;
    line-height: 14px;
    text-align: center;
    letter-spacing: 0.05em;
    color: var(--red);
    text-transform: uppercase;
`

const Image = styled.img`
    max-width: 100%;
    height: 200px;
    margin: 0 auto;
    display: block;
`

const Title = styled.h2`
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 110%;
    text-align: center;
    color: var(--black);
    height: 35px;
    @media screen and (max-width: ${BREAKPOINT}) {
        height: auto;    
    }
`

const PriceBox = styled.div`
    text-align: center;
    margin: 12px 0 24px;
`

const Size = styled.span`
    font-family: MullerBold;
    font-size: 14px;
    line-height: 14px;
    color: var(--font);
`

const Price = styled.span`
font-family: MullerBold;
font-size: 14px;
line-height: 14px;
color: var(--black);
`

const DiscountPrice = styled.span`
    color: var(--red);
    font-size: 14px;
    margin-left: 5px;
    text-decoration: line-through;
`

const Pill = styled.div`
    border: 1px solid var(--yellow);
    border-radius: 30px;
    display: flex;
    width: fit-content;
    margin: 0 auto;
`

const Qty = styled.div`
    position:relative;
    display: flex;
    align-items: center;
    select {
        cursor: pointer;
        -webkit-appearance: none;
        background: none;
        border: 0;
        width: 65px;
        padding-left: 30px;
        font-size: 12px;
        line-height: 12px;
    }
    svg {
        pointer-events: none;
        position: absolute;
        right: 0;
    }
`

const Add = styled.button`
    font-family: MullerBold;
    border: 0;
    background: var(--yellow);
    color: var(--black);
    padding: 11px 20px;
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
    margin-left: 10px;
    font-size: 10px;
    line-height: 10px;
    text-transform: uppercase;
`

type Props = {
    product: ProductType,
    openModal: Function
}

const ItemBox: FC<Props> = ({ product, openModal }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [qty, setQty] = useState<number>(1);
    const { data: userData } = useQuery(GET_USER, {});
    const [addItem] = useMutation(ADD_ITEM, { variables: { product: { ...product, qty } } });
    const [toggleLoginModal] = useMutation(SET_USER, { variables: { user: { openLoginModal: true } } });

    const goToProduct = () => {
        if (window.innerWidth < parseInt(BREAKPOINT.replace('px', ''))) {
            history.push(`/${toLink(product.name)}`);
        } else {
            openModal(product);
        }
    }

    const addAndGo = () => {
        if (userData.userInfo.length && userData.userInfo[0].isLoggedIn) {
            addItem();
            // history.push('/checkout');
        } else {
            toggleLoginModal();
        }
    }

    const discount = (1 - (product.special_price / product.price)) * 100;

    return <Suspense fallback={<Loader />}>
        <Container>
            {discount > 0 && <Discount>{discount}%</Discount>}
            <Link onClick={goToProduct}>
                <Category>{product.category_name}</Category>
                <Image src={product.image.split(',')[0]}></Image>
                <Title>{product.name}</Title>
                <PriceBox>
                    <Size>{product.size} - </Size>
                    <Price>Bs. {product.special_price.toFixed(2).replace('.', ',')} {product.unit}</Price>
                    {discount > 0 && <DiscountPrice>Bs. {product.price.toFixed(2).replace('.', ',')}</DiscountPrice>}
                </PriceBox>
            </Link>
            <Pill>
                <Qty>
                    <select onChange={event => setQty(Number(event.target.value))}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((opt: any, index: number) => <option key={index} value={opt}>{opt}</option>)}
                    </select>
                    <Chevron />
                </Qty>
                <Add onClick={addAndGo}>{t('itembox.add')}</Add>
            </Pill>
        </Container>
    </Suspense>
}

export default ItemBox;