import gql from 'graphql-tag'

export const GET_CATEGORIES = gql`
query Categories ($city: String!) {
    categories (city:$city) {
        entity_id
        name
        quantity
        category_image
        subcategories {
            entity_id
            quantity
            name
            category_image
            subcategories {
                entity_id
                quantity
                name
                category_image
            }
        }
    }
}
`