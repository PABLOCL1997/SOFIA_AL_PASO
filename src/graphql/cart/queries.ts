import gql from 'graphql-tag'

export const GET_QTY = (cartItems: any) => {
    return cartItems.reduce((sum: number, i: any) => {
        return sum + i.qty
    }, 0);
}

export const GET_TOTAL = (cartItems: any) => {
    return cartItems.reduce((sum: number, i: any) => {
        return sum + (i.price * i.qty)
    }, 0).toFixed(2);
}

export const GET_CART_ITEMS = gql`
query GetCartItems {
    cartItems @client
}
`

export const TODOTIX = gql`
query Todotix($orderIds: [Int!]) {
    todotix(orderIds: $orderIds) {
        id_transaccion
        url_pasarela_pagos
        error
    }
}
`
