import { ProductType } from "../graphql/products/type";
import axios from "axios";
const publicIp = require("public-ip");

type TrackOrder = {
  increment_id: string;
  total: number;
  coupon: string;
  email: string;
};

const PIXEL_ID = `359213527988967`;
const PIXEL_TOKEN = `EAA0WALZAPjLEBAOZC2nJRxNlFSoLgRkjKIKbbv01bZAKtRRIKUflxF8jMU5fwp6B0lAvDjuxI6UoIEGmSdwuUmgUvqbA0GksoWqoBI6hhcgGZA8H5tjPaRQwrCL1IcpCxwZBZA8CRq6lhs3m6sGqOTdLcWv3orwZB6Wv3eZBAaPy1pnHDRRNORpzSnxQYDiSgPQZD`;
const PIXEL_URL = `https://graph.facebook.com/v11.0/${PIXEL_ID}/events?access_token=${PIXEL_TOKEN}`;

const currency = "BOB";
const content_type = "product";

// events TODO
/*

integrar bien lo de fecha 


Done: 
Purchase
ViewContent ok
PageView ok 
AddToCart ok
InitiateCheckout


*/

interface FacebookPixelEvent {
  event_id: string | number;
  event_time: string | number;
  event_source_url: string;
  user_data: { client_ip_address: string; client_user_agent: string };

  // https://developers.facebook.com/docs/facebook-pixel/reference#standard-events

  event_name: string;
  content_ids?: string | number;
  content_name?: string | number;
  content_type?: string | number;
  contents?: string | number;
  currency?: string | number;
  value?: string | number;

  content_category?: string;
  num_items?: number;

  custom_data?: any;
}

const generateFacebookPixelEvent = async (event: any): Promise<FacebookPixelEvent> => {
  const location = window?.location?.pathname || "/";
  const mainUrl = process.env.REACT_APP_SITE_URL;
  const client_ip_address = await publicIp.v4({
    fallbackUrls: ["https://ifconfig.co/ip"],
  });
  const client_user_agent = (window as any)?.userEmail || "anonymous";
  // random_id
  const id = Math.floor(new Date().getTime() / 1000);
  const event_id = id;
  const event_time = id;
  const event_source_url = mainUrl + location;
  // const user_data = event.user_data;

  const event_data: FacebookPixelEvent = {
    event_id,
    event_time,
    event_source_url,
    user_data: {
      client_ip_address,
      client_user_agent,
    },
    ...event,
  };
  return event_data;
};

export const trackProductList = async (products: Array<ProductType>) => {
  try {
    const ViewContentPixel = "ViewContent";
    const ViewContentGTM = "productList";
    const content_name = "products_page";
    const event = {
      event: ViewContentGTM,
      ecommerce: {
        currencyCode: "BOB",
        impressions: products.map((p: ProductType, index: number) => ({
          name: p.name,
          id: p.sku,
          price: (p.special_price || 0).toFixed(2),
          brand: "Sofía",
          category: p.category_name,
          position: index + 1,
        })),
      },
    };

    const pixelEventData: FacebookPixelEvent = await generateFacebookPixelEvent({
      event_name: ViewContentPixel,
      content_ids: products.map(({ sku }: ProductType) => sku),
      contents: products.map(({ sku: id, stock: quantity }: ProductType) => {
        return { id, quantity };
      }),
      content_name,
      content_type,
      currency,
      value: products.reduce((acc: number, { special_price, stock }: ProductType) => acc + special_price * (stock || 0), 0),
    });
    (window as any).dataLayer.push(event);
    (window as any).fbq("track", ViewContentPixel, { ...pixelEventData }, { event: ViewContentPixel, eventID: pixelEventData.event_id });
    await axios.post(PIXEL_URL, { data: [pixelEventData] });
  } catch (e) {}
};

export const trackProduct = async (product: ProductType) => {
  try {
    const PageViewPixel = "PageView";
    const PageViewGTM = "productDetail";
    const event = {
      event: PageViewGTM,
      ecommerce: {
        detail: {
          products: [
            {
              name: product.name,
              id: product.sku,
              price: (product.special_price || 0).toFixed(2),
              brand: "Sofía",
              category: product.category_name,
            },
          ],
        },
      },
    };

    const pixelEventData: FacebookPixelEvent = await generateFacebookPixelEvent({
      event_name: PageViewPixel,
      content_ids: [product.sku],
      contents: [{ id: product.sku, quantity: product.stock }],
      content_name: product.name,
      content_category: product.category_name,
      value: product.special_price,
      content_type,
      currency,
    });
    (window as any).dataLayer.push(event);
    (window as any).fbq("track", PageViewPixel, { ...pixelEventData }, { event: PageViewPixel, eventID: pixelEventData.event_id });
    await axios.post(PIXEL_URL, { data: [pixelEventData] });
  } catch (e) {}
};

export const trackAddToCart = async (product: ProductType) => {
  try {
    const addToCartPixel = "AddToCart";
    const addToCartGTM = "addToCart";

    const event = {
      event: addToCartGTM,
      ecommerce: {
        currencyCode: currency,
        add: {
          products: [
            {
              name: product.name,
              id: product.sku,
              price: (product.special_price || 0).toFixed(2),
              brand: "Sofía",
              category: product.category_name,
              quantity: product.qty,
            },
          ],
        },
      },
    };
    // content_ids, content_name, content_type, contents, currency, value

    const pixelEventData: FacebookPixelEvent = await generateFacebookPixelEvent({
      event_name: addToCartPixel,
      content_ids: [product.sku],
      content_name: product.name,
      contents: [{ id: product.sku, quantity: product.qty }],
      value: (product.special_price || 0).toFixed(2),
      content_type,
      currency,
    });

    (window as any).dataLayer.push(event);
    (window as any).fbq("track", addToCartPixel, { ...pixelEventData }, { event: addToCartPixel, eventID: pixelEventData.event_id });
    await axios.post(PIXEL_URL, { data: [pixelEventData] });
  } catch (e) {}
};

export const trackRemoveFromCart = async (p: ProductType) => {
  try {
    const event = {
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
              quantity: p.qty,
            },
          ],
        },
      },
    };

    (window as any).dataLayer.push(event);
  } catch (e) {}
};

export const initCheckout = async (total: number, email: string, products: Array<ProductType>) => {
  try {
    const initiateCheckoutPixel = "InitiateCheckout";
    const initiateCheckoutGTM = "initiateCheckout ";
    const content_category = "product";
    const event = {
      event: initiateCheckoutGTM,
      ecommerce: {
        purchase: {
          actionField: {
            affiliation: "Tienda Sofía",
            revenue: total,
            tax: 0,
            shipping: 0,
            email,
          },
          products: products.map((p: ProductType, index: number) => ({
            name: p.name,
            id: p.sku,
            price: (p.special_price || 0).toFixed(2),
            brand: "Sofía",
            category: p.category_name,
            quantity: p.qty,
          })),
        },
      },
    };

    const pixelEventData: FacebookPixelEvent = await generateFacebookPixelEvent({
      event_name: initiateCheckoutPixel,
      content_category,
      content_ids: products.map(({ sku }: ProductType) => sku),
      contents: products.map(({ sku: id, qty: quantity }: ProductType) => {
        return { id, quantity };
      }),
      currency,
      num_items: products.length,
      content_type: "product",
      value: products.reduce((acc: number, { special_price, qty }: ProductType) => acc + special_price * (qty || 0), 0),
    });
    (window as any).dataLayer.push(event);
    (window as any).fbq("track", initiateCheckoutPixel, { ...pixelEventData }, { event: initiateCheckoutPixel, eventID: pixelEventData.event_id });
    await axios.post(PIXEL_URL, { data: [pixelEventData] });
  } catch (e) {}
};

export const trackOrder = async (order: TrackOrder, products: Array<ProductType>) => {
  try {
    const PurchasePixel = "Purchase";
    const PurchaseGTM = "purchase";
    const event = {
      event: PurchaseGTM,
      ecommerce: {
        purchase: {
          actionField: {
            id: order.increment_id,
            affiliation: "Tienda Sofía",
            revenue: order.total, // Total transaction value (incl. tax and shipping)
            tax: 0,
            shipping: 0,
            coupon: order.coupon,
            email: order.email,
          },
          products: products.map((p: ProductType, index: number) => ({
            name: p.name,
            id: p.sku,
            price: (p.special_price || 0).toFixed(2),
            brand: "Sofía",
            category: p.category_name,
            quantity: p.qty,
          })),
        },
      },
    };

    const pixelEventData: FacebookPixelEvent = await generateFacebookPixelEvent({
      event_name: PurchasePixel,
      contents: products.map(({ sku: id, stock: quantity }: ProductType) => {
        return { id, quantity };
      }),
      num_items: products.length,
      content_ids: products.map(({ sku }: ProductType) => sku),
      value: products.reduce((acc: number, { special_price, qty }: ProductType) => acc + special_price * (qty || 0), 0),
      content_type,
      currency,
    });
    (window as any).dataLayer.push(event);
    (window as any).fbq("track", PurchasePixel, { ...pixelEventData }, { event: PurchasePixel, eventID: pixelEventData.event_id });
    await axios.post(PIXEL_URL, { data: [pixelEventData] });
  } catch (e) {}
};

export const trackGoToCartEvent = async () => {
  try {
    const event = {
      event: "irCarrito",
    };

    (window as any).dataLayer.push(event);
  } catch (e) {}
};

export const trackRemoveCartEvent = async () => {
  try {
    const event = {
      event: "removerCarrito",
    };
    (window as any).dataLayer.push(event);
  } catch (e) {}
};

export const trackGoToCheckoutEvent = async () => {
  try {
    const event = {
      event: "irCheckout",
    };
    (window as any).dataLayer.push(event);
  } catch (e) {}
};
