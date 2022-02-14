import dayjs from 'dayjs';
import { object, string, number, date, InferType } from 'yup';

export interface IBilling {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    nit?: string;
}

export interface ITimeframe {
    deliveryDate?: dayjs.Dayjs | null;
    timeFrame?: string | null;
}

export interface IShipping {
    addressId?: number;
    firstname?: string;
    lastname?: string;
    nit?: string;
    phone?: string;
    phone2?: string;
    city?: string;
    address?: string;
    reference?: string;
}

export const weekdays = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

export const Checkout = {
    Validators: {
        billingSchema: (isAgency = false) => object({
            firstname: string().trim().required('Nombre es requerido'),
            lastname: string().trim().required('Apellido es requerido'),
            email: string().trim().email('Correo electrónico inválido ').required('Correo electrónico es requerido'),
            nit: number().required('Nit es requerido').min(999, 'Nit debe tener al menos 4 digitos'),
            phone: isAgency ? string().trim().min(6, 'Teléfono debe tener al menos 6 digitos').required('Teléfono es requerido') : string().trim().nullable()
        }),
        shippingSchema: object({
            firstname: string().trim().required('Nombre es requerido'),
            lastname: string().trim().required('Apellido es requerido'),
            nit: number().required('Nit es requerido').min(999, 'Nit debe tener al menos 4 digitos'),
            phone: string().trim().required('Teléfono es requerido').min(6, 'Teléfono debe tener al menos 6 digitos'),
            phone2: string().trim().nullable(),
            city: string().trim().required('Ciudad es requerida'),
            address: string().trim().required('Dirección es requerida'),
            reference: string().trim().nullable()
        }),
        timeframeSchema: object({
            deliveryDate: date().required('Delivery date es requerido'),
            timeFrame: string().trim().required('Timeframe es requerido')
        })
    },
    Validations: {
        Billing: async (billing: IBilling, isAgency = false) => {
            return await Checkout.Validators.billingSchema(isAgency).validate(billing);
        },
        Shipping: async(Shipping: IShipping) => {
            return await Checkout.Validators.shippingSchema.validate(Shipping);
        },
        Timeframe: async (timeframe: ITimeframe) => {
            return await Checkout.Validators.timeframeSchema.validate(timeframe);
        }
    },
}