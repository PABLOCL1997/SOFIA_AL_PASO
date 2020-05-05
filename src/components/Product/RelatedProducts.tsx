import React, { FC, Suspense } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ProductType } from '../../graphql/products/type';
import { BREAKPOINT } from '../../utils/constants';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const Slider = React.lazy(() => import(/* webpackChunkName: "Slider" */'react-slick'));
const RelatedItem = React.lazy(() => import(/* webpackChunkName: "RelatedItem" */'../RelatedItem'));

const Container = styled.div`
    position: relative;
    &:after {
        content: "";
        position: absolute;
        bottom: 0;
        display: block;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        background: var(--yellow);
        width: 100%;
        height: 200px;
        z-index: 0;
        @media screen and (max-width: ${BREAKPOINT}) {
            height: 150px;
            bottom: 20px;
            border-top-right-radius: 0;
            border-bottom-left-radius: 30px;
            width: 80%;
            left: 20%;
        }
    }
`

const Wrapper = styled.div`
    padding: var(--padding);
    padding-bottom: 0;
    position: relative;
    z-index: 2;
    @media screen and (max-width: ${BREAKPOINT}) {
        padding: 20px;
    }
`

const Title = styled.h2`
    font-family: MullerMedium;
    font-size: 24px;
    line-height: 24px;
    color: var(--black);
    padding: 0 10px;
`

type Props = {
    products: Array<ProductType>
}

const RelatedProducts: FC<Props> = ({ products }) => {
    const { t } = useTranslation();
    const settings = {
        dots: false,
        infinite: false,
        arrows: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    arrows: false,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false,
                    dots: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: false
                }
            }
        ]
    };

    return <Suspense fallback={<Loader />}>
        <Container>
            <Wrapper>
                <Title>{t('product.related.title')}</Title>
                <Slider {...settings}>
                    {products.map((product: ProductType) => <div key={product.entity_id}>
                        <RelatedItem product={product} />
                    </div>)}
                </Slider>
            </Wrapper>
        </Container>
    </Suspense>
}

export default RelatedProducts;