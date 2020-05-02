import { CategoryType } from "../categories/type";

export const OrderColums = ['weight', 'price'];

export type ProductType = {
    entity_id: number,
    name: string,
    image: string,
    size: string,
    price: number,
    special_price: number,
    unit: string,
    category_name: string,
    description?: string,
    categories?: Array<CategoryType>
}