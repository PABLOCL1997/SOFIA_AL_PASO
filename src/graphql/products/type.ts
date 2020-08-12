import { CategoryType } from "../categories/type";

export const OrderColums = ["position", "weight", "price"];

export type ProductType = {
  entity_id: number;
  name: string;
  sku: string;
  image: string;
  size: string;
  price: number;
  fullprice: number;
  special_price: number;
  weight: number;
  stock: number;
  unit: string;
  useKGS: boolean;
  isNew: boolean;
  maxPerUser: number;
  category_name: string;
  description?: string;
  categories?: Array<CategoryType>;
  qty?: number;
};
