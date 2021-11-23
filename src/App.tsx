import React, { Suspense } from "react";
import styled from "styled-components";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LayoutGeneral = React.lazy(() => import(/* webpackChunkName: "LayoutGeneral" */ "./layout/general"));
const LayoutHomepage = React.lazy(() => import(/* webpackChunkName: "LayoutHomepage" */ "./layout/homepage"));
const Homepage = React.lazy(() => import(/* webpackChunkName: "Homepage" */ "./pages/homepage"));
const MyAccount = React.lazy(() => import(/* webpackChunkName: "myaccount" */ "./pages/myaccount"));
const Products = React.lazy(() => import(/* webpackChunkName: "Products" */ "./pages/products"));
const Product = React.lazy(() => import(/* webpackChunkName: "Product" */ "./pages/product"));
const Checkout = React.lazy(() => import(/* webpackChunkName: "Checkout" */ "./pages/checkout"));
const Faq = React.lazy(() => import(/* webpackChunkName: "Faq" */ "./pages/faq"));
const Contact = React.lazy(() => import(/* webpackChunkName: "Faq" */ "./pages/contact"));
const Terms = React.lazy(() => import(/* webpackChunkName: "Terms" */ "./pages/terms"));
const Coverage = React.lazy(() => import(/* webpackChunkName: "Coverage" */ "./pages/coverage"));
const Page404 = React.lazy(() => import(/* webpackChunkName: "Page404" */ "./components/Page404"));
const Incentivos = React.lazy(() => import(/* webpackChunkName: "Incentivos" */ "./pages/incentivos"));
const Thanks = React.lazy(() => import(/* webpackChunkName: "Thanks" */ "./pages/thanks"));
const RetiroAlPaso = React.lazy(() => import(/* webpackChunkName: "RetiroAlPaso" */ "./pages/retiroAlPaso"));
const Activate = React.lazy(() => import(/* webpackChunkName: "Activate" */ "./pages/activate"));
const Tracking = React.lazy(() => import(/* webpackChunkName: "Tracking" */ "./pages/tracking"));

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  img {
    max-width: 100%;
  }
`;

const App = () => {
  return (
    <Suspense
      fallback={
        <Loader>
          <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
        </Loader>
      }
    >
      <Router>
        <Switch>
          <Route
            exact
            path="/404"
            children={
              <LayoutGeneral>
                <Page404 />
              </LayoutGeneral>
            }
          />
          <Route
            exact
            path="/"
            children={
              <LayoutHomepage>
                <Homepage />
              </LayoutHomepage>
            }
          />
          <Route
            path="/activacion"
            children={
              <LayoutGeneral>
                <Activate />
              </LayoutGeneral>
            }
          />
          <Route
            path="/segui-tu-pedido"
            children={
              <LayoutGeneral>
                <Tracking />
              </LayoutGeneral>
            }
          />
          <Route
            path="/habilitacion-incentivos"
            children={
              <LayoutGeneral>
                <Incentivos />
              </LayoutGeneral>
            }
          />
          <Route
            path="/password-reset/:token"
            children={
              <LayoutGeneral>
                <Homepage />
              </LayoutGeneral>
            }
          />
          <Route
            path="/preguntas-frecuentes"
            children={
              <LayoutGeneral>
                <Faq />
              </LayoutGeneral>
            }
          />
          <Route
            path="/contacto"
            children={
              <LayoutGeneral>
                <Contact />
              </LayoutGeneral>
            }
          />
          <Route
            path="/terminos-y-condiciones"
            children={
              <LayoutGeneral>
                <Terms />
              </LayoutGeneral>
            }
          />
          <Route
            path="/cobertura"
            children={
              <LayoutGeneral>
                <Coverage />
              </LayoutGeneral>
            }
          />
          <Route
            path="/mi-cuenta"
            children={
              <LayoutGeneral>
                <MyAccount />
              </LayoutGeneral>
            }
          />
          <Route
            path="/mi-cuenta/ordenes"
            children={
              <LayoutGeneral>
                <MyAccount />
              </LayoutGeneral>
            }
          />
          <Route
            exact
            path="/productos"
            children={
              <LayoutGeneral>
                <Products />
              </LayoutGeneral>
            }
          />
          <Route
            path="/checkout"
            children={
              <LayoutGeneral>
                <Checkout />
              </LayoutGeneral>
            }
          />
          <Route
            path="/retiro-al-paso"
            children={
              <LayoutGeneral>
                <RetiroAlPaso />
              </LayoutGeneral>
            }
          />
          <Route
            path="/gracias"
            children={
              <LayoutGeneral>
                <Thanks />
              </LayoutGeneral>
            }
          />
          <Route
            exact
            path="/productos/:category"
            children={
              <LayoutGeneral>
                <Products />
              </LayoutGeneral>
            }
          />
          <Route
            exact
            path="/productos/:category/:subcategory"
            children={
              <LayoutGeneral>
                <Products />
              </LayoutGeneral>
            }
          />
          <Route
            exact
            path="/productos/:category/:subcategory/:lastlevel"
            children={
              <LayoutGeneral>
                <Products />
              </LayoutGeneral>
            }
          />
          <Route
            path="/:prodname"
            children={
              <LayoutGeneral page="productpage">
                <Product />
              </LayoutGeneral>
            }
          />
          <Route
            children={
              <LayoutGeneral>
                <Page404 />
              </LayoutGeneral>
            }
          />
        </Switch>
      </Router>
    </Suspense>
  );
};

export default App;
