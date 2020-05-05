import gql from 'graphql-tag';

export const SET_USER = gql`
mutation addInfoToUser($user: User) {
    addInfoToUser(user: $user) @client
}
`;