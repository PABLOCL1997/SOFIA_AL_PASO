import gql from 'graphql-tag'

export const GET_USER = gql`
query GetUserInfo {
    userInfo @client
}
`

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
        addresses {
            id
            street
            city
            reference
            latitude
            longitude
        }
    }
}
`