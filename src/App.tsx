import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import "./App.css";
import "./Reset.css";
import DelayedWrapper from "./components/DelayedWrapper";

const LayoutGeneral = React.lazy(() =>
  import(/* webpackChunkName: "LayoutGeneral" */ "./layout/general")
);
const Homepage = React.lazy(() =>
  import(/* webpackChunkName: "Homepage" */ "./pages/homepage")
);
const MyAccount = React.lazy(() =>
  import(/* webpackChunkName: "myaccount" */ "./pages/myaccount")
);
const Products = React.lazy(() =>
  import(/* webpackChunkName: "Products" */ "./pages/products")
);
const Product = React.lazy(() =>
  import(/* webpackChunkName: "Product" */ "./pages/product")
);
const Checkout = React.lazy(() =>
  import(/* webpackChunkName: "Checkout" */ "./pages/checkout")
);
const Faq = React.lazy(() =>
  import(/* webpackChunkName: "Faq" */ "./pages/faq")
);
const Terms = React.lazy(() =>
  import(/* webpackChunkName: "Terms" */ "./pages/terms")
);

const Page404 = React.lazy(() =>
  import(/* webpackChunkName: "Page404" */ "./components/Page404")
);

const App = () => {
  return (
    <Suspense fallback={<div />}>
      <DelayedWrapper time={2000}>
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
                <LayoutGeneral>
                  <Homepage />
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
              
              path="/terminos-y-condiciones"
              children={
                <LayoutGeneral>
                  <Terms />
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
              
              path="/productos/:category"
              children={
                <LayoutGeneral>
                  <Products />
                </LayoutGeneral>
              }
            />
            <Route
              
              path="/productos/:category/:subcategory"
              children={
                <LayoutGeneral>
                  <Products />
                </LayoutGeneral>
              }
            />
            <Route
              
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
      </DelayedWrapper>
    </Suspense>
  );
};

export default App;
