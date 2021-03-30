import React, { FC, Suspense, useState } from "react";
import styled from "styled-components";
import { BREAKPOINT, XL } from "../../utils/constants";
import Slider from "react-slick";
import { useHistory } from "react-router-dom";
import {
  Wrapper,
  ImageContainer,
  LINK
} from "../../styled-components/CategoryBannerStyles";


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
};

const CategoryBanner: FC<Props> = ({ category }) => {
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
          <LINK
            onMouseDown={handleMouseDown}
            onClick={e => {
              const variation = e.clientX - clientX;
              if (variation > -10 && variation < 10) {
                history.push(`/${history.location.pathname}`);
              }
            }}
          >
            <ImageContainer bg={category}></ImageContainer>
          </LINK>
        </Slider>
      </Wrapper>
    </Suspense>
  );
};

export default CategoryBanner;
