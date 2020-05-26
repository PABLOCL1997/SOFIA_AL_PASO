export type UserOrderItem = {
    itemId: number,
    name: string,
    price: number
}

export type UserOrder = {
    id: number,
    incrementId: string,
    createdAt: string,
    status: string,
    billingFirstname?: string,
    billingLastname?: string,
    billingEmail?: string,
    billingNit?: string,
    shippingFirstname?: string,
    shippingLastname?: string,
    shippingPhone?: string,
    shippingNit?: string,
    shippingStreet?: string,
    shippingCity?: string,
    shippingReference?: string,
    items?: Array<UserOrderItem>,
    subtotal?: number,
    shippingPrice?: number,
    total: number
}

export type AddressType = {
    id?: number,
    street?: string,
    city?: string,
    reference?: string,
    latitude?: string,
    longitude?: string
}

export type UserType = {
    firstname?: string,
    lastname?: string,
    email?: string,
    nit?: string,
    phone?: string,
    password?: string,
    addressId?: number,
    addresses?: Array<AddressType>
}