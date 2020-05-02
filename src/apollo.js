import gql from 'graphql-tag';
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { persistCache, CachePersistor } from 'apollo-cache-persist';
import { setContext } from 'apollo-link-context'
import { token } from './utils/store';
import './i18n';
import { GET_CART_ITEMS } from './graphql/cart/queries';

const httpLink = createHttpLink({ uri: 'http://localhost:4000/graphql' })

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            Authorization: `${token.get()}`
        }
    }
})

const cache = new InMemoryCache();

persistCache({
    cache,
    storage: window.localStorage,
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: cache,
    typeDefs: gql`
        type Product {
            entity_id: Int!,
            name: String!,
            image: String!,
            size: String!,
            price: Float!,
            special_price: Float!,
            unit: String!,
            category_name: String!,
            qty: Int!,
            stock: Int!
        }
        extend type Query {
            cartItems: [Product!]!
        }
        extend type Mutation {
            addToCart(product: Product!): [Product!]!
        }
  `,
    resolvers: {
        Mutation: {
            addToCart: (_, { product }, { cache }) => {
                const queryResult = cache.readQuery({ query: GET_CART_ITEMS });
                if (queryResult) {
                    let { cartItems } = queryResult;
                    const item = cartItems.findIndex((p) => p.entity_id === product.entity_id);
                    if (item >= 0) {
                        product.qty = cartItems[item].qty + product.qty;
                        cartItems.splice(item, 1);
                    }
                    cartItems = [...cartItems, product];
                    cache.writeQuery({ query: GET_CART_ITEMS, data: { cartItems } });
                    return cartItems;
                }
                return [];
            },
        },
    }
});

cache.writeData({
    data: {
        cartItems: [],
    },
});

export default client;
