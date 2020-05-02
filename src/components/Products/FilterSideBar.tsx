import React, { FC, Suspense, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { CategoryType } from '../../graphql/categories/type';

import { toLink } from '../../utils/string';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */'../Cta'));
const Paw = React.lazy(() => import(/* webpackChunkName: "Paw" */'../Images/Paw'));
const FreeDelivery = React.lazy(() => import(/* webpackChunkName: "FreeDelivery" */'../Images/FreeDelivery'));

const Container = styled.div`
    button {
        width: 100%;
        text-align: left;
        padding: 10px 30px
    }
`

const CategoryList = styled.ul`
    background: var(--white);
    box-shadow: 0px 6px 74px rgba(0,0,0,0.06);
    border-radius: 20px;
    padding: 25px 0;
`

const Category = styled.li<{ selected: boolean, key?: number }>`
    padding: 15px 30px;
    cursor: pointer;
    font-family: MullerBold;
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-left: 3px solid ${props => props.selected ? 'var(--yellow)' : 'transparent'};
    color: ${props => props.selected ? 'var(--red)' : 'var(--black)'};
`

const CategoryPet = styled.li<{ selected: boolean, key?: number }>`
    display: flex;
    align-items: center;
    cursor: pointer;
    border: 1px solid var(--yellow);
    border-radius: 20px;
    position: relative;
    top: 25px;
    padding: 25px 30px;
    b {
        font-family: MullerBold;
        font-size: 12px;
        line-height: 12px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--red);
        margin: 0 5px 0 10px;
    }
    span {
        font-size: 10px;
        line-height: 10px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--red);
    }
`

const DeliveryBox = styled.div`
    margin-top: 50px;
`

const Title = styled.div`
    display: flex;
    align-items: center;
    span {
        font-size: 12px;
        line-height: 15px;
        text-transform: uppercase;
        color: var(--black);
        margin-left: 10px;
        flex: 1;
    }
`

const Text = styled.div`
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 18px;
    color: var(--black);
    margin: 20px 0;
`

const ProductsFound = styled.div`
    font-family: MullerBold;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: var(--m-gray);
`

type Props = {
    category: string | undefined,
    count: number,
    categories: Array<CategoryType>
}

const FilterSideBar: FC<Props> = ({ category, count, categories }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const MascotasId = 354;

    const navigate = (cat: CategoryType) => {
        if (cat.entity_id === 0) {
            history.push(`/productos/`);
        } else {
            history.push(`/productos/${toLink(cat.name)}`);
        }
    }

    return <Suspense fallback={<Loader />}>
        <Container>
            <Cta hover={false} text={t('products.filter_side_bar.title')} action={() => { }} filled={true} />
            <CategoryList>
                <Category onClick={() => navigate({ entity_id: 0, name: '' })} selected={!category || category === ''}>{t('products.filter_side_bar.all')}</Category>
                {categories.length && categories.filter((row: CategoryType) => row.entity_id !== MascotasId).map((row: CategoryType) =>
                    <Category onClick={() => navigate(row)} selected={category === toLink(row.name)} key={row.entity_id}>
                        {row.name}
                    </Category>)
                }
                {categories.length && categories.filter((row: CategoryType) => row.entity_id === MascotasId).map((row: CategoryType) =>
                    <CategoryPet onClick={() => navigate(row)} selected={category === toLink(row.name)} key={row.entity_id}>
                        <Paw />
                        <b>{row.name}</b>
                        <span>- {t('products.filter_side_bar.new')}!</span>
                    </CategoryPet>)
                }
            </CategoryList>
            <DeliveryBox>
                <Title>
                    <FreeDelivery />
                    <span>{t('products.filter_side_bar.freedelivery.title')}</span>
                </Title>
                <Text>{t('products.filter_side_bar.freedelivery.text')}</Text>
            </DeliveryBox>
            <ProductsFound>{t('products.filter_side_bar.product_count', { count })}</ProductsFound>
        </Container>
    </Suspense>
}

export default FilterSideBar;