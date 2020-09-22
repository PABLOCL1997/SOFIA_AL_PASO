import gql from "graphql-tag";

export const GET_MIN_PRICE = (data: any) => {
  const userInfo =
    data && data.userInfo && data.userInfo.length ? data.userInfo[0] : {};
  return userInfo.cityKey === "CO"
    ? 100
    : userInfo.cityKey === "SC"
    ? 150
    : 200;
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
  query CheckCart($cart: String!, $city: String!) {
    checkCart(cart: $cart, city: $city) {
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
