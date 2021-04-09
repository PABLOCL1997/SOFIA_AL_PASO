import gql from "graphql-tag";

export const GET_PRODUCTS = gql`
  query Products(
    $category_id: Int!
    $limit: Int!
    $offset: Int!
    $onsale: Boolean
    $order: String
    $search: String
    $city: String!
  ) {
    products(
      category_id: $category_id
      limit: $limit
      offset: $offset
      onsale: $onsale
      search: $search
      city: $city
      order: $order
    ) {
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
  query Product(
    $name: String!
    $city: String!
    $categories: Boolean
    $related: Boolean
  ) {
    product(
      name: $name
      city: $city
      categories: $categories
      related: $related
    ) {
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
query ProductDetail($name: String!){
  productDetail(name:$name)
}
`