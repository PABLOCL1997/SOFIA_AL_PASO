import gql from "graphql-tag";

export const GET_MIN_PRICE = (data: any) => {
  const userInfo = data && data.userInfo && data.userInfo.length ? data.userInfo[0] : {};
  return userInfo.cityKey === "CB" ? 150 : userInfo.cityKey === "SC" ? 200 : 200;
};

export const GET_QTY = (cartItems: any) => {
  return cartItems.reduce((sum: number, i: any) => {
    return sum + i.qty;
  }, 0);
};

export const GET_TOTAL = (cartItems: any) => {
  return cartItems
    .reduce((sum: number, i: any) => {
      return sum + (i.special_price ? i.special_price : i.price) * i.qty;
    }, 0)
    .toFixed(2)
    .replace(".", ",");
};

export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;

export const CHECK_CART = gql`
  query CheckCart($cart: String!, $city: String!, $id_price_list: Int, $agency: String) {
    checkCart(cart: $cart, city: $city, id_price_list: $id_price_list, agency: $agency) {
      cart
    }
  }
`;

export const TODOTIX = gql`
  query Todotix($orderIds: [Int!]) {
    todotix(orderIds: $orderIds) {
      id_transaccion
      url_pasarela_pagos
      error
    }
  }
`;

export const COMPARE_PRICES = gql`
  query ComparePrices($prodQty: [ProductQty], $city: String!, $id_price_list: String!) {
    comparePrices(prodQty: $prodQty, city: $city, id_price_list: $id_price_list)
  }
`;

export const ORDER_MINIMUM_PRICE = gql`
  query minimumPrice($city: String!, $store: String) {
    minimum_price(city: $city, store: $store)
  }
`;
