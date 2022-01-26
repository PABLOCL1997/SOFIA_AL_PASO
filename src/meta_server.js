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
  HOMEPAGE_TITLE: "Sofía al Paso: Envío a domicilio. Pagá como más te convenga",
  COLLABORATORS_TITLE: "Sofía al Paso: Beneficios para Colaboradores y Convenios",
  FAQ_TITLE: "Sofía al Paso: Preguntas Frecuentes. ¡Estamos para ayudarte!",
  CONTACT_TITLE: "Contacta con Sofía al Paso: Cuéntanos tus Dudas y Sugerencias",
  COVERAGE_TITLE: "Conoce la Cobertura de Envíos de Sofía al Paso",
  PRODUCTS_TITLE: "Sofía al Paso - Productos",
  PRODUCT_TITLE: "Sofía al Paso -",
  CHECKOUT_TITLE: "Sofía al Paso - Checkout",
  MY_ACCOUNT_TITLE: "Sofía al Paso - Mi Cuenta",
  MY_ORDERS_TITLE: "Sofía al Paso - Mi Ordenes",
  TERMS_TITLE: "Sofía al Paso - Términos y Condiciones",
  RETIRO_TITLE: "Sofía al Paso - Retiro al paso",
  HOMEPAGE_DESCRIPTION: "En Sofía al Paso encontrarás la más deliciosa carne y los mejores productos alimenticios. ¡Descubre por qué las familias bolivianas nos eligen día a día!",
  COLLABORATORS_DESCRIPTION: "Descubre los mejores beneficios y descuentos para convenios corporativos y colaboradores internos. ¡Entra y activa tus beneficios en Sofía al Paso!",
  FAQ_DESCRIPTION: "Trabajamos día a día para estar cerca de los hogares bolivianas con alimentos de alta calidad e inocuidad. ¡Entra, resuelve tus dudas y compra online!",
  CONTACT_DESCRIPTION: "¿No encuentras lo que buscas? Este es el espacio de Sofía al Paso en el que nos puedes escribir y nos pondremos en contacto contigo. En Sofía, se confía.",
  COVERAGE_DESCRIPTION: "Entra y mira el mapa con la cobertura de envíos de Sofía al Paso en las ciudades de Cochabamba, El Alto, La Paz, y Santa Cruz.",  
  CART_TITLE: "Sofía al Paso - Carrito",
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
