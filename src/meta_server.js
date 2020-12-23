module.exports = {
  HOMEPAGE_TITLE: "Tienda Sofia - Homepage",
  PRODUCTS_TITLE: "Tienda Sofia - Productos",
  PRODUCT_TITLE: "Tienda Sofia -",
  CHECKOUT_TITLE: "Tienda Sofia - Checkout",
  MY_ACCOUNT_TITLE: "Tienda Sofia - Mi Cuenta",
  MY_ORDERS_TITLE: "Tienda Sofia - Mi Ordenes",
  FAQ_TITLE: "Tienda Sofia - Preguntas Frecuentes",
  TERMS_TITLE: "Tienda Sofia - Términos y Condiciones",
  GET_METADATA: `
  query Metadata($identifier: String!) {
    metadata(identifier: $identifier){
      page_id,
      title,
      identifier
    } 
  }`,
  GET_PRODUCT_METADATA:`
  query GetProductMetadata ($name: String!) {
    product(
      name: $name
      city: "SC"
      categories: false
      related: false
    ) {
      entity_id
      name
    }
  }
`
};
