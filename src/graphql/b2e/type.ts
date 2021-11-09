export type UserB2EAddress = {
  id_direccion: number;
  direccion: string;
  ciudad: string;
  provincia: string;
  vendedor: string;
  latitud: string;
  longitud: string;
  id_listaPrecio: number;
  vhPrimerTurno: string;
  vhSegundoTurno: string;
  categoriaCliente: string;
};

export type UserB2EType = {
  id_Cliente: number;
  nit: string;
  nombre: string;
  email: string;
  celular: string;
  televendedor?: string;
  direcciones?: Array<UserB2EAddress>;
  token?: string;
  is_active?: number;
};
