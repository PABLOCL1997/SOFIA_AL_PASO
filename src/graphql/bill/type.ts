export type BillType = {
  unidad_operativa: string;
  entidad_legal: string;
  numero_factura: string;
  clase: string;
  fecha_trans: string;
  fecha_venci: string;
  monto: string;
  divisa: string;
  saldo_deb: string;
  estado: string;
  cod_cliente: string;
};

export type BillDetailType = {
  razon_social: string;
  nit: string;
  fecha_factura: string;
  numero_factura: string;
  monto: string;
  linea_pedido: string;
  cod_producto: string;
  des_producto: string;
  unidad_med: string;
  cantidad: string;
  precio_uni: string;
  monto_linea: string;
  cod_cliente: string;
};