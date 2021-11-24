import gql from "graphql-tag";

export const GET_BILLS_HISTORY = gql`
  query GetBillsHistory($nit: String!, $startDate: String!, $endDate: String!, $limit: Int!, $offset: Int!) {
    getBillsHistory(nit: $nit, startDate: $startDate, endDate: $endDate, limit: $limit, offset: $offset) {
      rows {
        unidad_operativa
        entidad_legal
        numero_factura
        clase
        fecha_trans
        fecha_venci
        monto
        divisa
        saldo_deb
        estado
        cod_cliente
      }
      count
    }
  }
`;

export const GET_BILLS_PENDING = gql`
  query GetBillsPending($nit: String!, $startDate: String!, $endDate: String!, $limit: Int!, $offset: Int!) {
    getBillsPending(nit: $nit, startDate: $startDate, endDate: $endDate, limit: $limit, offset: $offset) {
      rows {
        fecha_emis
        tipo_documento
        numero_factura
        fecha_venci
        total_venta
        saldo_total
        cuotas_pen
        monto_venc
        cred_auto_cli
        cred_auto_dir
        dias_plazo
        anticipos
        pagos_sin_aplicar
        saldo_real
        fecha_trans
        cod_cliente
      }
      count
    }
  }
`;

export const GET_BILL_DETAILS = gql`
  query GetBillDetail($nit: String!, $billCode: String!) {
    getBillDetail(nit: $nit, billCode: $billCode) {
      rows {
        razon_social
        nit
        fecha_factura
        numero_factura
        monto
        linea_pedido
        cod_producto
        des_producto
        unidad_med
        cantidad
        precio_uni
        monto_linea
        cod_cliente
      }
      count
    }
  }
`;
