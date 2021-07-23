import { ProductType } from "../graphql/products/type";

type TrackOrder = {
  increment_id: string;
  total: number;
  coupon: string;
  email: string;
};

export const trackProductList = (products: Array<ProductType>) => {
  try {
    (window as any).dataLayer.push({
      event: "productList",
      ecommerce: {
        currencyCode: "BOB",
        impressions: products.map((p: ProductType, index: number) => ({
          name: p.name,
          id: p.sku,
          price: (p.special_price || 0).toFixed(2),
          brand: "Sofía",
          category: p.category_name,
          position: index + 1
        }))
      }
    });
  } catch (e) { }
};

export const trackProduct = (p: ProductType) => {
  try {
    (window as any).dataLayer.push({
    event: "productDetail",
    ecommerce: {
      detail: {
        products: [
          {
            name: p.name,
            id: p.sku,
            price: (p.special_price || 0).toFixed(2),
            brand: "Sofía",
            category: p.category_name
          }
        ]
      }
    }
  });
  } catch (e) { }
};

export const trackAddToCart = (p: ProductType) => {
  try {
    (window as any).dataLayer.push({
    event: "addToCart",
    ecommerce: {
      currencyCode: "BOB",
      add: {
        products: [
          {
            name: p.name,
            id: p.sku,
            price: (p.special_price || 0).toFixed(2),
            brand: "Sofía",
            category: p.category_name,
            quantity: p.qty
          }
        ]
      }
    }
  });
  } catch (e) { }
};

export const trackRemoveFromCart = (p: ProductType) => {
  try {
  (window as any).dataLayer.push({
    event: "removeFromCart",
    ecommerce: {
      currencyCode: "BOB",
      add: {
        products: [
          {
            name: p.name,
            id: p.sku,
            price: (p.special_price || 0).toFixed(2),
            brand: "Sofía",
            category: p.category_name,
            quantity: p.qty
          }
        ]
      }
    }
  });
  } catch (e) { }
};

export const initCheckout = (
  total: number,
  email: string,
  products: Array<ProductType>
) => {
  try {
    (window as any).dataLayer.push({
    event: "initiateCheckout ",
    ecommerce: {
      purchase: {
        actionField: {
          affiliation: "Tienda Sofía",
          revenue: total,
          tax: 0,
          shipping: 0,
          email
        },
        products: products.map((p: ProductType, index: number) => ({
          name: p.name,
          id: p.sku,
          price: (p.special_price || 0).toFixed(2),
          brand: "Sofía",
          category: p.category_name,
          quantity: p.qty
        }))
      }
    }
  });
} catch (e) { }
};

export const trackOrder = (order: TrackOrder, products: Array<ProductType>) => {
  try {
    (window as any).dataLayer.push({
    event: "purchase",
    ecommerce: {
      purchase: {
        actionField: {
          id: order.increment_id,
          affiliation: "Tienda Sofía",
          revenue: order.total, // Total transaction value (incl. tax and shipping)
          tax: 0,
          shipping: 0,
          coupon: order.coupon,
          email: order.email
        },
        products: products.map((p: ProductType, index: number) => ({
          name: p.name,
          id: p.sku,
          price: (p.special_price || 0).toFixed(2),
          brand: "Sofía",
          category: p.category_name,
          quantity: p.qty
        }))
      }
    }
  });
} catch (e) { }
};

export const trackGoToCartEvent = () => {
  try {
  (window as any).dataLayer.push({
    event: "irCarrito",
  });
  } catch(e) {}
};

export const trackRemoveCartEvent = () => {
  try {
    (window as any).dataLayer.push({
    event: "removerCarrito",
  });
} catch(e) {}

};

export const trackGoToCheckoutEvent = () => {
  try {
    (window as any).dataLayer.push({
    event: "irCheckout",
  });
} catch(e) {}

};
