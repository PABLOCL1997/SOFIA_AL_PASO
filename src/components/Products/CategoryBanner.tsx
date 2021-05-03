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
import podiumMob from '../../assets/images/2-POST-BANNER-II-320X80_MARZO_PODIUM.png'
import podium from '../../assets/images/2-POST-BANNER-II-1124X100_MARZO_PODIUM.png'

import kostlichMob from '../../assets/images/Kostlich-320x80.png'
import kostlich from '../../assets/images/Kostlich-1124x100.png'

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
  category: string | undefined;
  isMobile: Boolean | undefined;
};

const CategoryBanner: FC<Props> = ({ category, isMobile = true }) => {
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
          {category === "alimento-para-mascotas" &&
            <LINK>
              <ImageContainer bg={isMobile ? podiumMob : podium }></ImageContainer>
            </LINK>
          }
          {category === "embutidos-premium" && 
            <LINK>
              <ImageContainer bg={isMobile ? kostlichMob : kostlich }></ImageContainer>
            </LINK>
          }
        </Slider>
      </Wrapper>
    </Suspense>
  );
};

export default CategoryBanner;
