import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { BREAKPOINT, XL } from "../../utils/constants";
import Slider from "react-slick";
import { Link, useHistory } from "react-router-dom";
import {
  Wrapper,
  ImageContainer,
  LINK
} from "../../styled-components/CategoryBannerStyles";


import useCategory from "../../hooks/useCategory";
import useProduct from "../../hooks/useProduct";
import { CategoryType } from "../../graphql/categories/type";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);

const Root = styled.div`
  padding: var(--padding);
  padding-top: 0;
  padding-bottom: 20px;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 20px 20px 0 20px;
  }
  img {
    border-radius: 48px;
    width: 100%;
    height: 250px;
    object-fit: cover;
    @media screen and (max-width: ${XL}) {
      border-radius: 20px;
      height: auto;
      object-fit: unset;
    }
  }
`;

type Props = {
  isMobile: Boolean | undefined;
};

const CategoryBanner: FC<Props> = ({ isMobile = true }) => {
  const { categories, category_id, category, subcategory, lastlevel, tCategory } = useCategory()
  const { toCatLink } = useProduct()

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
          dots: true
        }
      }
    ]
  };

  let history = useHistory();

  const [clientX, setClientX] = useState(0);

  const handleMouseDown = (e: { clientX: any }) => {
    setClientX(e.clientX);
  };



  return (
    <Suspense fallback={<Loader />}>
      <Wrapper>
        <Slider {...settings}>
          {/* {category === "alimento-para-mascotas" &&
            <LINK>
              <ImageContainer bg={isMobile ? podiumMob : podium }></ImageContainer>
            </LINK>
          }
          {category === "embutidos-premium" && 
            <LINK>
              <ImageContainer bg={isMobile ? kostlichMob : kostlich }></ImageContainer>
            </LINK>
          } */}
          {/* <Link to="/productos/semana-del-atun-">
            <ImageContainer bg={isMobile ? semanaAtunMob : semanaAtun}></ImageContainer>
          </Link> */}
          {tCategory && !tCategory.is_campaign && tCategory.banner_mobile && tCategory.banner_desktop &&
            <Link to={`/productos/${toCatLink(tCategory?.name, tCategory?.level)}`}>
              <ImageContainer bg={isMobile ? tCategory.banner_mobile : tCategory.banner_desktop} />
            </Link>
          }

          {categories.map((category: CategoryType) => 
            category.is_campaign && 
            <ImageContainer bg={isMobile ? category.banner_mobile : category.banner_desktop} />
          )}
        </Slider>
      </Wrapper>
    </Suspense>
  );
};

export default CategoryBanner;
