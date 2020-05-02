import React, { Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './App.css';
import './Reset.css';

const LayoutGeneral = React.lazy(() => import(/* webpackChunkName: "LayoutGeneral" */'./layout/general'));
const Homepage = React.lazy(() => import(/* webpackChunkName: "Homepage" */'./pages/homepage'));
const Products = React.lazy(() => import(/* webpackChunkName: "Products" */'./pages/products'));
const Product = React.lazy(() => import(/* webpackChunkName: "Product" */'./pages/product'));
const Checkout = React.lazy(() => import(/* webpackChunkName: "Checkout" */'./pages/checkout'));

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <Switch>
          <Route exact path="/" children={<LayoutGeneral><Homepage /></LayoutGeneral>} />
          <Route exact path="/productos" children={<LayoutGeneral><Products /></LayoutGeneral>} />
          <Route exact path="/checkout" children={<LayoutGeneral><Checkout /></LayoutGeneral>} />
          <Route exact path="/productos/:category" children={<LayoutGeneral><Products /></LayoutGeneral>} />
          <Route exact path="/:prodname" children={<Product />} />
        </Switch>
      </Router>
    </Suspense>
  );
}

export default App;
