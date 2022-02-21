import gql from "graphql-tag";

export const GET_PRODUCTS = gql`
  query Products($category_id: Int!, $limit: Int!, $offset: Int!, $onsale: Boolean, $order: String, $search: String, $city: String!, $brand: String) {
    products(category_id: $category_id, limit: $limit, offset: $offset, onsale: $onsale, search: $search, city: $city, order: $order, brand: $brand) {
      rows {
        entity_id
        name
        sku
        image
        size
        price
        fullprice
        unit
        useKGS
        isNew
        maxPerUser
        weight
        category_name
        special_price
        stock
      }
      count
    }
  }
`;

export const GET_PRODUCT = gql`
  query Product($name: String!, $city: String!, $categories: Boolean, $related: Boolean) {
    product(name: $name, city: $city, categories: $categories, related: $related) {
      entity_id
      name
      sku
      image
      size
      price
      fullprice
      unit
      category_name
      special_price
      weight
      stock
      useKGS
      isNew
      maxPerUser
      description
      categories {
        entity_id
        name
        level
      }
      related {
        entity_id
        name
        sku
        image
        size
        price
        weight
        fullprice
        unit
        useKGS
        isNew
        maxPerUser
        category_name
        special_price
        stock
      }
    }
  }
`;

export const GET_B2E_PRODUCTS = gql`
  query productsB2E($category_id: Int!, $skus: [Int], $limit: Int!, $offset: Int!, $id_price_list: String!, $city: String!, $search: String, $order: String, $onsale: Boolean, $brand: String) {
    productsB2E(skus: $skus, limit: $limit, offset: $offset, id_price_list: $id_price_list, city: $city, category_id: $category_id, search: $search, order: $order, onsale: $onsale, brand: $brand) {
      rows {
        entity_id
        name
        sku
        image
        size
        price
        fullprice
        unit
        useKGS
        isNew
        maxPerUser
        weight
        category_name
        special_price
        stock
      }
      count
    }
  }
`;

export const GET_B2E_PRODUCT = gql`
  query productB2E($name: String, $id_price_list: String!, $city: String!) {
    productB2E(name: $name, id_price_list: $id_price_list, city: $city) {
      entity_id
      name
      sku
      image
      size
      price
      fullprice
      unit
      category_name
      special_price
      weight
      stock
      useKGS
      isNew
      maxPerUser
      description
      categories {
        entity_id
        name
        level
      }
      related {
        entity_id
        name
        sku
        image
        size
        price
        weight
        fullprice
        unit
        useKGS
        isNew
        maxPerUser
        category_name
        special_price
        stock
      }
    }
  }
`;
export const GET_PRODUCT_DETAIL = gql`
  query ProductDetail($name: String!) {
    productDetail(name: $name)
  }
`;

export const GET_SAP_AGENCIES = gql`
  query Agencies {
    agencies {
      id
      key
      city
      name
      street
      telephone
      latitude
      longitude
      reference
      horario_texto
    }
  }
`;

export const GET_EXPRESS_AGENCIES = gql`
  query Express {
    express {
      id
      key
      city
      name
      street
      telephone
      latitude
      longitude
      reference
      horario_texto
    }
  }
`;

export const GET_SAP_PRODUCTS = gql`
  query ProductsSap($category_id: Int!, $limit: Int!, $offset: Int!, $agency: String!, $city: String!, $onsale: Boolean, $order: String, $search: String, $brand: String) {
    productsSap(category_id: $category_id, limit: $limit, offset: $offset, onsale: $onsale, search: $search, agency: $agency, city: $city, order: $order, brand: $brand) {
      rows {
        entity_id
        name
        sku
        image
        size
        price
        fullprice
        unit
        useKGS
        isNew
        maxPerUser
        weight
        category_name
        special_price
        stock
      }
      count
    }
  }
`;

export const GET_SAP_PRODUCT = gql`
  query productSap($name: String!, $agency: String!, $city: String!) {
    productSap(name: $name, agency: $agency, city: $city, categories: false, related: false) {
      entity_id
      name
      sku
      image
      size
      price
      fullprice
      unit
      category_name
      special_price
      weight
      stock
      useKGS
      isNew
      maxPerUser
      description
    }
  }
`;
