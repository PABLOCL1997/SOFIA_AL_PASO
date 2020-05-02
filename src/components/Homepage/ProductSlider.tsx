import React, { FC, Suspense } from 'react';
import styled from 'styled-components';
import { ProductType } from '../../graphql/products/type';
import { BREAKPOINT } from '../../utils/constants';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const Slider = React.lazy(() => import(/* webpackChunkName: "Slider" */'react-slick'));
const ItemBox = React.lazy(() => import(/* webpackChunkName: "ItemBox" */'../ItemBox'));
const ArrowLeft = React.lazy(() => import(/* webpackChunkName: "ArrowLeft" */'../Images/ArrowLeft.js'));
const ArrowRight = React.lazy(() => import(/* webpackChunkName: "ArrowRight" */'../Images/ArrowRight.js'));

type Props = {
    products: Array<ProductType>
}

const SliderContainer = styled.div`
    padding: 0 70px;
    .slick-arrow > svg {
        position: absolute;
        top: -75px;
    }
    .slick-arrow.slick-prev  > svg {
        left: -80px;
    }
    .slick-arrow.slick-next  > svg {
        right: -80px;
    }
    @media screen and (max-width: ${BREAKPOINT}) {
        padding: 0 20px;
        .slick-dots {
            bottom: -5px;
            li {
                background: var(--btn-background);
                box-shadow: 0 0 0 1px var(--black);
                border-radius: 20px;
                width: 12px;
                height: 12px;
                opacity: .35;
                * { opacity: 0 }
            }
            .slick-active {
                box-shadow: 0 0 0 1px var(--btn-background);
                opacity: 1;
            }
        }
    }
`

const ProductSlider: FC<Props> = ({ products }) => {
    const settings = {
        dots: false,
        infinite: false,
        arrows: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        nextArrow: <ArrowRight />,
        prevArrow: <ArrowLeft />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    arrows: false,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false,
                    dots: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: true
                }
            }
        ]
    };
    return (
        <Suspense fallback={<Loader />}>
            <div className="main-container">
                <SliderContainer>
                    <Slider {...settings}>
                        {products.map((product: ProductType) => <div key={product.entity_id}>
                            <ItemBox product={product} />
                        </div>)
                        }
                    </Slider>
                </SliderContainer>
            </div>
        </Suspense>
    );
}

export default ProductSlider;