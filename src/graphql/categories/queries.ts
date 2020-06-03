import gql from 'graphql-tag'

export const GET_CATEGORIES = gql`
query Categories {
    categories {
        entity_id
        name
        subcategories {
        entity_id
        name
        subcategories {
            entity_id
            name
        }
        }
    }
}
`