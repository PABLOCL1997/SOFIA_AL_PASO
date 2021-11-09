module.exports = {
  returnSchema: (product, description) => {
    const { name, sku, image, price, stock } = product;
    const availability = stock > 0 ? "InStock" : "OutOfStock";
    const [firstImage, secondaryImage] = image.split(",");
    return `
      <script type="application/ld+json">
      {
        "@context": "http://schema.org/",
        "@type": "Product",
        "name": "${name}",
        "image": ["${firstImage}", "${secondaryImage ? secondaryImage : firstImage}"],
        "description": "${description}",
        "sku": "${sku}",
        "mpn": false,
        "brand": {
          "@type": "Brand",
          "name": "Tienda Sofia"
        },
        "offers": {
          "@type": "Offer",
          "url": "https://tienda.sofia.com.bo/${name.toLowerCase().replace(/ /g, "-")}",
          "priceCurrency" : "BOB",
          "price": "${price}",
          "itemCondition": "New",
          "availability": "${availability}"
        }
      }
      </script>    
    `;
  },
  rewriteRequest: (req, newUrl) => {
    req.originalUrl = newUrl;
    req.path = newUrl;
    return req;
  },
  toLink: (str) => {
    return str ? str.toLowerCase().replace(/ /g, "-") : "";
  },
  mapCategories: (categories) => {
    return categories.map((sc) => {
      return { ...sc, name: String(sc.name).toLowerCase().replace(/ /g, "-") };
    });
  },
  capitalizeFirstLetter: (string) => {
    var splitStr = string.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  },
  search: (nameKey, nameValue, myArray) => {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i][nameKey] === nameValue) {
        return myArray[i];
      }
    }
  },
  fromLink: (str) => {
    return str
      ? str
          .split(/-/g)
          .map((word) => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`)
          .join(" ")
      : "";
  },
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
      meta_description
    } 
  }`,
  GET_PRODUCT_METADATA: `
  query productMetadata($name: String!) {
    productMetadata(name:$name){
      name
      meta_title
      meta_description
    }
  }
  `,
  GET_PRODUCT_SCHEMA: `
  query Product(
    $name: String!
    $city: String!
    $categories: Boolean
    $related: Boolean
  ) {
    product(
      name: $name
      city: $city
      categories: $categories
      related: $related
    ) {
      entity_id
      name
      sku
      image
      price
      fullprice
      special_price
      stock
    }
  }  
  `,
  GET_CATEGORIES: `
  query Categories ($city: String!) {
    categories (city:$city) {
      entity_id
      name
      subcategories {
        entity_id
        name
        subcategories {
            entity_id
            name
        }
      }
    }
  }
  `,
  GET_CATEGORY_META: `
  query CategoryMetadata ($entity_id: Int!) {
    categoryMetadata(entity_id:$entity_id){
      name
      meta_title
      meta_description
      meta_keywords
    }
  }
  `,
};
