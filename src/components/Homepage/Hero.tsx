import React, { FC, Suspense } from "react";
import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";
import useBanners from "../../hooks/useBanners";
import { Link } from "react-router-dom";
import Banner from "../../types/Banner";
import { LazyLoadTypes } from "react-slick";
import useCityPriceList from "../../hooks/useCityPriceList";

const Slider = React.lazy(() => import(/* webpackChunkName: "Slider" */ "react-slick"));

const Container = styled.div`
  min-height: 359px;
  @media screen and (max-width: ${BREAKPOINT}) {
    min-height: 169px;
    margin-top: -3px;
    padding: 40px 20px;
  }

  @media screen and (max-width: 768px) {
    padding: 0;
  }
  .slick-slide img {
    margin: 0px auto;
    width: 100%;
    object-fit: scale-down;

    @media (max-width: ${BREAKPOINT}) {
      height: 165px;
    }
  }

  .slick-arrow.slick-prev {
    z-index: 3;
    left: -30px;
    width: 120px;
    height: 120px;
  }
  .slick-arrow.slick-next {
    right: 0;
    z-index: 3;
    // bottom: 15px;
    width: 120px;
    height: 120px;
  }

  .slick-prev:before,
  .slick-next:before {
    display: none;
  }
  .slick-dots {
    bottom: 25px;
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
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  img {
    max-width: 100%;
  }
`;

const PrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} onClick={onClick} style={{ ...style }}>
      <svg width="155" height="174" viewBox="0 0 155 174" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d)">
          <circle cx="68" cy="83" r="23" fill="white" />
        </g>
        <path d="M75.5 83.5H60.5" stroke="#2F2F2F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M65.5 78.5L60.5 83.5L65.5 88.5" stroke="#2F2F2F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <filter id="filter0_d" x="-19" y="0" width="174" height="174" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="32" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

const NextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} onClick={onClick} style={{ ...style }}>
      <svg width="156" height="174" viewBox="0 0 156 174" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d)">
          <circle cx="87.666" cy="83" r="23" transform="rotate(-180 87.666 83)" fill="white" />
        </g>
        <path d="M80.166 82.5L95.166 82.5" stroke="#2F2F2F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M90.166 87.5L95.166 82.5L90.166 77.5" stroke="#2F2F2F" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <filter id="filter0_d" x="0.666016" y="0" width="174" height="174" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="32" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

type Props = {};

const Hero: FC<Props> = () => {
  const { city } = useCityPriceList();
  const banners = useBanners();
  const typeLazy: LazyLoadTypes = "ondemand";
  const settings = {
    dots: true,
    infinite: true,
    lazyLoad: typeLazy,
    arrows: true,
    speed: 500,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          arrows: false,
        },
      },
    ],
  };
  return (
    <Suspense
      fallback={
        <Loader>
          <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
        </Loader>
      }
    >
      <Container>
        <Slider {...settings}>
          {React.Children.toArray(
            banners
              .reverse()
              .filter((banner: Banner) => {
                return city === "SC" ? banner : String(banner.title).match(/santacruz/) ? null : banner;
              })
              .sort((a: Banner, b: Banner) => {
                return a.order - b.order;
              })
              .map((banner: Banner) => (
                <Link to={banner.link}>
                  <img src={process.env.REACT_APP_MAGENTO_URL + "/media/" + banner.image} alt={banner.description} />
                </Link>
              ))
          )}
        </Slider>
      </Container>
    </Suspense>
  );
};

export default Hero;
