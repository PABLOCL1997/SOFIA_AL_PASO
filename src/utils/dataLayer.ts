import { ProductType } from "../graphql/products/type";

type TrackOrder = {
  increment_id: string;
  total: number;
  coupon: string;
};

export const trackProductList = (products: Array<ProductType>) => {
  (window as any).dataLayer.push({
    ecommerce: {
      currencyCode: "BOB",
      impressions: products.map((p: ProductType, index: number) => ({
        name: p.name,
        id: p.entity_id,
        price: (p.special_price || 0).toFixed(2),
        brand: "Sofía",
        category: p.category_name,
        position: index + 1
      }))
    }
  });
};

export const trackProduct = (p: ProductType) => {
  (window as any).dataLayer.push({
    ecommerce: {
      detail: {
        products: [
          {
            name: p.name,
            id: p.entity_id,
            price: (p.special_price || 0).toFixed(2),
            brand: "Sofía",
            category: p.category_name
          }
        ]
      }
    }
  });
};

export const trackAddToCart = (p: ProductType) => {
  (window as any).dataLayer.push({
    event: "addToCart",
    ecommerce: {
      currencyCode: "BOB",
      add: {
        products: [
          {
            name: p.name,
            id: p.entity_id,
            price: (p.special_price || 0).toFixed(2),
            brand: "Sofía",
            category: p.category_name,
            quantity: p.qty
          }
        ]
      }
    }
  });
};

export const trackRemoveFromCart = (p: ProductType) => {
  (window as any).dataLayer.push({
    event: "removeFromCart",
    ecommerce: {
      currencyCode: "BOB",
      add: {
        products: [
          {
            name: p.name,
            id: p.entity_id,
            price: (p.special_price || 0).toFixed(2),
            brand: "Sofía",
            category: p.category_name,
            quantity: p.qty
          }
        ]
      }
    }
  });
};

export const trackOrder = (order: TrackOrder, products: Array<ProductType>) => {
  (window as any).dataLayer.push({
    ecommerce: {
      purchase: {
        actionField: {
          id: order.increment_id,
          affiliation: "Tienda Sofía",
          revenue: order.total, // Total transaction value (incl. tax and shipping)
          tax: 0,
          shipping: 0,
          coupon: order.coupon
        },
        products: products.map((p: ProductType, index: number) => ({
          name: p.name,
          id: p.entity_id,
          price: (p.special_price || 0).toFixed(2),
          brand: "Sofía",
          category: p.category_name,
          quantity: p.qty
        }))
      }
    }
  });
};
