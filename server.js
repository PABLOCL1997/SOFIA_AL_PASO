require("dotenv").config();
const express = require("express");
const compression = require("compression");
const fs = require("fs");
const app = express();
const GraphQLClient = require("graphql-request").GraphQLClient;
const redirectMiddleware = require("./src/redirect");
const client = new GraphQLClient("https://tienda.sofia.com.bo/graphql");
const cron = require("node-cron");
const { SitemapStream } = require("sitemap");
const axios = require("axios");
const port = process.env.PORT || 26235;
const base_url = process.env.BASE_URL;

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
  returnSchema,
} = require("./src/meta_server");

app.use(compression());

const loadPage = async (req, res, meta = {}) => {
  const PRODUCT = "product";
  let statusCode = 200;
  let metadata = {
    title: meta.title || "Tienda Sofia",
    meta_description: meta.title || "Tienda Sofia",
    meta_keywords: "",
  };

  let productSchema;
  let productPrice = 0;
  // add link cano/prev/next if products
  const fullUrl = "https://" + req.get("host") + req.originalUrl.split("?").shift();
  let relCanon = `<link rel="canonical" href="${fullUrl}" />`;
  let relPrev = "";
  let relNext = "";

  if (meta.title == "404") {
    statusCode = 404;
  }

  if (meta.rel) {
    const page = Number(req.query.p);
    const baseUrl = "https://" + req.get("host") + req.originalUrl.split("?").shift();

    if (isNaN(Number(page)) || page == 1) {
      const next = "?p=2";
      relNext = `<link rel="next" href="${baseUrl + next}" />`;
    }

    if (page >= 2) {
      const next = page + 1;
      const prev = page - 1;
      relCanon = `<link rel="canonical" href="${baseUrl + "?p=" + page}" />`;
      relPrev = `<link rel="prev" href="${baseUrl + "?p=" + prev}" />`;
      relNext = `<link rel="next" href="${baseUrl + "?p=" + next}" />`;
    }
  }
  if (req.params.category && meta.rel) {
    // determine de last level
    let lastlevel;

    const categoryName = toLink(String(req.params.category));
    try {
      const response = await client.request(GET_CATEGORIES, { city: "SC" });
      if (!response.categories) return res.status(404).redirect("/404");
      const catFound = search("name", categoryName, mapCategories(response.categories));
      if (catFound) lastlevel = catFound;
      if (!catFound) {
        statusCode = 404;
        req = rewriteRequest(req, "/404");
      }

      if (req.params.subcategory && statusCode != 404) {
        const s3Name = toLink(String(req.params.subcategory));
        const s3Found = search("name", s3Name, mapCategories(catFound.subcategories));
        if (s3Found) lastlevel = s3Found;
        if (!s3Found) {
          statusCode = 404;
          req = rewriteRequest(req, "/404");
        }

        if (req.params.lastlevel && statusCode != 404) {
          const s4Name = toLink(String(req.params.lastlevel));
          const s4Found = search("name", s4Name, mapCategories(s3Found.subcategories));
          if (s4Found) lastlevel = s4Found;
          if (!s4Found) {
            statusCode = 404;
            req = rewriteRequest(req, "/404");
          }
        }
      }
      if (lastlevel && lastlevel.entity_id) {
        const { entity_id } = lastlevel;
        const response = await client.request(GET_CATEGORY_META, { entity_id });

        if (response.categoryMetadata && response.categoryMetadata.meta_title && response.categoryMetadata.meta_description) {
          const {
            categoryMetadata: { meta_title, meta_description },
          } = response;
          metadata = { title: meta_title, meta_description, meta_keywords: "" };
        }
      }
    } catch (err) {
      // console.log('err', err)
    }
  }

  // GET METADATA for pages that is a single product
  if (meta.identifier && meta.identifier === PRODUCT) {
    try {
      const name = meta.prodName.toUpperCase().split(/-/g).join(" ");
      const response = await client.request(GET_PRODUCT_METADATA, {
        name,
      });
      if (!response.productMetadata) {
        statusCode = 404;
        req = rewriteRequest(req, "/404");
      }
      if (response.productMetadata && response.productMetadata.meta_title && response.productMetadata.meta_description) {
        const {
          productMetadata: { meta_title, meta_description },
        } = response;
        metadata = { title: meta_title, meta_description, meta_keywords: "" };
      }

      const p = await client.request(GET_PRODUCT_SCHEMA, {
        name,
        city: "SC",
        related: false,
        categories: false,
      });
      // this is because images comes all together and joined with ,
      const image = p.product.image.split(",")[0];
      metadata.meta_keywords = image;
      productPrice = p.product.special_price;

      if (p.product) {
        productSchema = p.product;
      }
    } catch (error) {
      // console.log(error)
      statusCode = 404;
    }
  }
  // GET METADATA for pages that isn't a single product
  if (meta.identifier && meta.identifier !== PRODUCT) {
    try {
      const res = await client.request(GET_METADATA, {
        identifier: meta.identifier,
      });
      if (res.metadata && res.metadata.title && res.metadata.meta_description) {
        metadata = { title: res.metadata.title, meta_description: res.metadata.meta_description, meta_keywords: "" };
      }
    } catch (error) {
      // console.log(error)
    }
  }
  const headOGTag = `<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# product: http://ogp.me/ns/product#">`;
  const headTag = `<head>`;
  const ogTypeProduct = "og:product";
  const ogProductPriceCurrency = "BOB";

  fs.readFile(`${__dirname}/build/index.html`, "utf8", (err, data) => {
    return res.status(statusCode).send(
      data
        .replace(/__OG_H1__/g, meta && !!meta.prodName ? String(meta.prodName).split(/-/g).join(" ").toUpperCase() : metadata.title)
        .replace(/__OG_TITLE__/g, metadata.title)
        .replace(/__OG_DESCRIPTION__/g, metadata ? metadata.meta_description : "")
        .replace(/__OG_IMAGE__/g, metadata ? metadata.meta_keywords : "")
        .replace(/__OG_TYPE__/g, meta.identifier && meta.identifier === PRODUCT ? ogTypeProduct : "")
        .replace(/__OG_URL__/g, meta.identifier && meta.identifier === PRODUCT ? fullUrl : "")
        .replace(/__PRODUCT_PRICE_CURRENCY__/g, meta.identifier && meta.identifier === PRODUCT ? ogProductPriceCurrency : "")
        .replace(/__PRODUCT_PRICE_AMOUNT__/g, meta.identifier && meta.identifier === PRODUCT ? productPrice : "")
        .replace(`<link rel="replace">`, meta.rel ? relCanon.concat(relPrev).concat(relNext) : relCanon)
        .replace(`<script id="replace-schema"></script>`, productSchema && meta.identifier && meta.identifier === PRODUCT ? returnSchema(productSchema, metadata.meta_description) : "")
        .replace(headTag, meta.identifier && meta.identifier === PRODUCT ? headOGTag : headTag)
    );
  });
};

app.use(redirectMiddleware);

app.get("/sitemap.xml", (req, res) => {
  var os = require("os");
  console.log(os.hostname());
  res.sendFile(`${__dirname}/public/media/sitemap.xml`);
});

app.get("/", (req, res) => loadPage(req, res, { title: HOMEPAGE_TITLE, identifier: "sofia-homepage" }));
app.use(
  express.static(__dirname + "/build", {
    setHeaders: (res, path) => {
      const hashRegExp = new RegExp("\\.[0-9a-f]{8}\\.");
      if (path.endsWith(".html")) {
        // All of the project's HTML files end in .html
        res.setHeader("Cache-Control", "no-cache");
      } else if (hashRegExp.test(path)) {
        // If the RegExp matched, then we have a versioned URL.
        res.setHeader("Cache-Control", "max-age=31536000");
      }
    },
  })
);
app.get("/productos", (req, res) => loadPage(req, res, { title: PRODUCTS_TITLE, identifier: "sofia-products", rel: true }));
app.get("/preguntas-frecuentes", (req, res) => loadPage(req, res, { title: FAQ_TITLE, identifier: "sofia-faq" }));
app.get("/terminos-y-condiciones", (req, res) => loadPage(req, res, { title: TERMS_TITLE, identifier: "sofia-tyc" }));
app.get("/mi-cuenta", (req, res) => loadPage(req, res, { title: MY_ACCOUNT_TITLE, identifier: "sofia-myaccount" }));
app.get("/mi-cuenta/ordenes", (req, res) => loadPage(req, res, { title: MY_ORDERS_TITLE }));
app.get("/checkout", (req, res) => loadPage(req, res, { title: CHECKOUT_TITLE, identifier: "sofia-checkout" }));
app.get("/404", (req, res) => loadPage(req, res, { title: "404" }));
app.get("/productos/:category", (req, res) =>
  loadPage(req, res, {
    title: `${PRODUCTS_TITLE} - ${fromLink(req.params.category)}`,
    rel: true,
  })
);
app.get("/productos/:category/:subcategory", (req, res) =>
  loadPage(req, res, {
    title: `${PRODUCTS_TITLE} - ${fromLink(req.params.category)} - ${fromLink(req.params.subcategory)}`,
    rel: true,
  })
);
app.get("/productos/:category/:subcategory/:lastlevel", (req, res) =>
  loadPage(req, res, {
    title: `${PRODUCTS_TITLE} - ${fromLink(req.params.category)} - ${fromLink(req.params.subcategory)} - ${fromLink(req.params.lastlevel)}`,
    rel: true,
  })
);
app.get("/:product", (req, res) => loadPage(req, res, { title: `${PRODUCT_TITLE} ${fromLink(req.params.product)}`, prodName: req.params.product, identifier: "product" }));

app.get("*", (req, res) => loadPage(req, res, { title: "" }));

const generateSitemap = async () => {
  let graphqlUrl = base_url + ":4000";
  try {
    let products = await axios({
      url: `${graphqlUrl}/graphql`,
      method: "post",
      data: {
        query: `
          query productsB2CSitemap {
              productsB2CSitemap {
                name
              }
            }
          `,
      },
    });

    let categories_data = await axios({
      url: `${graphqlUrl}/graphql`,
      method: "post",
      data: {
        query: `
          query CategoriesSitemap {
              categoriesSitemap {
                name
                entity_id
                parent_id
                level
              }
            }
          `,
      },
    });

    categories_data = categories_data.data.data.categoriesSitemap;
    let categories = categories_data
      .filter(({ level }) => level === 2)
      .map(({ name, entity_id }) => ({
        name,
        entity_id,
        subcategories: [],
      }));
    categories_data
      .filter(({ level }) => level === 3)
      .forEach(({ entity_id, parent_id, name }) => {
        let index = categories.findIndex((r) => r.entity_id === parent_id);
        if (categories[index]) {
          categories[index].subcategories.push({
            parent_id,
            entity_id,
            name,
            subcategories: [],
          });
        }
      });

    categories_data
      .filter(({ level }) => level === 4)
      .forEach(({ entity_id, parent_id, name }) => {
        let index = categories.findIndex((r) => r.subcategories.some((rr) => rr.entity_id === parent_id));
        let index2 = categories[index].subcategories.findIndex((r) => r.entity_id === parent_id);
        categories[index].subcategories[index2].subcategories.push({
          parent_id,
          entity_id,
          name,
        });
      });

    let categories_urls = [];
    categories.forEach((cat) => {
      let name = cat.name.replace(/\s+/g, "-").toLowerCase();
      categories_urls.push({ url: `/productos/${name}`, changefreq: "monthly", priority: 0.9 });
      cat.subcategories.forEach((subcat) => {
        let subname = subcat.name.replace(/\s+/g, "-").toLowerCase();
        categories_urls.push({ url: `/productos/${name}/${subname}`, changefreq: "monthly", priority: 0.9 });

        subcat.subcategories.forEach((subsubcat) => {
          let subsubname = subsubcat.name.replace(/\s+/g, "-").toLowerCase();
          categories_urls.push({ url: `/productos/${name}/${subname}/${subsubname}`, changefreq: "monthly", priority: 0.9 });
        });
      });
    });

    let products_urls = products.data.data.productsB2CSitemap.map((el) => {
      let name = el.name.replace(/\s+/g, "-").toLowerCase();
      return { url: `/${name}`, changefreq: "daily", priority: 1.0 };
    });

    const urls = [
      {
        url: base_url + "/",
        changefreq: "daily",
        priority: 1.0,
      },
      {
        url: `${base_url}/locales/es-ES/translation.json`,
        changefreq: "daily",
        priority: 0.9,
      },
      ...categories_urls,
      ...products_urls,
    ];

    const sitemap = new SitemapStream({ hostname: base_url });
    const writeStream = fs.createWriteStream(`${__dirname}/public/media/sitemap.xml`);
    sitemap.pipe(writeStream);
    urls.forEach((item) => sitemap.write(item));
    sitemap.end();
  } catch (e) {
    if (e.response && e.response.data) {
      console.log(e.response.data);
    } else {
      console.log(e);
    }
  }
};

cron.schedule("0 0 * * *", async () => {
  await generateSitemap();
});

app.listen(port, () => console.log(`Webapp on ::${port}`));
