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