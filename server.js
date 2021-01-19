const express = require("express");
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
  TERMS_TITLE
} = require("./src/meta_server");

const fromLink = str => {
  return str
    ? str
      .split(/-/g)
      .map(
        word => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`
      )
      .join(" ")
    : "";
};

const loadPage = async (req, res, meta = {}) => {
  let metadata = {
    title: meta.title || "Tienda Sofia",
    meta_description: meta.title || "Tienda Sofia",
    meta_keywords: ""
  }
  // add link cano/prev/next if products
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let relCanon 
  let relPrev
  let relNext
  relCanon = relPrev = relNext = fullUrl
  if(meta.rel) {
    const page = Number(req.query.p)

    if (isNaN(Number(page))) {
      const next = "&p=2"
      relNext = fullUrl + next 
    }
    
    if (page == 1) {
      const next = page + 1
      relNext = fullUrl.slice(0, -1) + next
    }
    
    if (page >= 2) {
      const next = page + 1
      const prev = page - 1
      relPrev = fullUrl.slice(0, -1) + prev
      relNext = fullUrl.slice(0, -1) + next
    }
  }

  // GET METADATA for pages that is a single product
  if (meta.identifier && meta.identifier === "product") {
    try {
      const name = meta.prodName.toUpperCase().split(/-/g).join(" ")
      const res = await client.request(GET_PRODUCT_METADATA, {
        name
      })
      if (res.productMetadata && res.productMetadata.meta_title && res.productMetadata.meta_description) {
        const { productMetadata: { meta_title, meta_description } } = res
        metadata = { title: meta_title, meta_description, meta_keywords: "" }
      }
    } catch (error) {
      console.log(error)
    }
  }
  // GET METADATA for pages that isn't a single product
  if (meta.identifier && meta.identifier !== "product") {
    try {
      const res = await client.request(GET_METADATA, {
        identifier: meta.identifier
      })
      if (res.metadata && res.metadata.title && res.metadata.meta_description && res.metadata.meta_keywords) {
        metadata = res.metadata
      }
    } catch (error) {
      console.log(error)
    }
  }
  fs.readFile(`${__dirname}/build/index.html`, "utf8", (err, data) => {
    res.send(
      data
        .replace(/__OG_TITLE__/g, metadata ? metadata.title : meta.title)
        .replace(/__OG_DESCRIPTION__/g, metadata ? metadata.meta_description : '')
        .replace(/__OG_IMAGE__/g, metadata ? metadata.meta_keywords : '')
        .replace(/__OG_H1__/g, meta && !!meta.prodName ? String(meta.prodName).split(/-/g).join(" ").toUpperCase() : metadata.title)
        .replace(/__REL_CANON__/g, relCanon)
        .replace(/__REL_PREV__/g, relPrev)
        .replace(/__REL_NEXT__/g, relNext)     
    )
  });
};

app.use(redirectMiddleware)
app.use(express.static(__dirname + "/build"));
app.get("/", (req, res) => loadPage(req, res, { title: HOMEPAGE_TITLE, identifier: "sofia-homepage" }));
app.get("/productos", (req, res) => loadPage(req, res, { title: PRODUCTS_TITLE, identifier: "sofia-products", rel: true }));
app.get("/preguntas-frecuentes", (req, res) => loadPage(req, res, { title: FAQ_TITLE, identifier: "sofia-faq" }));
app.get("/terminos-y-condiciones", (req, res) => loadPage(req, res, { title: TERMS_TITLE, identifier: "sofia-tyc" }));
app.get("/mi-cuenta", (req, res) => loadPage(req, res, { title: MY_ACCOUNT_TITLE, identifier: "sofia-myaccount" }));
app.get("/mi-cuenta/ordenes", (req, res) =>
  loadPage(req, res, { title: MY_ORDERS_TITLE })
);
app.get("/checkout", (req, res) => loadPage(req, res, { title: CHECKOUT_TITLE, identifier: "sofia-checkout" }));
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

app.get("*", (req, res) => loadPage(req, res, { title: "404" }));

app.listen(port, () => console.log(`Webapp on ::${port}`));
