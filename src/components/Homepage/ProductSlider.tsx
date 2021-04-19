import React, { FC } from "react";
import styled from "styled-components";
import { ProductType } from "../../graphql/products/type";
import { BREAKPOINT } from "../../utils/constants";
import { LazyLoadTypes } from "react-slick"


const Slider = React.lazy(() =>
  import(/* webpackChunkName: "Slider" */ "react-slick")
);
const ItemBox = React.lazy(() =>
  import(/* webpackChunkName: "ItemBox" */ "../ItemBox")
);
const ArrowLeft = React.lazy(() =>
  import(/* webpackChunkName: "ArrowLeft" */ "../Images/ArrowLeft.js")
);
const ArrowRight = React.lazy(() =>
  import(/* webpackChunkName: "ArrowRight" */ "../Images/ArrowRight.js")
);

type Props = {
  products: Array<ProductType>;
  useArrows?: boolean;
};

const SliderContainer = styled.div`
  padding: 0 70px;
  .slick-arrow > svg {
    position: absolute;
    top: -75px;
  }
  .slick-arrow.slick-prev {
    z-index: 3;
  }
  .slick-arrow.slick-prev > svg {
    left: -80px;
    @media screen and (max-width: ${BREAKPOINT}) {
      left: -30px;
    }
  }
  .slick-arrow.slick-next > svg {
    right: -80px;
    @media screen and (max-width: ${BREAKPOINT}) {
      right: -30px;
    }
  }
  .slick-prev:before,
  .slick-next:before {
    display: none;
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
        opacity: 0.35;
        * {
          opacity: 0;
        }
      }
      .slick-active {
        box-shadow: 0 0 0 1px var(--btn-background);
        opacity: 1;
      }
    }
  }
`;

const ProductSlider: FC<Props> = ({ products, useArrows }) => {
  const typeLazy: LazyLoadTypes = "ondemand"
  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    lazyLoad: typeLazy,
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
          arrows: useArrows,
          dots: !useArrows
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: useArrows,
          dots: !useArrows
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: useArrows,
          dots: !useArrows
        }
      }
    ]
  };

  return (
      <div className="main-container">
        <SliderContainer>
          <Slider {...settings}>
            {products.map((product: ProductType) => 
              <ItemBox key={product.entity_id} openModal={() => {}} dropDownQty={6} product={product} />
            )}
          </Slider>
        </SliderContainer>
      </div>
  );
};

export default ProductSlider;
