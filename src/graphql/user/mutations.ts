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
    }
}
`