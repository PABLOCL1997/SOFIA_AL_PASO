import React, { FC, Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { ProductType } from '../graphql/products/type';
import { toLink } from '../utils/string';
import { BREAKPOINT } from '../utils/constants';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'./Loader'));

const Container = styled.div`
    position: relative;
    background: #FFFFFF;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    margin: 40px 10px;
    padding: 30px;
    @media screen and (max-width: ${BREAKPOINT}) {
        margin: 20px 10px;
    }
`

const Link = styled.div`
    cursor: pointer;
`

const Image = styled.img`
    max-width: 100%;
    height: 200px;
    margin: 0 auto;
`

const Title = styled.h2`
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 110%;
    text-align: center;
    color: var(--black);
    height: 35px;
`

const PriceBox = styled.div`
    text-align: center;
    margin: 12px 0 24px;
`

const Price = styled.span`
font-family: MullerBold;
font-size: 14px;
line-height: 14px;
color: var(--black);
`

const Action = styled.div`
    font-family: MullerBold;
    font-size: 10px;
    line-height: 10px;
    color: var(--black);
    cursor: pointer;
    border: 1px solid var(--yellow);
    padding: 10px;
    text-transform: uppercase;
    border-radius: 30px;
    text-align: center;
    padding: 15px 30px;
`

type Props = {
    product: ProductType
}

const RelatedProducts: FC<Props> = ({ product }) => {
    const { t } = useTranslation();
    const history = useHistory();

    const goToProduct = () => {
        history.push(`/${toLink(product.name)}`);
    }

    return <Suspense fallback={<Loader />}>
        <Container>
            <Link>
                <Image src={product.image.split(',')[0]}></Image>
                <Title>{product.name}</Title>
                <PriceBox>
                    <Price>Bs. {product.price.toFixed(2).replace('.', ',')} {product.unit}</Price>
                </PriceBox>
            </Link>
            <Action onClick={goToProduct}>{t('product.related.see')}</Action>
        </Container>
    </Suspense>
}

export default RelatedProducts;