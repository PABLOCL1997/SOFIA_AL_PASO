import React, { FC, Suspense } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { ProductType } from "../../graphql/products/type";
import { BREAKPOINT } from "../../utils/constants";
import { LazyLoadTypes } from "react-slick";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Loader"));
const Slider = React.lazy(() => import(/* webpackChunkName: "Slider" */ "react-slick"));
// const RelatedItem = React.lazy(() =>
//   import(/* webpackChunkName: "RelatedItem" */ "../RelatedItem")
// );
const ItemBoxHome = React.lazy(() => import(/* webpackChunkName: "ItemBoxHome" */ "./ItemBoxHome"));

const ArrowLeft = React.lazy(() => import(/* webpackChunkName: "ArrowLeft" */ "../Images/ArrowLeft.js"));
const ArrowRight = React.lazy(() => import(/* webpackChunkName: "ArrowRight" */ "../Images/ArrowRight.js"));

const Container = styled.div`
  position: relative;
  padding: 0 0 30px 0;
  margin: 0 0 30px 0;
  &:after {
    content: "";
    position: absolute;
    display: block;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    // background: var(--yellow);
    width: 80%;
    z-index: 0;
    @media screen and (max-width: ${BREAKPOINT}) {
      bottom: 20px;
      border-top-right-radius: 0;
      border-bottom-left-radius: 30px;
      width: 80%;
    }
  }
`;

const Wrapper = styled.div`
  padding: var(--padding);
  padding-bottom: 0;
  position: relative;
  z-index: 2;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 20px;
  }
`;

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  padding: 0 10px;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 20px;
    line-height: 20px;
  }
`;

const SliderContainer = styled.div<{ onlyPaddingLeft?: boolean }>`
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
    left: 30px;
    @media screen and (max-width: ${BREAKPOINT}) {
      left: -30px;
    }
  }
  .slick-arrow.slick-next > svg {
    right: 30px;
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
    ${({ onlyPaddingLeft }) =>
      onlyPaddingLeft
        ? `
      padding: 0;
    `
        : ``}
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

type Props = {
  products: Array<ProductType>;
  openModal?: Function;
};

const RelatedProducts: FC<Props> = ({ products, openModal }) => {
  const { t } = useTranslation();
  const typeLazy: LazyLoadTypes = "ondemand";

  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    lazyLoad: typeLazy,
    speed: 500,
    nextArrow: <ArrowRight />,
    prevArrow: <ArrowLeft />,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1180,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
          dots: false,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: false,
        },
      },
    ],
  };

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        <Title>{t("product.related.title")}</Title>
        <SliderContainer>
          <Slider {...settings}>{React.Children.toArray(products.map((product: ProductType) => <ItemBoxHome openModal={() => {}} product={product} featured={true} />))}</Slider>
        </SliderContainer>
      </Container>
    </Suspense>
  );
};

export default RelatedProducts;
