import { useState, useEffect } from "react"
import { useHistory, useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/react-hooks"
import { CategoryType } from "../graphql/categories/type";
import { ProductType } from "../graphql/products/type";
import { GET_B2E_PRODUCT, GET_PRODUCT, GET_PRODUCT_DETAIL } from "../graphql/products/queries";
import { fromLink } from "../utils/string";
import useCityPriceList from "./useCityPriceList";
import { trackProduct } from "../utils/dataLayer";
import { toLink } from "../utils/string";



const useProduct = (inlineProdname = "") => {
    const history = useHistory();
    let { prodname } = useParams();
    prodname = String(prodname || inlineProdname);
    prodname = prodname.replaceAll("--", "~")
    .split(/-/g)
    .map((word:any) => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`)
    .join(" ")
    .replaceAll("~", "-");
    const { city, idPriceList } = useCityPriceList()

    const [product, setProduct] = useState<ProductType | any>({});
    const [categories, setCategories] = useState<Array<CategoryType>>([]);
    const [related, setRelated] = useState<Array<ProductType>>([]);

    const [ loadProductDetail, { loading: loadingProdDetail, data: dataProdDetail }] = useLazyQuery(GET_PRODUCT_DETAIL, {});
    const [loadProductFromList] = useLazyQuery(GET_B2E_PRODUCT, {
        fetchPolicy: "network-only",
        onError: () => {
            history.replace("/404");
        },
        onCompleted: d => {
            setProduct(d.productB2E);
            trackProduct(d.productB2E);
            if (d.productB2E.categories) setCategories(d.productB2E.categories);
            if (d.productB2E.related) setRelated(d.productB2E.related);
            loadProductDetail({
                variables: {
                    name: prodname
                }
            });
        }
    })
    
    const [loadProduct] = useLazyQuery(GET_PRODUCT, {
        fetchPolicy: "network-only",
        variables: {
          name: prodname,
          city,
          categories: true,
          related: true
        },
        onError: () => {
          history.replace("/404");
        },
        onCompleted: d => {
          setProduct(d.product);
          trackProduct(d.product);
          if (d.product.categories) setCategories(d.product.categories);
          if (d.product.related) setRelated(d.product.related);
          loadProductDetail({
            variables: {
              name: prodname
            }
          });
        }
    });

    const toCatLink = (str: string | null, level: number) => {
        let lvl2Cat: CategoryType | undefined = undefined;
        let lvl2CatStr = "";
        let lvl3Cat: CategoryType | undefined = undefined;
        let lvl3CatStr = "";
        if (level >= 4) {
          lvl3Cat = categories.find((c: CategoryType) => c.level === 3);
          if (lvl3Cat) lvl3CatStr = `${toLink(lvl3Cat.name)}/`;
        }
        if (level >= 3) {
          lvl2Cat = categories.find((c: CategoryType) => c.level === 2);
          if (lvl2Cat) lvl2CatStr = `${toLink(lvl2Cat.name)}/`;
        }
        return lvl2CatStr + lvl3CatStr + toLink(str);
    };


    useEffect(()=> {
        if (idPriceList > 0) {
            loadProductFromList({
                variables:{
                    name: prodname,
                    id_price_list: String(idPriceList),
                    city,
                }
            })
        } else {
            loadProduct({
                variables: {
                    name: prodname,
                    city,
                    categories: true,
                    related: true
                }
            });
        }
    }, [city, idPriceList])


    return { product, categories, related, detail: dataProdDetail, loadingDetail: loadingProdDetail, toCatLink }
}

export default useProduct