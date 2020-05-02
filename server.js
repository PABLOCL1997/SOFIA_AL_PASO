const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 26235;
const { HOMEPAGE_TITLE, PRODUCTS_TITLE, PRODUCT_TITLE, CHECKOUT_TITLE } = require('./src/meta_server');

const fromLink = (str) => {
    return str ? str
        .split(/-/g).map(word =>
            `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`)
        .join(" ") : ''
}

const loadPage = (res, meta = {}) => {
    fs.readFile(`${__dirname}/build/index.html`, 'utf8', (err, data) => {
        res.send(data
            .replace(/__OG_TITLE__/g, meta.title || 'Tienda Sofia')
            .replace(/__OG_DESCRIPTION__/g, meta.description || 'Tienda Sofia')
            .replace(/__OG_IMAGE__/g, meta.image || ''));
    });
}

app.use(express.static(__dirname + '/build'));

// <!-- ROUTES
app.get('/', (req, res) => loadPage(res, { title: HOMEPAGE_TITLE }));
app.get('/productos', (req, res) => loadPage(res, { title: PRODUCTS_TITLE }));
app.get('/checkout', (req, res) => loadPage(res, { title: CHECKOUT_TITLE }));
app.get('/productos/:category', (req, res) => loadPage(res, { title: `${PRODUCTS_TITLE} - ${fromLink(req.params.category)}` }));
app.get('/:product', (req, res) => loadPage(res, { title: `${PRODUCT_TITLE} ${fromLink(req.params.product)}` }));
// ROUTES -->

app.get('*', (req, res) => loadPage(res));
app.listen(port, () => console.log(`Webapp on ::${port}`));