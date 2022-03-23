import React, { Suspense } from "react";

const Header = React.lazy(() => import(/* webpackChunkName: "Header" */ "../components/Header/Header"));
const Categories = React.lazy(() => import(/* webpackChunkName: "Categories" */ "../components/Homepage/Categories"));
const Hero = React.lazy(() => import(/* webpackChunkName: "Hero" */ "../components/Homepage/Hero"));
const Promotions = React.lazy(() => import(/* webpackChunkName: "Promotions" */ "../components/Homepage/Promotions"));
const TrackingWarnings = React.lazy(() => import(/* webpackChunkName: "Promotions" */ "../components/Homepage/TrackingWarnings"));
const Benefits = React.lazy(() => import(/* webpackChunkName: "Benefits" */ "../components/Homepage/Benefits"));
const ProductSlider = React.lazy(() => import(/* webpackChunkName: "CategorySlider" */ "../components/Homepage/CategorySlider"));
const GoTop = React.lazy(() => import(/* webpackChunkName: "GoTop" */ "../components/Homepage/GoTop"));
const Subscribe = React.lazy(() => import(/* webpackChunkName: "Subscribe" */ "../components/Homepage/Subscribe"));
const Error = React.lazy(() => import(/* webpackChunkName: "Error" */ "../components/Error"));
const Success = React.lazy(() => import(/* webpackChunkName: "Success" */ "../components/Success"));
const MinimumPrice = React.lazy(() => import(/* webpackChunkName: "MinimumPrice" */ "../components/MinimumPrice"));
const Modal = React.lazy(() => import(/* webpackChunkName: "ModalMessage" */ "../components/ModalMessage"));
const Footer = React.lazy(() => import(/* webpackChunkName: "Footer" */ "../components/Footer"));
const PromoBar = React.lazy(() => import(/* webpackChunkName: "PromoBar" */ "../components/Homepage/PromoBar"));

const Homepage = () => {
  return (
    <>
      <PromoBar />
      <Header checkout={false} page={undefined} />
      <Categories isMobile={window.innerWidth <= 1100} />
      <Hero />

      <Suspense fallback={<></>}>
        <TrackingWarnings />
      </Suspense>

      <Suspense fallback={<></>}>
        <Promotions />
      </Suspense>

      <Suspense fallback={<></>}>
        <Benefits />
      </Suspense>

      <Suspense fallback={<></>}>
        <ProductSlider />
      </Suspense>

      <Suspense fallback={<></>}>
        <Subscribe />
        <Error />
        <Success />
        <Modal />
        <GoTop />
        <MinimumPrice />
        <Footer page={"footer"} />
      </Suspense>
    </>
  );
};

export default Homepage;
