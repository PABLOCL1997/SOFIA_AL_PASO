import React, { Suspense } from "react";
import styled from "styled-components";

const Header = React.lazy(() =>
  import(/* webpackChunkName: "Header" */ "../components/Header/Header")
);

const GTM = React.lazy(() =>
  import(/* webpackChunkName: "GTM" */ "../components/Shared/GTM")
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
  margin-top: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    max-width: 100%;
  }
`

const Homepage = () => {
  return (
  <>

      <Header checkout={false} page={undefined} />
      <Hero /> 
    
    <Suspense fallback={<Loader>
      <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
    </Loader>}>
      <Benefits />
      <CategorySlider />
       {/* <Promotions />  */}
    </Suspense>
    
    
    <Suspense fallback={<Loader>
      <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
    </Loader>}>
      <Subscribe />
      <GTM />
      <Error />
      <Success />
      <Modal />
      <Footer page={"footer"} />
    </Suspense> 
    </>
  );
};

export default Homepage;
