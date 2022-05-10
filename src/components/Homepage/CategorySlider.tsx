import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { CategoryType } from "../../graphql/categories/type";
import { useTranslation } from "react-i18next";
import { toLink } from "../../utils/string";
import { BREAKPOINT } from "../../utils/constants";
import useCategory from "../../hooks/useCategory";
import useProducts from "../../hooks/useProducts";

const ProductSlider = React.lazy(() => import(/* webpackChunkName: "ProductSlider" */ "./ProductSlider"));
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));
const Slider = React.lazy(() => import(/* webpackChunkName: "Slider" */ "react-slick"));

const SectionWrapper = styled.div`
  margin-bottom: 88px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 30px;
  }
`;

const Category = styled.div<{ key?: number }>`
  display: flex;
  width: 110px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 14px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  text-align: center;

  @media screen and (max-width: ${BREAKPOINT}) {
    display: flex;
    align-items: center;
    position: relative;
    span {
      flex: 1;
    }
  }
`;

const CtaWrapper = styled.div`
  text-align: center;

  button {
    padding: 13px 80px;
    text-transform: uppercase;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 50px 0;
  }
`;

const Loader = styled.div`
  margin-top: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 100%;
  }
`;

const CategoryTitle = styled.h6`
  margin-top: 14px;
  font-size: 11px;
  word-wrap: normal;

  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 10px;
  }
`;

const CategoryImageWrapper = styled.div<{ selected: boolean }>`
  border: 1px solid var(--yellow);
  ${({ selected }) => (selected ? `background: var(--yellow);` : ` background: transparent;`)}
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 25px;
    height: 25px;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    width: 40px;
    height: 40px;

    img {
      height: 17px;
      width: 17px;
    }
  }
`;

const CategoryWrapper = styled.div`
  margin: 0;
`;

const Title = styled.h3`
  font-size: 32px;
  font-family: 'MontserratMedium';
  margin: 64px 0;
  text-align: center;

  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 22px;
    margin: 48px 0 32px;
  }
`;

const SliderWrapper = styled.section`
  padding: 0 120px;

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 0;
  }

  .slick-arrow.slick-prev,
  .slick-arrow.slick-next {
    z-index: 3;
    top: 30%;
    @media screen and (max-width: ${BREAKPOINT}) {
      svg {
        height: 10px;
      }
    }
  }
  .slick-arrow.slick-prev {
    left: -61px;
    @media screen and (max-width: ${BREAKPOINT}) {
      left: 16px;
    }
  }
  .slick-arrow.slick-next {
    @media screen and (max-width: ${BREAKPOINT}) {
      right: 16px;
    }
  }

  .slick-prev:before,
  .slick-next:before {
    display: none;
  }
`;

const LoaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 80px;

  img {
    width: 90px;
  }
`;

const Container = styled.section`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto 0;
  padding: 40px 0 0;
`;

function ArrowLeft(props: any) {
  const { className, onClick, children } = props;
  return (
    <div className={className} onClick={onClick}>
      <svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 12L12 22" stroke="#FECD00" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ArrowRight(props: any) {
  const { className, style, onClick, children } = props;
  return (
    <div className={className} style={{ ...style }} onClick={onClick}>
      <svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2L12 12L2 22" stroke="#FECD00" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

type Props = {};

const CategorySlider: FC<Props> = () => {
  const { t } = useTranslation();
  const { categories, loading: loadingCat } = useCategory();
  const { products, loading: loadingProds, setCategoryId } = useProducts(10);
  const [selected, setSelected] = useState<CategoryType | number>(316);
  const [link, setLink] = useState<string>("/productos");

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          arrows: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          arrows: true,
          dots: false,
        },
      },
    ],
  };

  const selectCategory = (index: number, cat?: CategoryType) => {
    setSelected(index);
    setCategoryId(index);
    if (!cat) {
      setLink("/productos");
    } else {
      setLink(`/productos/${toLink(cat.name)}`);
    }
  };

  return (
    <Suspense
      fallback={
        <Loader>
          <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
        </Loader>
      }
    >
      <Title>Compra tus productos por categoría</Title>
      <SectionWrapper>
        <SliderWrapper>
          <Slider {...settings}>
            {!loadingCat &&
              React.Children.toArray(
                categories
                  .filter((category: CategoryType) => !category.is_campaign)
                  .map((category: CategoryType) => (
                    <CategoryWrapper>
                      <Category onClick={() => selectCategory(category.entity_id, category)} key={category.entity_id}>
                        <CategoryImageWrapper selected={selected === category.entity_id}>
                          <img src={String(category.category_image).replace(".png", ".svg")} />
                        </CategoryImageWrapper>
                        <CategoryTitle>{category.name}</CategoryTitle>
                      </Category>
                    </CategoryWrapper>
                  ))
              )}
          </Slider>
        </SliderWrapper>
        {loadingProds && (
          <LoaderWrapper>
            <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
          </LoaderWrapper>
        )}

        {!loadingProds && !!products.length && (
          <Container>
            <ProductSlider products={products} isCategories={true} isPromotions={false} />
          </Container>
        )}
        <CtaWrapper>
          <Link to={link}>
            <Cta action={() => {}} text={t("homepage.categoryslider.seeall")} filled={true} />
          </Link>
        </CtaWrapper>
      </SectionWrapper>
    </Suspense>
  );
};

export default CategorySlider;
