import React, { FC, Suspense, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { ProductType } from '../../graphql/products/type';
import { BREAKPOINT } from '../../utils/constants';
import { toLink } from '../../utils/string';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const Slider = React.lazy(() => import(/* webpackChunkName: "Slider" */'react-slick'));
const ItemBox = React.lazy(() => import(/* webpackChunkName: "ItemBox" */'../ItemBox'));
const ArrowLeft = React.lazy(() => import(/* webpackChunkName: "ArrowLeft" */'../Images/ArrowLeft.js'));
const ArrowRight = React.lazy(() => import(/* webpackChunkName: "ArrowRight" */'../Images/ArrowRight.js'));
const Product = React.lazy(() => import(/* webpackChunkName: "Product" */'../../pages/product'));

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

const ProductModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, .8);
    z-index: 3;
    padding: 30px 50px;
    & > div {
        margin: 0 auto;
        box-shadow: 0 0 5px #ccc;
        background: white;
        height: calc(100vh - 60px);
        width: 100%;
        max-width: 1000px;
        overflow: auto;
        border-radius: 20px;
        .main-container {
            & > div {
                padding: 30px 0;
            }
            .wrapper-related {
                padding: 30px 0;
            }
        }
    }
`

const ProductSlider: FC<Props> = ({ products }) => {
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState<ProductType | any>({});

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

    const openModal = (product: ProductType) => {
        setProduct(product);
        window.history.replaceState('', '', `/${toLink(product.name)}`);
        setOpen(true);
    }

    return (
        <Suspense fallback={<Loader />}>
            <div className="main-container">
                <SliderContainer>
                    <Slider {...settings}>
                        {products.map((product: ProductType) => <div key={product.entity_id}>
                            <ItemBox openModal={openModal} product={product} />
                        </div>)
                        }
                    </Slider>
                </SliderContainer>
                {open && <ProductModal>
                    <div className="product-modal">
                        <Product closeModal={() => setOpen(false)} oldUrl={pathname} inlineProdname={toLink(product.name)} />
                    </div>
                </ProductModal>}
            </div>
        </Suspense>
    );
}

export default ProductSlider;