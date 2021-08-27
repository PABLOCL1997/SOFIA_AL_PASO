import { useState, useEffect } from "react"
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useLazyQuery } from "@apollo/react-hooks"
import { CategoryType } from "../graphql/categories/type";
import { ProductType } from "../graphql/products/type";
import { GET_B2E_PRODUCT, GET_PRODUCT, GET_PRODUCT_DETAIL, GET_SAP_PRODUCT } from "../graphql/products/queries";
import useCityPriceList from "./useCityPriceList";
import { trackProduct } from "../utils/dataLayer";
import axios from "axios";


function useUrlQuery() {
    return new URLSearchParams(useLocation().search);
}

const useProduct = (inlineProdname = "", withDetail: boolean = false) => {
    const logsUrl = process.env.REACT_APP_BACKEND + '/logs-product'; 
    const history = useHistory();
    let { prodname } = useParams();
    let query = useUrlQuery();

    let cityUrl = query.get("ciudad");
    let agencyUrl = query.get("agencia");

    prodname = String(prodname || inlineProdname);
    prodname = prodname.replaceAll("--", "~")
    .split(/-/g)
    .map((word:any) => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`)
    .join(" ")
    .replaceAll("~", "-");
    const { city, idPriceList, agency } = useCityPriceList()
    const [product, setProduct] = useState<ProductType | any>({});
    const [categories, setCategories] = useState<Array<CategoryType>>([]);
    const [related, setRelated] = useState<Array<ProductType>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const errorHandler = (error: any, source: string) => {
        setError(error);
        setLoading(false);
        axios.post(logsUrl, {
            error,
            source
        })
    };

    const [ loadProductDetail, { loading: loadingProdDetail, data: dataProdDetail }] = useLazyQuery(GET_PRODUCT_DETAIL, {
        fetchPolicy: "network-only",
        onError: (error) => errorHandler(error, "GET_PRODUCT_DETAIL")
    });
    const [loadProductFromList] = useLazyQuery(GET_B2E_PRODUCT, {
        fetchPolicy: "network-only",
        onError: (e) => errorHandler(e, "GET_B2E_PRODUCT"),
        onCompleted: d => {
            setProduct(d.productB2E);
            if (d.productB2E.categories) setCategories(d.productB2E.categories);
            if (d.productB2E.related) setRelated(d.productB2E.related);
            setLoading(false);

            if (withDetail) {
                loadProductDetail({
                    variables: {
                        name: prodname
                    }
                });
            }
            try {
                trackProduct(d.product);
            } catch (error) {}
        }
    })

    const [loadProduct] = useLazyQuery(GET_PRODUCT, {
        fetchPolicy: "network-only",
        variables: {
          name: prodname,
          city: city ? city : cityUrl,
          categories: true,
          related: true
        },
        onError: (e) => errorHandler(e, "GET_PRODUCT"),
        onCompleted: d => {
            setProduct(d.product);
            if (d.product.categories) setCategories(d.product.categories);
            if (d.product.related) setRelated(d.product.related);
            setLoading(false);

            if (withDetail) {
                loadProductDetail({
                    variables: {
                        name: prodname
                    }
                });
            }
            try {
                trackProduct(d.product);
            } catch (error) {}
        }
    });

    const [loadSapProduct] = useLazyQuery(GET_SAP_PRODUCT, {
        fetchPolicy: "network-only",
        onError: (e) => errorHandler(e, "GET_SAP_PRODUCT"),
        onCompleted: d => {
            setProduct(d.productSap)
            setLoading(false);
            
            if (withDetail) {
                loadProductDetail({
                    variables: {
                        name: prodname
                    }
                });
            }
        }
    })




    useEffect(()=> {
        if (agency) {
            loadSapProduct({
                variables: {
                    name: prodname,
                    agency: agency ? agency : agencyUrl,
                    city: city ? city : cityUrl,
                }
            })
        }
        
        if (idPriceList > 0) {
            loadProductFromList({
                variables:{
                    name: prodname,
                    id_price_list: String(idPriceList),
                    city: city ? city : cityUrl,
                }
            })
        }

        if (!agency && idPriceList === 0) {
            loadProduct({
                variables: {
                    name: prodname,
                    city: city ? city : cityUrl,
                    categories: true,
                    related: true
                }
            });
        }
    }, [city, idPriceList, agency])


    return { product, categories, related, detail: dataProdDetail, loadingDetail: loadingProdDetail, loading, error }
}

export default useProduct