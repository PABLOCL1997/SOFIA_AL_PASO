import gql from "graphql-tag";

export const SET_USER = gql`
  mutation addInfoToUser($user: User) {
    addInfoToUser(user: $user) @client
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      token
    }
  }
`;

export const SUBSCRIBE = gql`
  mutation Subscribe($email: String!) {
    subscribe(email: $email) {
      status
    }
  }
`;

export const RECOVER = gql`
  mutation Recover($email: String!, $url: String!, $bompras: Boolean!) {
    recover(email: $email, url: $url, bompras: $bompras) {
      id
    }
  }
`;

export const RESET = gql`
  mutation Reset($email: String!, $token: String!, $password: String!, $bompras: Boolean!) {
    reset(email: $email, token: $token, password: $password, bompras: $bompras) {
      id
    }
  }
`;

export const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!, $firstname: String, $lastname: String, $network: Boolean) {
    signup(email: $email, password: $password, firstname: $firstname, lastname: $lastname, network: $network) {
      id
      token
    }
  }
`;

export const ADD_ADDRESS = gql`
  mutation AddAddress(
    $addressId: Int
    $firstname: String
    $lastname: String
    $email: String
    $nit: String
    $telephone: String
    $password: String
    $street: String
    $reference: String
    $city: String
    $latitude: String
    $longitude: String
    $billing: Int!
    $id_address_ebs: Int
    $id_price_list: Int
  ) {
    addAddress(
      addressId: $addressId
      firstname: $firstname
      lastname: $lastname
      email: $email
      nit: $nit
      telephone: $telephone
      password: $password
      street: $street
      reference: $reference
      city: $city
      latitude: $latitude
      longitude: $longitude
      billing: $billing
      id_address_ebs: $id_address_ebs
      id_price_list: $id_price_list
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
        id_address_ebs
        id_price_list
      }
    }
  }
`;

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
`;

export const SET_EMPLOYEE = gql`
  mutation setEmployee($customer_id: Int!, $value: Int) {
    setEmployee(customer_id: $customer_id, value: $value)
  }
`;

export const UPDATE_B2E_ADDRESS = gql`
  mutation UpdateB2EAddress($Id_Cliente: Int!, $Id_Direccion: Int!, $Direccion: String, $Ciudad: String, $Telefono: String, $Latitud: String, $Longitud: String) {
    updateB2EAddress(Id_Cliente: $Id_Cliente, Id_Direccion: $Id_Direccion, Direccion: $Direccion, Ciudad: $Ciudad, Telefono: $Telefono, Latitud: $Latitud, Longitud: $Longitud)
  }
`;

export const SEND_CONTACT_FORM = gql`
  mutation sendContactForm($name: String!, $email: String!, $question: String!, $phone: String!, $city: String!, $country: String!, $message: String!) {
    sendcontactform(name: $name, email: $email, question: $question, phone: $phone, city: $city, country: $country, message: $message)
  }
`;
