import gql from "graphql-tag";

export const GET_USER2E_DETAILS = gql`
  query getB2EUserInfo($nit: String!) {
    getB2EUserDetails(nit: $nit) {
      id_Cliente
      nit
      nombre
      email
      celular
      televendedor
      codigo_Empleado
      direcciones {
        id_direccion
        direccion
        ciudad
        provincia
        vendedor
        latitud
        longitud
        id_listaPrecio
        vhPrimerTurno
        vhSegundoTurno
        categoriaCliente
      }
    }
  }
`;

export const CLIENT_CREDIT = gql`
  query UserCredit($idClient: Int!, $idAddress: Int!) {
    getB2EUserCredit(idClient: $idClient, idAddress: $idAddress) {
      idCliente
      idDireccion
      limiteCredito
      creditoDisponible
    }
  }
`;
