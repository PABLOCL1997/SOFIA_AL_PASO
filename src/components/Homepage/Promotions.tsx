import React, { FC, Suspense, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLazyQuery } from '@apollo/react-hooks';
import { useHistory } from "react-router-dom";
import { GET_PRODUCTS } from '../../graphql/products/queries';
import { user } from '../../utils/store';
import { useTranslation } from 'react-i18next';
import { BREAKPOINT } from '../../utils/constants';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const ProductSlider = React.lazy(() => import(/* webpackChunkName: "ProductSlider" */'./ProductSlider'));
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */'../Cta'));

const Container = styled.div`
    position: relative;
    > img {
        position: absolute;
        top: -65px;
        width: 100%;
        z-index: -1;
        @media screen and (max-width: ${BREAKPOINT}) {
            display: none;
        }
    }
    @media screen and (max-width: ${BREAKPOINT}) {
        background: url(/images/promotions_bg.png) no-repeat -400px center / 250%;
    }
`

const Title = styled.h2`
    font-family: MullerMedium;
    font-size: 40px;
    line-height: 40px;
    color: var(--black);
    text-align: center;
    margin-bottom: 75px;
    @media screen and (max-width: ${BREAKPOINT}) {
        margin-bottom: 30px;
    }
`

const CtaWrapper = styled.div`
    text-align: center;
    margin-top: 30px;
    button {
        padding: 13px 80px;
        text-transform: uppercase;
    }
`

type Props = {}

const Promotions: FC<Props> = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const _user = user.get();
    const [loadProducts] = useLazyQuery(GET_PRODUCTS, {
        variables: { category_id: 0, limit: 20, offset: 0, onsale: true, city: _user.address ? _user.address.key : '' },
        // fetchPolicy: 'cache-and-network',
        onCompleted: (d) => setProducts(d.products.rows)
    });

    const seeAll = () => {
        history.push(`/productos/promotions`);
    }

    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Suspense fallback={<Loader />}>
        <Container>
            <img src="/images/promotions_bg.png" alt="promotions_bg" />
            <div className="main-container">
                <Title>{t('homepage.promotions.title')}</Title>
                <ProductSlider products={products} />
                <CtaWrapper>
                    <Cta action={seeAll} text={t('homepage.promotions.seeall')} filled={true} />
                </CtaWrapper>
            </div>
        </Container>
    </Suspense>
}

export default Promotions;