const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 26235;
const {
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

const loadPage = (res, meta = {}) => {
  fs.readFile(`${__dirname}/build/index.html`, "utf8", (err, data) => {
    res.send(
      data
        .replace(/__OG_TITLE__/g, meta.title || "Tienda Sofia")
        .replace(/__OG_DESCRIPTION__/g, meta.description || "Tienda Sofia")
        .replace(/__OG_IMAGE__/g, meta.image || "")
    );
  });
};

app.get("/", (req, res) => loadPage(res, { title: HOMEPAGE_TITLE }));
app.use(express.static(__dirname + "/build"));
app.get("/productos", (req, res) => loadPage(res, { title: PRODUCTS_TITLE }));
app.get("/preguntas-frecuentes", (req, res) =>
  loadPage(res, { title: FAQ_TITLE })
);
app.get("/terminos-y-condiciones", (req, res) =>
  loadPage(res, { title: TERMS_TITLE })
);
app.get("/mi-cuenta", (req, res) => loadPage(res, { title: MY_ACCOUNT_TITLE }));
app.get("/mi-cuenta/ordenes", (req, res) =>
  loadPage(res, { title: MY_ORDERS_TITLE })
);
app.get("/checkout", (req, res) => loadPage(res, { title: CHECKOUT_TITLE }));
app.get("/productos/:category", (req, res) =>
  loadPage(res, {
    title: `${PRODUCTS_TITLE} - ${fromLink(req.params.category)}`
  })
);
app.get("/productos/:category/:subcategory", (req, res) =>
  loadPage(res, {
    title: `${PRODUCTS_TITLE} - ${fromLink(req.params.category)} - ${fromLink(
      req.params.subcategory
    )}`
  })
);
app.get("/productos/:category/:subcategory/:lastlevel", (req, res) =>
  loadPage(res, {
    title: `${PRODUCTS_TITLE} - ${fromLink(req.params.category)} - ${fromLink(
      req.params.subcategory
    )} - ${fromLink(req.params.lastlevel)}`
  })
);
app.get("/:product", (req, res) =>
  loadPage(res, { title: `${PRODUCT_TITLE} ${fromLink(req.params.product)}` })
);

app.get("*", (req, res) => loadPage(res));
app.listen(port, () => console.log(`Webapp on ::${port}`));
