import dayjs from "dayjs";
import { object, string, number, date } from "yup";

export interface IBilling {
  firstname: string;
  lastname: string;
  email: string;
  nit: string;
  phone: string;
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
      nit: number().required("Nit es requerido").min(999, "Nit debe tener al menos 4 digitos").nullable(),
      phone: string().matches(/^[0-9]+$|^[0-9]+[ ]{1}\|[ ]{1}[0-9]+$/, "Solo numérico o [número | número]").min(6, "Teléfono debe tener al menos 6 digitos").required("Teléfono es requerido").nullable(),
    }),
    shippingSchema: object({
      firstname: string().trim().required("Nombre es requerido"),
      lastname: string().trim().required("Apellido es requerido"),
      nit: number().required("Nit es requerido").min(999, "Nit debe tener al menos 4 digitos"),
      phone: string().trim().required("Teléfono es requerido").min(6, "Teléfono debe tener al menos 6 digitos"),
      phone2: string().trim().nullable(),
      city: string().trim().required("Ciudad es requerida"),
      address: string().trim().required("Dirección es requerida"),
      reference: string().trim().nullable(),
    }),
    shippingSchemaB2E: object({
      firstname: string().trim().required("Nombre es requerido"),
      nit: number().required("Nit es requerido").min(999, "Nit debe tener al menos 4 digitos"),
      phone: string().trim(),
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
