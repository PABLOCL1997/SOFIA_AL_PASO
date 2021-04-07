const urls = [
    {
        urlFrom: "/productos/listo-para-comer",
        urlTo: "/productos/preparados/listo-para-comer"
    },
    {
        urlFrom: "/productos/res",
        urlTo: "/productos?q=res"
    },
    {
        urlFrom: "/productos/vac%C3%ADo",
        urlTo: "/productos?q=vacio"
    },
    {
        urlFrom: "/productos/embutidos/jamones/barra",
        urlTo: "/productos/embutidos-y-fiambres/jamones/barra"
    },
    {
        urlFrom: "/productos/embutidos/chorizos/granel",
        urlTo: "/productos/embutidos-y-fiambres/chorizos/granel"
    },
    {
        urlFrom: "/productos/cortes",
        urlTo: "/productos?q=cortes"
    },
    {
        urlFrom: "/productos/entero",
        urlTo: "/productos?q=entero"
    },
    {
        urlFrom: "/fetaonewniet.html",
        urlTo: "/"
    },
    {
        urlFrom: "/papas--tradicional-2.5-kg-",
        urlTo: "/papas--tradicional-2.5-kg-(9x9)"
    },
    {
        urlFrom: "/costilla-peque%C3%B1a-con-cuero-a-granel-",
        urlTo: "/costilla-con-cuero-a-granel"
    },
    {
        urlFrom: "/productos/embutidos/jamones/vac%C3%ADo",
        urlTo: "/productos/embutidos-y-fiambres/jamones/vac%C3%ADo"
    },
    {
        urlFrom: "/mascotas",
        urlTo: "/productos/mascotas"
    },
    {
        urlFrom: "/productos/embutidos/mortadelas/vac%C3%ADo",
        urlTo: "/productos/embutidos-y-fiambres/mortadelas/vac%C3%ADo"
    },
    {
        urlFrom: "/productos/pavo/bandejas",
        urlTo: "/productos/pavo"
    },
    {
        urlFrom: "/productos/la-despensa",
        urlTo: "/productos/conservas/la-despensa"
    },
    {
        urlFrom: "/embutidos-premium",
        urlTo: "/productos/embutidos-premium"
    },
    {
        urlFrom: "/productos/embutidos/jamones",
        urlTo: "/productos/embutidos-y-fiambres/jamones"
    },
    {
        urlFrom: "/productos/chorizos",
        urlTo: "/productos/embutidos-premium/chorizos"
    },
    {
        urlFrom: "/pat%C3%A9-de-h%C3%ADgado-de-cerdo-de-100-grs.",
        urlTo: "/pat%C3%A9-de-h%C3%ADgado-de-cerdo-de-100-grs"
    },
    {
        urlFrom: "/contacts/",
        urlTo: "/preguntas-frecuentes"
    },
    {
        urlFrom: "/productos/yo-chef",
        urlTo: "/productos/preparados/yo-chef"
    },
    {
        urlFrom: "/productos/mortadelas",
        urlTo: "/productos/embutidos-y-fiambres/mortadelas"
    },
    {
        urlFrom: "/mortadela-de-pollo-vac%C3%ADo-de-200-grs.",
        urlTo: "/mortadela-de-pollo-vac%C3%ADo-de-200-grs"
    },
    {
        urlFrom: "/pat%C3%A9-de-h%C3%ADgado-de-pollo-de-100-grs.",
        urlTo: "/pat%C3%A9-de-h%C3%ADgado-de-pollo-de-100-grs"
    },
    {
        urlFrom: "/p-u-jamon-light-de-pollo-al-vacio-250-grs",
        urlTo: "/jam%C3%B3n-light-de-pollo-al-vac%C3%ADo-250-grs"
    },
    {
        urlFrom: "/productos/embutidos/pat%C3%A9s",
        urlTo: "/productos/embutidos-y-fiambres/pat%C3%A9s"
    },
    {
        urlFrom: "/productos/embutidos/salchichas",
        urlTo: "/productos/embutidos-y-fiambres/salchichas"
    },
    {
        urlFrom: "/carne-de-pavo",
        urlTo: "/productos/pavo"
    },
    {
        urlFrom: "/productos/jamones",
        urlTo: "/productos/embutidos-y-fiambres/jamones"
    },
    {
        urlFrom: "/cachorros-raza-mediana-grande-podium-23-k",
        urlTo: "/cachorros-raza-mediana-grande-podium-23-kg"
    },
    {
        urlFrom: "/productos/milanesas",
        urlTo: "/productos/preparados/milanesas"
    },
    {
        urlFrom: "/conservas",
        urlTo: "/productos/conservas"
    },
    {
        urlFrom: "/p-u-tubo-hamb-83-res-picana-sofia-12x83-grs",
        urlTo: "/hamburguesas-de-res-pica%C3%B1a-(12-x-83-grs)"
    },
    {
        urlFrom: "/productos/nuggets",
        urlTo: "/productos/preparados/nuggets"
    },
    {
        urlFrom: "/productos/embutidos/chorizos",
        urlTo: "/productos/embutidos-y-fiambres/chorizos"
    },
    {
        urlFrom: "/productos/granel",
        urlTo: "/productos?q=granel"
    },
    {
        urlFrom: "/productos/embutidos/chorizos/vac%C3%ADo",
        urlTo: "/productos/embutidos-y-fiambres/chorizos/vac%C3%ADo"
    },
    {
        urlFrom: "/productos/el-faro",
        urlTo: "/productos/conservas/el-faro"
    },
    {
        urlFrom: "/productos/hamburguesas",
        urlTo: "/productos/preparados/hamburguesas"
    },
    {
        urlFrom: "/embutidos",
        urlTo: "/productos/embutidos-y-fiambres"
    },
    {
        urlFrom: "/productos/bandejas",
        urlTo: "/productos"
    },
    {
        urlFrom: "/productos/embutidos/mortadelas",
        urlTo: "/productos/embutidos-y-fiambres/mortadelas"
    },
    {
        urlFrom: "/pavo-",
        urlTo: "/productos/pavo"
    },
    {
        urlFrom: "/productos/pat%C3%A9s",
        urlTo: "/productos/embutidos-y-fiambres/patés"
    },
    {
        urlFrom: "/productos/embutidos/salchichas/granel",
        urlTo: "/productos/embutidos-y-fiambres/salchichas/granel"
    },
    {
        urlFrom: "/productos/barra",
        urlTo: "/productos?q=barra"
    },
    {
        urlFrom: "/productos/embutidos/mortadelas/barra",
        urlTo: "/productos/embutidos-y-fiambres/mortadelas/barra"
    },
    {
        urlFrom: "/hoycblmsrb.html",
        urlTo: "/"
    },
    {
        urlFrom: "/productos/salchichas",
        urlTo: "/productos/embutidos-y-fiambres/salchichas"
    },
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
    },
    {
        urlFrom: "/productos/embutidos",
        urlTo: "/productos/embutidos-y-fiambres"
    },
    {
        urlFrom: "/productos/fiambres",
        urlTo: "/productos/embutidos-y-fiambres"
    },
    {
        urlFrom: "/productos/preparados/yo-chef",
        urlTo: "/productos/preparados/otros-preparados"
    },
    {
        urlFrom: "/productos/conservas/el-faro",
        urlTo: "/productos/conservas/at%C3%BAn"
    },
    {
        urlFrom: "/productos/conservas/la-despensa",
        urlTo: "/productos/conservas/duraznos"
    },
    {
        urlFrom: "/productos/mascotas",
        urlTo: "/productos/alimento-para-mascotas"
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
