const urls = [
    {
        urlFrom: "/pate-de-higado-de-pollo-de-100-grs",
        urlTo: "/pat%C3%A9-de-h%C3%ADgado-de-pollo-de-100-grs."
    },
    {
        urlFrom: "/carne-de-pollo/pollo-emb-frial-mediano",
        urlTo: "/pollo-embolsado-frial-mediano"
    },
    {
        urlFrom: "/embutidos/p-u-jamon-light-de-pollo-al-vacio-250-grs",
        urlTo: "/jam%C3%B3n-light-de-pollo-al-vac%C3%ADo-250-grs"
    },
    {
        urlFrom: "/carne-de-pollo/filetes-en-bandeja",
        urlTo: "/filetes-en-bandeja"
    },
    {
        urlFrom: "/preparados/tenders-de-pollo",
        urlTo: "/tenders-de-pollo-yo-chef"
    },
    {
        urlFrom: "/preparados/milanesa-de-pollo-caja",
        urlTo: "/milanesa-de-pollo-4-unidades"
    },
    {
        urlFrom: "/carne-de-pollo/muslos-en-bandeja",
        urlTo: "/muslos-en-bandeja"
    },
    {
        urlFrom: "/preparados/pack-1-milanesas-americana-pollo",
        urlTo: "/milanesa-americana-de-pollo-2-unidades"
    },
    {
        urlFrom: "/preparados/pu-pollo-relleno-con-arroz-a-la-valenciana-en-caja",
        urlTo: "/pollo-relleno-con-arroz-a-la-valenciana-yo-chef"
    },
    {
        urlFrom: "/preparados/apollo-nuggets-con-quinua",
        urlTo: "/apollo-nuggets-con-quinua-260-grs"
    },
    {
        urlFrom: "/embutidos/mini-salchicha-de-pollo-al-vacio-20-und",
        urlTo: "/mini-salchicha-de-pollo-al-vac%C3%ADo-(20-und)"
    },
    {
        urlFrom: "/carne-de-pollo/alas-en-bandeja",
        urlTo: "/alas-en-bandeja"
    },
    {
        urlFrom: "/carne-de-pollo/pechuga-en-bandeja",
        urlTo: "/pechuga-en-bandeja"
    },
    {
        urlFrom: "/preparados/desmenuzado-de-pollo",
        urlTo: "/pollo-desmenuzado"
    },
    {
        urlFrom: "/preparados/p-u-pollo-relleno-en-caja",
        urlTo: "/pollo-relleno-yo-chef"
    },
    {
        urlFrom: "/carne-de-pollo/piernas-en-bandeja",
        urlTo: "/piernas-en-bandeja"
    },
    {
        urlFrom: "/preparados",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/nuggets-dino-500-grs",
        urlTo: "/productos?q=nuggets"
    },
    {
        urlFrom: "/milanesa-cordon-bleu-4-unidades",
        urlTo: "/milanesa-cordon-bleu-4-unidades"
    },
    {
        urlFrom: "/fiambres",
        urlTo: "/productos/fiambres"
    },
    {
        urlFrom: "/embutidos-premium/chorizo-butifarra-kostlich-skin",
        urlTo: "/productos/embutidos-premium"
    },
    {
        urlFrom: "/carne-de-pollo",
        urlTo: "/productos/pollo"
    },
    {
        urlFrom: "/carne-de-cerdo/pork-belly-de-cerdo-congelado-en-bandeja-as",
        urlTo: "/productos/cerdo/bandejas"
    },
    {
        urlFrom: "/carne-de-cerdo",
        urlTo: "/productos/cerdo/bandejas"
    },
    {
        urlFrom: "/bife-en-bandeja",
        urlTo: "/bife-en-bandeja"
    },
    {
        urlFrom: "/pack-grande-san-juan",
        urlTo: "/"
    },
    {
        urlFrom: "/pack-res-san-juan-con-salsa",
        urlTo: "/"
    },
    {
        urlFrom: "/pack-xl-de-res-san-juan",
        urlTo: "/"
    },
    {
        urlFrom: "/pack-res-xl-san-juan-con-salsa",
        urlTo: "/"
    },
    {
        urlFrom: "/pack-frankfurt-san-juan-con-salsa",
        urlTo: "/productos/embutidos/salchichas"
    },
    {
        urlFrom: "/pack-frankfurt-xl-san-juan-con-salsa",
        urlTo: "/productos/embutidos/salchichas"
    },
    {
        urlFrom: "/pack-clasico-de-res-san-juan",
        urlTo: "/"
    },
    {
        urlFrom: "/pack-peque-o-san-juan",
        urlTo: "/"
    },
    {
        urlFrom: "/pack-chorizo-de-res-con-salsa",
        urlTo: "/"
    },
    {
        urlFrom: "/carne-de-cerdo/bife-de-cerdo-congelado-en-bandeja",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/chuleta-de-cerdo-congelado-en-bandeja",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/cochinillo-tipo-segoviano",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/costilla-peque-a-de-cerdo-con-cuero-a-granel",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/lechon-entero",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/lomo-de-cerdo-congelado-en-bandeja",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/lomo-peque-o-de-cerdo-congelado-a-granel",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/matambre-de-cerdo-congelado-en-bandeja",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/medallones-de-lomito-de-cerdo-congelado-en-bandeja",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/pork-belly-de-cerdo-congelado-en-bandeja-as",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/pork-belly-de-cerdo-en-tira-a-granel",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/punta-de-s-de-cerdo-congelado-en-bandeja",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/tira-de-costilla-de-cerdo-congelado-en-bandeja",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/tira-de-costilla-de-cerdo-congelado-premium",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/tira-de-costillar-a-granel-as",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-cerdo/tira-de-costillar-congelado-a-granel",
        urlTo: "/productos/cerdo"
    },
    {
        urlFrom: "/carne-de-pavo/piernas-de-pavo-congelado-en-bandeja",
        urlTo: "/productos/pavo"
    },
    {
        urlFrom: "/conservas/p-u-durazno-al-jugo-820-grs",
        urlTo: "/productos/conservas"
    },
    {
        urlFrom: "/conservas/p-u-lomitos-de-atun-en-aceite-vegetal-x-170-grs",
        urlTo: "/productos/conservas"
    },
    {
        urlFrom: "/conservas/pack-atun-en-agua",
        urlTo: "/productos/conservas"
    },
    {
        urlFrom: "/embutidos-premium/chorizo-kaiser-kostlich-skin",
        urlTo: "/productos/embutidos-premium"
    },
    {
        urlFrom: "/embutidos-premium/jamon-de-cerdo-tipo-aleman-kostlich-skin",
        urlTo: "/productos/embutidos-premium"
    },
    {
        urlFrom: "/embutidos-premium/picada-de-salame-kostlich",
        urlTo: "/productos/embutidos-premium"
    },
    {
        urlFrom: "/embutidos-premium/salchicha-bock-kostlich-skin",
        urlTo: "/productos/embutidos-premium"
    },
    {
        urlFrom: "/embutidos-premium/salchicha-de-cerdo-kostlich-skin",
        urlTo: "/productos/embutidos-premium"
    },
    {
        urlFrom: "/embutidos-premium/salchicha-de-pavo-kostlich-skin",
        urlTo: "/productos/embutidos-premium"
    },
    {
        urlFrom: "/embutidos/chorizo-churrasquero",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/chorizo-churrasquero-al-vacio-de-1-kg",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/chorizo-de-res-a-granel",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/chorizo-de-res-picante-al-vacio-de-1-kg",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/chorizo-parrillero-a-granel",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/chorizo-tipo-argentino-a-granel",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/mini-salchicha-de-res-al-vacio-20-und",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/mini-salchicha-frankfurt-10-cm-al-vacio-20-und",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/p-u-mortadela-jamonada-vacio-200-grs",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/pack-chorizo-churrasquero-con-salsa",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/pack-chorizo-de-res-con-salsa",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/pack-chorizo-parrillero-con-salsa",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/pack-frankfurt-xl-san-juan-con-salsa",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/pack-peque-o-san-juan",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/pack-res-san-juan-con-salsa",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/pate-de-higado-de-cerdo-de-100-grs",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/pate-de-higado-de-cerdo-promocional-de-240-grs",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/pate-de-higado-de-pollo-de-100-grs",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/pu-mortadela-primavera-vacio-200-grs",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/salchicha-viena-a-granel",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/embutidos/salchicha-viena-a-granel-del-pelar",
        urlTo: "/productos/embutidos"
    },
    {
        urlFrom: "/fiambres/chorizo-espanol-al-vacio-de-200-grs",
        urlTo: "/productos/fiambres"
    },
    {
        urlFrom: "/fiambres/p-u-queso-de-cerdo-al-vacio-250-grs",
        urlTo: "/productos/fiambres"
    },
    {
        urlFrom: "/fiambres/salame-feteado-al-vacio-de-100-grs",
        urlTo: "/productos/fiambres"
    },
    {
        urlFrom: "/fiambres/tocino-de-cerdo-ahumado-al-vacio-500-grs",
        urlTo: "/productos/fiambres"
    },
    {
        urlFrom: "/preparados/chicharron-de-cerdo-1-kg",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/cordon-bleu-en-caja-de-600-grs",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/desmenuzado-de-pavo",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/filetitos-pimienta-cayena",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/filetitos-salsa-soya-y-limon",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/nuggets-dinos-500-grs-en-caja",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/nuggets-patitas-350-grs-en-caja",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/p-u-tubo-hamb-113-res-grill-sofia-12x113-grs",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/p-u-tubo-hamb-56-res-express-sofia-12x56-grs",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/pack-2-milanesas-americana-res",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/pack-3-milanesas-americana-cordon-bleu",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/roast-beef",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/sandwich-de-chola",
        urlTo: "/productos/preparados"
    },
    {
        urlFrom: "/preparados/silpancho-de-res-en-caja",
        urlTo: "/productos/preparados"
    }
]

function redirectMiddleware ( req, res, next )
{
    let match;
    urls.forEach( url =>
    {
        if ( req.path === url.urlFrom )
        {
            match = url.urlFrom
            res.redirect( url.urlTo )
        }
    } )
    if ( !match )
    {
        next()
    }
}

module.exports = redirectMiddleware