import gql from 'graphql-tag'

export const GET_PRODUCTS = gql`
query Products($category_id: Int!, $limit: Int!, $offset: Int!, $onsale: Boolean, $order: String, $search: String, $city: String!) {
    products(
        category_id: $category_id, 
        limit: $limit, 
        offset: $offset,
        onsale: $onsale,
        search: $search,
        city: $city,
        order: $order
    ) {
        rows {
            entity_id
            name
            image
            size
            price
            unit
            category_name
            special_price
            stock
        }
        count
    }
}
`