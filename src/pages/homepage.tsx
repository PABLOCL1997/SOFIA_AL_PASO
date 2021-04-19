import React, { Suspense, FC, useEffect } from "react";
import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";

const Header = React.lazy(() =>
  import(/* webpackChunkName: "Header" */ "../components/Header")
);

const Hero = React.lazy(() =>
  import(/* webpackChunkName: "Hero" */ "../components/Homepage/Hero")
);
const CategorySlider = React.lazy(() =>
  import(
    /* webpackChunkName: "CategorySlider" */ "../components/Homepage/CategorySlider"
  )
);
const Benefits = React.lazy(() =>
  import(/* webpackChunkName: "Benefits" */ "../components/Homepage/Benefits")
);
const Promotions = React.lazy(() =>
  import(
    /* webpackChunkName: "Promotions" */ "../components/Homepage/Promotions"
  )
);
const Recipes = React.lazy(() =>
  import(/* webpackChunkName: "Recipes" */ "../components/Homepage/Recipes")
);
const Subscribe = React.lazy(() =>
  import(/* webpackChunkName: "Subscribe" */ "../components/Homepage/Subscribe")
);

const Error = React.lazy(() =>
  import(/* webpackChunkName: "Error" */ "../components/Error")
);
const Success = React.lazy(() =>
  import(/* webpackChunkName: "Success" */ "../components/Success")
);
const Modal = React.lazy(() =>
  import(/* webpackChunkName: "ModalMessage" */ "../components/ModalMessage")
);


const Footer = React.lazy(() =>
  import(/* webpackChunkName: "Footer" */ "../components/Footer")
);

const SectionWrapper = styled.div`
  margin-bottom: 88px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-bottom: 30px;
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
`

type Props = {};
const Homepage: FC<Props> = () => {
  return (
    <Suspense fallback={<Loader>
      <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
    </Loader>}>
      <Header checkout={false} page={undefined} />

      {window.innerWidth < parseInt(BREAKPOINT.replace("px", "")) ?
      ( // mobile
        <>
        <SectionWrapper>
          <Hero />
        </SectionWrapper>
        <SectionWrapper>
          <CategorySlider />
        </SectionWrapper>
        <SectionWrapper>
          <Benefits />
        </SectionWrapper>
          <Promotions />
        <SectionWrapper>
          <Subscribe />
        </SectionWrapper>
        </>
      )
      : 
      ( // desktop
        <>
        <SectionWrapper>
          <Hero />
        </SectionWrapper>
        <SectionWrapper>
          <CategorySlider />
        </SectionWrapper>
        <SectionWrapper>
          <Benefits />
        </SectionWrapper>
          <Promotions />
        <SectionWrapper>
          <Subscribe />
        </SectionWrapper>
        <Recipes />
        </>
      )

      }
      <Error />
      <Success />
      <Modal />
      <Footer page={"footer"} />
    </Suspense>
  );
};

export default Homepage;
