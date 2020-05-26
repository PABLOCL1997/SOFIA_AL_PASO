import gql from 'graphql-tag';

export const SET_USER = gql`
mutation addInfoToUser($user: User) {
    addInfoToUser(user: $user) @client
}
`;

export const LOGIN = gql`
mutation Login($email: String!, $password: String!) {
    login (
        email: $email, 
        password: $password
    ) {
        id
        token
    }
}
`

export const RECOVER = gql`
mutation Recover($email: String!) {
    recover (
        email: $email
    ) {
        id
    }
}
`

export const RESET = gql`
mutation Reset($email: String!, $token: String!, $password: String!) {
    reset (
        email: $email,
        token: $token,
        password: $password
    ) {
        id
    }
}
`

export const SIGN_UP = gql`
mutation SignUp($email: String!, $password: String!, $firstname: String, $lastname: String, $network: Boolean) {
    signup (
        email: $email, 
        password: $password, 
        firstname: $firstname, 
        lastname: $lastname, 
        network: $network
    ) {
        id
        token
    }
}
`

export const ADD_ADDRESS = gql`
mutation AddAddress(
    $addressId: Int!, 
    $firstname: String, 
    $lastname: String, 
    $email: String,
    $nit: String,
    $telephone: String,
    $password: String,
    $street: String,
    $reference: String,
    $city: String,
    $latitude: String,
    $longitude: String,
    $billing: Int!
    ) {
    addAddress(
        addressId: $addressId, 
        firstname: $firstname, 
        lastname: $lastname, 
        email: $email,
        nit: $nit,
        telephone: $telephone,
        password: $password,
        street: $street,
        reference: $reference,
        city: $city,
        latitude: $latitude,
        longitude: $longitude,
        billing: $billing
    ) {
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

export const REMOVE_ADDRESS = gql`
mutation RemoveAddress($addressId: Int!) {
    removeAddress(addressId: $addressId) {
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