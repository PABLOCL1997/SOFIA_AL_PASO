import React, { FC, Suspense } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { Wrapper, ImageContainer } from "../../styled-components/CategoryBannerStyles";

import useCategory from "../../hooks/useCategory";
import { toCatLink, toLink } from "../../utils/string";
import { CategoryType } from "../../graphql/categories/type";
import useCityPriceList from "../../hooks/useCityPriceList";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Loader"));

type Props = {
  isMobile: Boolean | undefined;
};

const CategoryBanner: FC<Props> = ({ isMobile = true }) => {
  const { city } = useCityPriceList();
  const { categories, tCategory } = useCategory();

  const settings = {
    dots: true,
    infinite: false,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1180,
        settings: {
          arrows: false,
          dots: true,
        },
      },
    ],
  };

  return (
    <Suspense fallback={<Loader />}>
      <Wrapper>
        <Slider {...settings}>
          {tCategory && !tCategory.is_campaign && tCategory.banner_mobile && tCategory.banner_desktop && (
            <Link to={`/productos/${toCatLink(categories, tCategory?.name, tCategory?.level)}`}>
              <ImageContainer bg={isMobile ? tCategory.banner_mobile : tCategory.banner_desktop} />
            </Link>
          )}
          {/* below code: mostrar campaign en todas la categorias */}
          {React.Children.toArray(
            categories
              .filter((row: CategoryType) => {
                return city === "SC" ? row : toLink(row.name).match(/elay/) ? null : row;
              })
              .map(
                (category: CategoryType) =>
                  category.is_campaign && (
                    <Link to={`/productos/${toCatLink(categories, category.name, category.level)}`}>
                      <ImageContainer bg={isMobile ? category.banner_mobile : category.banner_desktop} />
                    </Link>
                  )
              )
          )}
        </Slider>
      </Wrapper>
    </Suspense>
  );
};

export default CategoryBanner;
