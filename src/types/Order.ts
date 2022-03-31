import { IBilling, IPayment, IShipping } from "../utils/validations";
import { ICoupon } from "./Checkout";

export type OrderType = "ECOMMERCE" | "PICKUP" | "B2E" | "EXPRESS";

export type Order = {
  discount_amount: number;
  discount_type: string;
  coupon_code: string;
  items: Array<string>;
  delivery_price: number;
  customer_email: string;
  customer_firstname: string;
  customer_lastname: string;
  facturacion: string;
  envio: string;
  payment_method: string;
  SISTEMA: OrderType;
  DIRECCIONID?: string | null;
  agencia?: string | null;
  vh_inicio?: string | null;
  vh_fin?: string | null;
  delivery_date?: string | null;
};

export interface OrderData {
  billing: IBilling;
  shipping: IShipping;
  coupon: ICoupon;
  payment: IPayment;
  delivery_date: string | null;
  vh_fin: string | null;
  vh_inicio: string | null;
}

export const orderDataInitValues: OrderData = {
  billing: {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    nit: "",
  },
  shipping: {
    id: 0,
    firstname: "",
    lastname: "",
    nit: 0,
    phone: "",
    phone2: "",
    city: "",
    address: "",
    reference: "",
    street: "",
    id_address_ebs: null,
    addressId: 0,
  },
  coupon: {
    coupon: null,
    type: "%",
    discount: 0,
  },
  payment: {
    method: "cashondelivery",
  },
  delivery_date: null,
  vh_fin: null,
  vh_inicio: null,
};
