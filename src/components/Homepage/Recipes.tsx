import React, { FC, Suspense } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { RecipeType } from "./RecipeItem";
import { Desktop, Mobile } from "../ResponsiveContainers";
import { BREAKPOINT } from "../../utils/constants";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Loader"));
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));
const RecipeItem = React.lazy(() => import(/* webpackChunkName: "RecipeItem" */ "./RecipeItem"));
const Slider = React.lazy(() => import(/* webpackChunkName: "Slider" */ "react-slick"));

const Container = styled.div`
  background: url(/images/bg.jpg) no-repeat top center / cover;
  padding-bottom: 120px;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 20px;
  }

  @media only screen and (-webkit-min-device-pixel-ratio: 2),
    only screen and (min--moz-device-pixel-ratio: 2),
    only screen and (-o-min-device-pixel-ratio: 2/1),
    only screen and (min-device-pixel-ratio: 2),
    only screen and (min-resolution: 192dpi),
    only screen and (min-resolution: 2dppx) {
    background: url(/images/bg.webp) no-repeat top center / cover;
  }

  @media not all and (min-resolution: 0.001dpcm) {
    @media {
      background: url(/images/bg.jpg) no-repeat top center / cover;
    }
  }
`;

const Title = styled.div`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  text-align: center;
  padding: 50px 20px;
`;

const CtaWrapper = styled.div`
  text-align: center;
  max-width: 380px;
  margin: 30px auto 0;
  a {
    padding: 13px 80px;
    text-transform: uppercase;
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 50px 0 30px;
    a {
      padding: 13px 30px;
    }
  }
`;

const Grid = styled.div`
  display: flex;
  max-width: 990px;
  flex-wrap: wrap;
  margin: 0 auto;
  justify-content: space-between;
`;

const SliderContainer = styled.div`
  .slick-arrow > svg {
    position: absolute;
    top: -75px;
  }
  .slick-arrow.slick-prev > svg {
    left: -80px;
  }
  .slick-arrow.slick-next > svg {
    right: -80px;
  }
  .slick-dots {
    bottom: -5px;
    li {
      background: var(--black);
      border-radius: 20px;
      width: 14px;
      height: 14px;
      opacity: 0.35;
      * {
        opacity: 0;
      }
    }
    .slick-active {
      opacity: 1;
    }
  }
`;

const recipesData: Array<RecipeType> = [
  {
    title: "Strogonoff de Pollo",
    difficulty: "fácil",
    mins: "150m",
    people: 6,
    link: "https://www.sofia.com.bo/recetas/",
  },
  {
    title: "Pork Belly",
    difficulty: "fácil",
    mins: "40m",
    people: 4,
    link: "https://www.sofia.com.bo/recetas/",
  },
  {
    title: "Fondo de Pollo",
    difficulty: "fácil",
    mins: "150m",
    people: 6,
    link: "https://www.sofia.com.bo/recetas/",
  },
  {
    title: "Cordon Bleu",
    difficulty: "fácil",
    mins: "25m",
    people: 4,
    link: "https://www.sofia.com.bo/recetas/",
  },
];

type Props = {};

const Benefits: FC<Props> = () => {
  const { t } = useTranslation();

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        <Desktop>
          <div className="main-container">
            <Title>{t("homepage.recipes.title")}</Title>
            <Grid>
              {recipesData.map((r: RecipeType, index: number) => (
                <RecipeItem key={index} index={index + 1} item={r} />
              ))}
            </Grid>
            <CtaWrapper>
              <Cta blank={true} action={"https://www.sofia.com.bo/recetas/"} text={t("homepage.recipes.seeall")} filled={true} />
            </CtaWrapper>
          </div>
        </Desktop>
        <Mobile>
          <div className="main-container">
            <Title>{t("homepage.recipes.title")}</Title>
            <SliderContainer>
              <Slider {...settings}>
                {recipesData.map((r: RecipeType, index: number) => (
                  <RecipeItem key={index} index={index + 1} item={r} />
                ))}
              </Slider>
            </SliderContainer>
            <CtaWrapper>
              <Cta blank={true} action={"https://www.sofia.com.bo/recetas/"} text={t("homepage.recipes.seeall")} filled={true} />
            </CtaWrapper>
          </div>
        </Mobile>
      </Container>
    </Suspense>
  );
};

export default Benefits;
