export type UserOrderItem = {
  itemId: number;
  name: string;
  price: number;
  qty: number;
};

export type UserOrder = {
  id: number;
  incrementId: string;
  createdAt: string;
  status: string;
  billingFirstname?: string;
  billingLastname?: string;
  billingEmail?: string;
  billingNit?: string;
  shippingFirstname?: string;
  shippingLastname?: string;
  shippingPhone?: string;
  shippingNit?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingReference?: string;
  items?: Array<UserOrderItem>;
  subtotal?: number;
  shippingPrice?: number;
  total: number;
};

export type AddressType = {
  id?: number;
  firstname?: string;
  lastname?: string;
  nit?: string;
  phone?: string;
  street?: string;
  city?: string;
  reference?: string;
  latitude?: string;
  longitude?: string;
  id_price_list?: number;
  id_address_ebs?: number;
};

export type UserType = {
  firstname?: string;
  lastname?: string;
  email?: string;
  nit?: string;
  phone?: string;
  password?: string;
  addressId?: number;
  addresses?: Array<AddressType>;
  employee_old?: string;
  employee?: string;
};

export type UserDetails = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  nit: string;
  phone: string;
  addressId: number;
  employee_old: string;
  employee: string;
  addresses: Array<AddressType>;
};