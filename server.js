const express = require("express");
const compression = require('compression')
const fs = require("fs");
const app = express();
const GraphQLClient = require("graphql-request").GraphQLClient
const redirectMiddleware = require('./src/redirect')
const client = new GraphQLClient("http://localhost:4000/graphql")
const port = process.env.PORT || 26235;


const {
  GET_METADATA,
  GET_PRODUCT_METADATA,
  HOMEPAGE_TITLE,
  PRODUCTS_TITLE,
  PRODUCT_TITLE,
  CHECKOUT_TITLE,
  MY_ACCOUNT_TITLE,
  MY_ORDERS_TITLE,
  FAQ_TITLE,
  TERMS_TITLE,
  GET_CATEGORIES,
  GET_CATEGORY_META,
  GET_PRODUCT_SCHEMA,
  fromLink,
  toLink,
  mapCategories,
  search,
  rewriteRequest,
  returnSchema
} = require("./src/meta_server");

app.use(compression())

const loadPage = async (req, res, meta = {}) => {
  const PRODUCT = "product"
  let statusCode = 200
  let metadata = {
    title: meta.title || "Tienda Sofia",
    meta_description: meta.title || "Tienda Sofia",
    meta_keywords: ""
  }

  let productSchema;
  // add link cano/prev/next if products
  const fullUrl = 'https://' + req.get('host') + req.originalUrl.split("?").shift();
  let relCanon = `<link rel="canonical" href="${fullUrl}" />`
  let relPrev = ""
  let relNext = ""

  if (meta.title == "404"){
    statusCode = 404
  }

  if(meta.rel) {
    const page = Number(req.query.p)
    const baseUrl = 'https://' + req.get('host') + req.originalUrl.split("?").shift() 

    if (isNaN(Number(page)) || page == 1) {
      const next = "?p=2"
      relNext = `<link rel="next" href="${baseUrl + next}" />`  
    }
    
    if (page >= 2) {
      const next = page + 1
      const prev = page - 1
      relCanon = `<link rel="canonical" href="${baseUrl + '?p=' + page}" />`  
      relPrev =  `<link rel="prev" href="${baseUrl + '?p=' + prev}" />`
      relNext =  `<link rel="next" href="${baseUrl + '?p=' + next}" />`
    }
  }
  if (req.params.category && meta.rel){
    // determine de last level
    let lastlevel

    const categoryName = toLink(String(req.params.category))
    try {
      const response = await client.request(GET_CATEGORIES, { city: "SC" })
      if(!response.categories) return res.status(404).redirect("/404")
      const catFound = search('name', categoryName, mapCategories(response.categories))
      if (catFound) lastlevel = catFound
      if (!catFound) {
        statusCode = 404
        req = rewriteRequest(req, '/404')
      }
  
      if (req.params.subcategory && statusCode != 404) {
        const s3Name = toLink(String(req.params.subcategory))
        const s3Found = search('name', s3Name, mapCategories(catFound.subcategories))
        if (s3Found) lastlevel = s3Found
        if (!s3Found) {
          statusCode = 404
          req = rewriteRequest(req, '/404')

        }
        
        if (req.params.lastlevel && statusCode != 404){
          const s4Name = toLink(String(req.params.lastlevel))
          const s4Found = search('name', s4Name, mapCategories(s3Found.subcategories))
          if (s4Found) lastlevel = s4Found
          if (!s4Found) {
            statusCode = 404
            req = rewriteRequest(req, '/404')
          }
        }
      }
      if (lastlevel && lastlevel.entity_id) {
        const { entity_id } = lastlevel
        const response = await client.request(GET_CATEGORY_META, { entity_id })

        if (response.categoryMetadata && response.categoryMetadata.meta_title && response.categoryMetadata.meta_description) {
          const { categoryMetadata: { meta_title, meta_description } } = response
          metadata = { title: meta_title, meta_description, meta_keywords: "" }
        }
      }
    }catch (err) {
      console.log('err', err)
    }
  }

  // GET METADATA for pages that is a single product
  if (meta.identifier && meta.identifier === PRODUCT) {
    try {
      const name = meta.prodName.toUpperCase().split(/-/g).join(" ")
      const response = await client.request(GET_PRODUCT_METADATA, {
        name
      })
      if (!response.productMetadata) {
        statusCode = 404
        req = rewriteRequest(req, '/404')
      }
      if (response.productMetadata && response.productMetadata.meta_title && response.productMetadata.meta_description) {
        const { productMetadata: { meta_title, meta_description } } = response
        metadata = { title: meta_title, meta_description, meta_keywords: "" }
      }

      const p = await client.request(GET_PRODUCT_SCHEMA, {
        name,
        city: "SC",
        related: false,
        categories: false
      })
      if (p.product) {
        productSchema = p.product
      }
    } catch (error) {
      console.log(error)
      statusCode = 404
    }
  }
  // GET METADATA for pages that isn't a single product
  if (meta.identifier && meta.identifier !== PRODUCT) {

    try {
      const res = await client.request(GET_METADATA, {
        identifier: meta.identifier
      })
      if (res.metadata && res.metadata.title && res.metadata.meta_description) {
        metadata = {title: res.metadata.title, meta_description: res.metadata.meta_description, meta_keywords: ""}
      }
    } catch (error) {
      console.log(error)
    }
  }
  fs.readFile(`${__dirname}/build/index.html`, "utf8", (err, data) => {
    return res.status(statusCode).send(
      data
        .replace(/__OG_TITLE__/g, metadata.title)
        .replace(/__OG_DESCRIPTION__/g, metadata ? metadata.meta_description : '')
        .replace(/__OG_IMAGE__/g, metadata ? metadata.meta_keywords : '')
        .replace(/__OG_H1__/g, meta && !!meta.prodName ? String(meta.prodName).split(/-/g).join(" ").toUpperCase() : metadata.title)
        .replace(`<link rel="replace">`, meta.rel ? relCanon.concat(relPrev).concat(relNext) : relCanon)
        .replace(`<script id="replace-schema"></script>`, productSchema && meta.identifier && meta.identifier === PRODUCT ? returnSchema(productSchema, metadata.meta_description) : "" )
    )
  });
};

app.use(redirectMiddleware)
app.get("/", (req, res) => loadPage(req, res, { title: HOMEPAGE_TITLE, identifier: "sofia-homepage" }));
app.use(express.static(__dirname + "/build", {
  setHeaders: (res, path) => {
    const hashRegExp = new RegExp('\\.[0-9a-f]{8}\\.');

    if (path.endsWith('.html')) {
      // All of the project's HTML files end in .html
      res.setHeader('Cache-Control', 'no-cache');
    } else if (hashRegExp.test(path)) {
      // If the RegExp matched, then we have a versioned URL.
      res.setHeader('Cache-Control', 'max-age=31536000');
    }
  },
}));
app.get("/productos", (req, res) => loadPage(req, res, { title: PRODUCTS_TITLE, identifier: "sofia-products", rel: true }));
app.get("/preguntas-frecuentes", (req, res) => loadPage(req, res, { title: FAQ_TITLE, identifier: "sofia-faq" }));
app.get("/terminos-y-condiciones", (req, res) => loadPage(req, res, { title: TERMS_TITLE, identifier: "sofia-tyc" }));
app.get("/mi-cuenta", (req, res) => loadPage(req, res, { title: MY_ACCOUNT_TITLE, identifier: "sofia-myaccount" }));
app.get("/mi-cuenta/ordenes", (req, res) =>
  loadPage(req, res, { title: MY_ORDERS_TITLE })
);
app.get("/checkout", (req, res) => loadPage(req, res, { title: CHECKOUT_TITLE, identifier: "sofia-checkout" }));
app.get("/404", (req, res)=> loadPage(req, res, { title: "404" }))
app.get("/productos/:category", (req, res) =>
  loadPage(req, res, {
    title: `${PRODUCTS_TITLE} - ${fromLink(req.params.category)}`,
    rel: true
  })
);
app.get("/productos/:category/:subcategory", (req, res) =>
  loadPage(req, res, {
    title: `${PRODUCTS_TITLE} - ${fromLink(req.params.category)} - ${fromLink(
      req.params.subcategory
    )}`,
    rel: true
  })
);
app.get("/productos/:category/:subcategory/:lastlevel", (req, res) =>
  loadPage(req, res, {
    title: `${PRODUCTS_TITLE} - ${fromLink(req.params.category)} - ${fromLink(
      req.params.subcategory
    )} - ${fromLink(req.params.lastlevel)}`,
    rel: true
  })
);
app.get("/:product", (req, res) =>
  loadPage(req, res, { title: `${PRODUCT_TITLE} ${fromLink(req.params.product)}`, prodName: req.params.product, identifier: "product" })
);

app.get("*", (req, res) => loadPage(req, res, { title: "" }));



app.listen(port, () => console.log(`Webapp on ::${port}`));
