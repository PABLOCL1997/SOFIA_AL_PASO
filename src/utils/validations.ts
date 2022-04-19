import dayjs from "dayjs";
import { object, string, number, date } from "yup";

export interface IBilling {
  firstname: string;
  lastname: string;
  email: string;
  nit: string;
  phone: string;
  facturacion_id?: number;
}

export interface ITimeframe {
  deliveryDate?: dayjs.Dayjs | null;
  timeFrame?: string | null;
}
export type PaymentMethod = "ccsave" | "checkmo" | "todotix" | "cashondelivery";
export interface IPayment {
  method: PaymentMethod;
}

export interface IShipping {
  addressId: number;
  id: number;
  firstname: string;
  lastname: string;
  nit: number;
  phone: string;
  phone2: string;
  city: string;
  address: string;
  street: string;
  reference: string;
  id_address_ebs?: number | null;
}

export const weekdays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export const Checkout = {
  Validators: {
    billingSchema: object({
      firstname: string().trim().required("Nombre es requerido").nullable(),
      lastname: string().trim().required("Apellido es requerido").nullable(),
      email: string().trim().email("Correo electrónico inválido ").required("Correo electrónico es requerido").nullable(),
      nit: number().required("Nit es requerido").min(999, "Nit debe tener al menos 4 dígitos").nullable(),
      phone: string().matches(/^[0-9]+$/, "Solo numérico").min(6, "Teléfono debe tener al menos 6 dígitos").required("Teléfono es requerido").nullable(),
    }),
    shippingSchema: object({
      firstname: string().trim().required("Nombre es requerido"),
      lastname: string().trim().required("Apellido es requerido"),
      nit: number().required("Nit es requerido").min(999, "Nit debe tener al menos 4 dígitos"),
      phone: string().trim().required("Teléfono es requerido").min(6, "Teléfono debe tener al menos 6 dígitos"),
      phone2: string().trim().nullable(),
      city: string().trim().required("Ciudad es requerida"),
      address: string().trim().required("Dirección es requerida"),
      reference: string().trim().nullable(),
    }),
    shippingSchemaB2E: object({
      firstname: string().trim().required("Nombre es requerido"),
      nit: number().required("Nit es requerido").min(999, "Nit debe tener al menos 4 dígitos"),
      phone: string().trim().required("Teléfono es requerido").min(6, "Teléfono debe tener al menos 6 dígitos"),
      city: string().trim().required("Ciudad es requerida"),
      address: string().trim().required("Dirección es requerida"),
    }),
    timeframeSchema: object({
      deliveryDate: date().required("Delivery date es requerido"),
      timeFrame: string().trim().required("Timeframe es requerido"),
    }),
  },
  Validations: {
    Billing: async (billing: IBilling) => {
      return await Checkout.Validators.billingSchema.validate(billing);
    },
    Shipping: async (Shipping: IShipping) => {
      return await Checkout.Validators.shippingSchema.validate(Shipping);
    },
    ShippingB2E: async (Shipping: IShipping) => {
      return await Checkout.Validators.shippingSchemaB2E.validate(Shipping);
    },
    Timeframe: async (timeframe: ITimeframe) => {
      return await Checkout.Validators.timeframeSchema.validate(timeframe);
    },
  },
  ValidationsForm: {
    Billing: {
      nit: (key: string, value: string): boolean => {
        if (key === "nit") {
          const regexp = /^[0-9]{0,30}$/gi;
          return regexp.test(value);
        }
        return true;
      },
    },
  },
};
