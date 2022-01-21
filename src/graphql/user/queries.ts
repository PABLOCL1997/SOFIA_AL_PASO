import gql from "graphql-tag";

export const GET_USER = gql`
  query GetUserInfo {
    userInfo @client
  }
`;

export const CHECK_TOKEN = gql`
  query CheckToken {
    checkToken {
      status
    }
  }
`;

export const DETAILS = gql`
  query Details {
    details {
      id
      firstname
      lastname
      email
      nit
      phone
      addressId
      employee_old
      employee
      addresses {
        id
        firstname
        lastname
        nit
        street
        city
        phone
        reference
        latitude
        longitude
        id_price_list
        id_address_ebs
      }
    }
  }
`;

export const ORDERS = gql`
  query Orders {
    orders {
      id
      incrementId
      createdAt
      status
      total
      subtotal
      shippingStreet
      shippingCity
      shippingReference
      shippingPrice
    }
  }
`;

export const ORDER = gql`
  query Order($orderId: Int!) {
    order(orderId: $orderId) {
      id
      incrementId
      createdAt
      status
      billingFirstname
      billingLastname
      billingEmail
      billingNit
      shippingFirstname
      shippingLastname
      shippingPhone
      shippingNit
      shippingStreet
      shippingCity
      shippingReference
      items {
        itemId
        sku
        entity_id
        name
        price
        qty
        image
        weight
        unit
        useKgs
        basePrice
        rowTotal
      }
      subtotal
      shippingPrice
      total
    }
  }
`;

export const ORDER_STATUS = gql`
  query SofiawsOrderStatus($incrementId: String!) {
    sofiawsOrderStatus(incrementId: $incrementId)
  }
`;
