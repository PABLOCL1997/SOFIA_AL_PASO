import React, { FC } from "react";
import styled from "styled-components";
import { ProductType } from "../../graphql/products/type";
import { BREAKPOINT } from "../../utils/constants";
import { LazyLoadTypes } from "react-slick"


const Slider = React.lazy(() =>
  import(/* webpackChunkName: "Slider" */ "react-slick")
);
const ItemBox = React.lazy(() =>
  import(/* webpackChunkName: "ItemBox" */ "../Product/ItemBox")
);
const ItemBoxHome = React.lazy(() =>
  import(/* webpackChunkName: "ItemBoxHome" */ "../Product/ItemBoxHome")
);
const ArrowLeft = React.lazy(() =>
  import(/* webpackChunkName: "ArrowLeft" */ "../Images/ArrowLeft.js")
);
const ArrowRight = React.lazy(() =>
  import(/* webpackChunkName: "ArrowRight" */ "../Images/ArrowRight.js")
);

const PromotionsCard = React.lazy(() =>
  import(/* webpackChunkName: "PromotionsCard" */ "./PromotionsCard")
);

type Props = {
  products: Array<ProductType>;
  useArrows?: boolean;
  isPromotions?: boolean;
  isCategories?: boolean;
};

const SliderContainer = styled.div<{ onlyPaddingLeft?: boolean; }>`
  .slick-list {
    display: inline-block;
    padding: 10px 120px 60px;
    width: 100%;
    @media screen and (max-width: 1024px) {
      padding: 10px 0 60px 0;
      max-height: 360px;
    }
  }
  .slick-arrow > svg {
    position: absolute;
    top: -75px;
  }
  .slick-arrow.slick-prev {
    z-index: 3;
  }
  .slick-arrow.slick-next {
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
    ${({ onlyPaddingLeft }) =>  onlyPaddingLeft ? `
      padding: 0;
    ` : ``}
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

  .slick-dots {
    bottom: -25px;
    li {
      background: var(--btn-background);
      box-shadow: 0 0 0 1px var(--black);
      border-radius: 50%;
      width: 8px;
      height: 8px;
      opacity: 0.35;
      border: none;

      * {
        opacity: 0;
        border: none;

      }
    }
    .slick-active {
      opacity: 1;
      border: none;

    }
  }
`;


const ProductSlider: FC<Props> = ({ products, useArrows, isPromotions, isCategories }) => {
  const typeLazy: LazyLoadTypes = "ondemand"
  const settings = {
    dots: false,
    infinite: false,
    arrows: true,
    variableWidth: true,
    lazyLoad: typeLazy,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <ArrowRight />,
    prevArrow: <ArrowLeft />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: useArrows,
          dots: !useArrows
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4          
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: useArrows,
          dots: !useArrows && !isPromotions
        }
      },
    ]
  };

  return (

        <SliderContainer onlyPaddingLeft={(isPromotions || isCategories) && window.innerWidth < 600}>
          <Slider {...settings}>
            {isPromotions ? 
            <PromotionsCard />
            : null}
            {React.Children.toArray(products.map((product: ProductType) => 
            <>
            {isPromotions || isCategories  ? 
              <ItemBoxHome openModal={() => {}} dropDownQty={6} product={product} webp={true} featured={isPromotions} homeCategories={isCategories} />
              :
              <ItemBox openModal={() => {}} dropDownQty={6} product={product} webp={true} />
            }
            </>
            ))}
          </Slider>
        </SliderContainer>
  );
};

export default ProductSlider;
