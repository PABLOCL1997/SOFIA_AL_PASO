import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { persistCache } from "apollo-cache-persist";
import { setContext } from "apollo-link-context";
import { token } from "./utils/store";
import "./i18n";
import { GET_CART_ITEMS } from "./graphql/cart/queries";
import { GET_USER } from "./graphql/user/queries";
import { GET_CHECKOUT } from "./graphql/checkout/queries";
import { GET_MODALS } from "./graphql/modals/queries";
import { INITIAL_CHECKOUT } from "./hooks/useCheckout";
import { INITIAL_MODALS } from "./hooks/useModals";

export default async () => {
  const httpLink = createHttpLink({ uri: process.env.REACT_APP_GRAPHQL });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `${token.get()}`,
      },
    };
  });

  const cache = new InMemoryCache();

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: cache,
    typeDefs: gql`
      type User {
        cityKey: String!
        cityName: String!
        openCityModal: Boolean!
        openLoginModal: Boolean!
        openCartModal: Boolean!
        openAddressModal: Boolean!
        showError: String!
        showSuccess: String!
        showModal: String!
        isLoggedIn: Boolean!
        id: Int!
        defaultAddressId: Int
        defaultAddressLabel: String
        idPriceList: Int
        agency: String
        store: String
        coupon: String
        expressAltAddress: String
      }
      type Product {
        entity_id: Int!
        name: String!
        image: String!
        size: String!
        price: Float!
        special_price: Float!
        unit: String!
        category_name: String!
        qty: Int!
        stock: Int!
      }
      type Checkout {
        redirectToCheckout: Boolean!
        isGuestOrder: Boolean!
      }
      type Modals {
        showChooseUserType: Boolean!
        showRegisterModal: Boolean!
      }
      extend type Query {
        cartItems: [Product!]!
        userInfo: [User!]!
        checkout: Checkout!
        modals: Modals!
      }
      extend type Mutation {
        addToCart(product: Product!): [Product!]!
        deleteFromCart(product: Product!): [Product!]!
        emptyCart: [Product!]!
        addInfoToUser(user: User!): [User!]!
        addToCheckout(checkout: Checkout!): Checkout!
        addToModals(modals: Modals!): Modals!
      }
    `,
    resolvers: {
      Mutation: {
        addToCheckout: (_, { checkout }, { cache }) => {
          const queryResult = cache.readQuery({ query: GET_CHECKOUT });
          if (queryResult) {
            const newCheckout = {
              ...queryResult.checkout,
              ...checkout,
            }
            cache.writeQuery({ 
              query: GET_CHECKOUT,
              data: { checkout: newCheckout } 
            });
            return newCheckout;
          }
          return INITIAL_CHECKOUT;
        },  
        addToModals: (_, { modals }, { cache }) => {
          const queryResult = cache.readQuery({ query: GET_MODALS });
          if (queryResult) {
            const newModals = {
              ...queryResult.modals,
              ...modals,
            }
            cache.writeQuery({ 
              query: GET_MODALS,
              data: { modals: newModals } 
            });
            return newModals;
          }
          return INITIAL_MODALS;
        },   
        addInfoToUser: (_, { user }, { cache }) => {
          const queryResult = cache.readQuery({ query: GET_USER });
          if (queryResult) {
            let { userInfo } = queryResult;
            const data = [{ ...userInfo[0], ...user }];
            userInfo = data;
            cache.writeQuery({ query: GET_USER, data: { userInfo } });
            return data;
          }
          return [];
        },
        addToCart: (_, { product }, { cache }) => {
          const queryResult = cache.readQuery({ query: GET_CART_ITEMS });
          if (queryResult) {
            let { cartItems } = queryResult;
            const item = cartItems.findIndex((p) => p.entity_id === product.entity_id);
            if (item >= 0) {
              if (product.replace && cartItems[item].qty === product.qty) return cartItems;

              if (!product.replace) {
                product.qty = Number(product.qty) + Number(cartItems[item].qty);
              }

              cartItems.splice(item, 1);
            }

            product.price = Number(product.price);
            product.fullprice = Number(product.fullprice);
            product.special_price = Number(product.special_price);

            cartItems = [...cartItems, product];
            cache.writeQuery({ query: GET_CART_ITEMS, data: { cartItems } });

            return cartItems;
          }
          return [];
        },
        deleteFromCart: (_, { product }, { cache }) => {
          const queryResult = cache.readQuery({ query: GET_CART_ITEMS });
          if (queryResult) {
            let { cartItems } = queryResult;
            const item = cartItems.findIndex((p) => p.entity_id === product.entity_id);
            if (item >= 0) {
              cartItems.splice(item, 1);
            }
            cartItems = [...cartItems];
            cache.writeQuery({ query: GET_CART_ITEMS, data: { cartItems } });
            return cartItems;
          }
          return [];
        },
        emptyCart: (_, data, { cache }) => {
          const queryResult = cache.readQuery({ query: GET_CART_ITEMS });
          if (queryResult) {
            let { cartItems } = queryResult;
            cartItems = [];
            cache.writeQuery({ query: GET_CART_ITEMS, data: { cartItems } });
            return cartItems;
          }
          return [];
        },
      },
    },
  });

  const initData = { 
    cartItems: [], 
    userInfo: [],
    checkout: INITIAL_CHECKOUT,
    modals: INITIAL_MODALS,
  };

  cache.writeData({ data: initData });

  await persistCache({
    cache,
    storage: window.localStorage,
    key: process.env.REACT_APP_CACHE_NAME,
  });

  return client;
};
