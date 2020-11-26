const urls = [
    {
        urlFrom: "/matambre-de-cerdo-congelado-en-bandeja",
        urlTo:"/productos/cerdo/bandejas"
    },
    {
        urlFrom: "/pate-de-higado-de-pollo-de-100-grs",
        urlTo:"/pat%C3%A9-de-h%C3%ADgado-de-pollo-de-100-grs."
    },
    {
        urlFrom: "/carne-de-pollo/pollo-emb-frial-mediano",
        urlTo:"/pollo-embolsado-frial-mediano"
    },
    {
        urlFrom: "/embutidos/p-u-jamon-light-de-pollo-al-vacio-250-grs",
        urlTo:"/jam%C3%B3n-light-de-pollo-al-vac%C3%ADo-250-grs"
    },
    {
        urlFrom: "/carne-de-pollo/filetes-en-bandeja",
        urlTo:"/filetes-en-bandeja"
    },
    {
        urlFrom: "/preparados/tenders-de-pollo",
        urlTo:"/tenders-de-pollo-yo-chef"
    },
    {
        urlFrom: "/preparados/milanesa-de-pollo-caja",
        urlTo:"/milanesa-de-pollo-4-unidades"
    },
    {
        urlFrom: "/carne-de-pollo/muslos-en-bandeja",
        urlTo:"/muslos-en-bandeja"
    },
    {
        urlFrom: "/preparados/pack-1-milanesas-americana-pollo",
        urlTo:"/milanesa-americana-de-pollo-2-unidades"
    },
    {
        urlFrom: "/preparados/pu-pollo-relleno-con-arroz-a-la-valenciana-en-caja",
        urlTo:"/pollo-relleno-con-arroz-a-la-valenciana-yo-chef"
    },
    {
        urlFrom: "/preparados/apollo-nuggets-con-quinua",
        urlTo:"/apollo-nuggets-con-quinua-260-grs"
    },
    {
        urlFrom: "/embutidos/mini-salchicha-de-pollo-al-vacio-20-und",
        urlTo:"/mini-salchicha-de-pollo-al-vac%C3%ADo-(20-und)"
    },
    {
        urlFrom: "/carne-de-pollo/alas-en-bandeja",
        urlTo:"/alas-en-bandeja"
    },
    {
        urlFrom: "/carne-de-pollo/pechuga-en-bandeja",
        urlTo:"/pechuga-en-bandeja"
    },
    {
        urlFrom: "/preparados/desmenuzado-de-pollo",
        urlTo:"/pollo-desmenuzado"
    },
    {
        urlFrom: "/preparados/p-u-pollo-relleno-en-caja",
        urlTo:"/pollo-relleno-yo-chef"
    },
    {
        urlFrom: "/carne-de-pollo/piernas-en-bandeja",
        urlTo:"/piernas-en-bandeja"
    }
] 

function redirectMiddleware(req, res, next) {
    let match;
    urls.forEach(url => {
        if (req.path === url.urlFrom) {
            match = url.urlFrom
            res.redirect(url.urlTo)
        }
    })
    if (!match) {
        next()
    }
}

module.exports = redirectMiddleware