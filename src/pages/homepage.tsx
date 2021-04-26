import React, { Suspense } from "react";
import styled from "styled-components";
import GTM from "../components/Shared/GTM";

const Header = React.lazy(() =>
  import(/* webpackChunkName: "Header" */ "../components/Header/Header")
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

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  img {
    max-width: 100%;
  }
`

const Homepage = () => {
  return (
  <>
    {/* <Suspense fallback={<Loader>
      <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
    </Loader>}> */}
      <Header checkout={false} page={undefined} />
      <Hero />
      <GTM />
      <CategorySlider />
      <Benefits />
      <Promotions />
      <Subscribe />
      <Error />
      <Success />
      <Modal />
      <Footer page={"footer"} />
    </>
  );
};

export default Homepage;
