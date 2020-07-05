import gql from "graphql-tag";

export const ADD_ITEM = gql`
  mutation addToCart($product: Product!) {
    addToCart(product: $product) @client
  }
`;

export const DELETE_ITEM = gql`
  mutation deleteFromCart($product: Product!) {
    deleteFromCart(product: $product) @client
  }
`;

export const EMPTY_CART = gql`
  mutation emptyCart {
    emptyCart @client
  }
`;

export const CHECK_COUPON = gql`
  mutation CheckCoupon($name: String!) {
    coupon(name: $name) {
      name
      type
      discount_amount
      code
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $discount_amount: Float
    $discount_type: String
    $coupon_code: String
    $items: [String!]
    $delivery_price: Float
    $customer_email: String!
    $customer_firstname: String!
    $customer_lastname: String!
    $facturacion: String!
    $envio: String!
    $payment_method: String!
  ) {
    createOrder(
      discount_amount: $discount_amount
      discount_type: $discount_type
      coupon_code: $coupon_code
      items: $items
      delivery_price: $delivery_price
      customer_email: $customer_email
      customer_firstname: $customer_firstname
      customer_lastname: $customer_lastname
      facturacion: $facturacion
      envio: $envio
      payment_method: $payment_method
    ) {
      entity_id
      increment_id
    }
  }
`;

export const PAY = gql`
  mutation AddPayment($parent_ids: String!, $last_trans_id: String!) {
    addPayment(parent_ids: $parent_ids, last_trans_id: $last_trans_id) {
      entity_id
      increment_id
    }
  }
`;

export const ORDER_TO_ORACLE = gql`
  mutation SofiawsCreateOrder($orderIds: [Int!]) {
    sofiawsCreateOrder(orderIds: $orderIds) {
      listRecepcionId {
        origenPedido
        recepcionId
      }
      error
    }
  }
`;
