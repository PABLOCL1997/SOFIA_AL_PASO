import { useState, useEffect } from "react"
import { useLazyQuery, useQuery } from "@apollo/react-hooks"
import { GET_USER } from "../graphql/user/queries"
import { trackProductList } from "../utils/dataLayer";
import { GET_B2E_PRODUCTS, GET_PRODUCTS } from "../graphql/products/queries";
import { GET_BRANDS } from "../graphql/metadata/queries";
import { useLocation } from "react-router-dom";
import useCategory from "./useCategory";
import { OrderColums } from "../graphql/products/type";


type Products = {
    loading: boolean,
    products: any[],
    total: number,
    limit: number,
    query: any,
    offset: number,
    order: string,
    search: any,
    brand: any,
    brands: any,
    setLoading: Function,
    setOrder: Function,
    setBrand: Function

}

const useProducts = (): Products => {
    const limit = 9
    const query = new URLSearchParams(useLocation().search)
    const pageNumber = parseInt(String(query.get("p")))

    const { data: userData } = useQuery(GET_USER, {})
    const { category_id, category, subcategory, lastlevel } = useCategory()
    const [loading, setLoading] = useState(true)
    const [idPriceList, setIdPriceList] = useState(0)
    const [products, setProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [brand, setBrand] = useState<any>(query.get("marca")?.split(",").map((brand: any) => `'${brand}'`).join(",") || null);
    const [offset, setOffset] = useState(
      isNaN(pageNumber) || pageNumber == 1 ? 0 : (pageNumber - 1) * limit
    )
    const [search, setSearch] = useState(query.get("q"))
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState<string>(OrderColums[0]);      

    const [getBrands, { data: brands, loading: loadingBrands }] = useLazyQuery(GET_BRANDS,    {
        fetchPolicy: "network-only",
    })

    const [loadProductsFromListing] = useLazyQuery(GET_B2E_PRODUCTS, {
        fetchPolicy: "network-only",
        onCompleted: d => {
            trackProductList(d.productsB2B.rows)
            setProducts(d.productsB2B.rows)
            setTotal(d.productsB2B.count)
            setLoading(false)
        }
    })
    const [loadProducts, { loading: loadingProds }] = useLazyQuery(GET_PRODUCTS, {
        fetchPolicy: "network-only",
        onCompleted: d => {
            trackProductList(d.products.rows)
            setProducts(d.products.rows)
            setTotal(d.products.count)
            setLoading(false)
        }
    })

    useEffect(() => {
        if (query.get("q") !== search) {
          setOffset(0);
          setSearch(query.get("q"));
        } 
        if (Number(query.get("p")) !== Number(page)) {
          setPage(Number(query.get("p")));
          let offset = Number(query.get("p")) - 1;
          setOffset((offset < 0 ? 0 : offset) * limit);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [query]);


    useEffect(() => {
        if(userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList >= 0) {
          if (userData.userInfo[0].idPriceList !== idPriceList) {
            setIdPriceList(userData.userInfo[0].idPriceList)
          }
        }
      }, [userData])

    
    useEffect(() => {
        setLoading(true);
            // always get brands before modify entity id
        getBrands({
            variables: {
            categoryId: category_id || 0,
            city: userData.userInfo.length ? userData.userInfo[0].cityKey : "SC",      
            }
        });

        if (userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList > 0) {
            loadProductsFromListing({
            variables: {
                category_id: search && search.length > 0 ? 0 : category_id || 0,
                limit,
                order,
                offset,
                search,
                city: userData.userInfo.length ? userData.userInfo[0].cityKey : "SC",
                id_price_list: String(userData.userInfo[0].idPriceList),
                onsale: category === "promociones",
                brand: brand
            }
            })
        } else {
            loadProducts({
            variables: {
                category_id: category_id || 0,
                limit,
                order,
                offset: offset,
                search: search,
                onsale: category === "promociones",
                city: userData.userInfo.length
                ? userData?.userInfo[0]?.cityKey || "SC"
                : "SC",
                brand: brand
            }
            });
        }
        setPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category_id, category, subcategory, lastlevel, order, search, brand, offset, idPriceList]);

    return { loading, products, total, limit, query, offset, order, search, brand, brands, setLoading, setOrder, setBrand }

}

export default useProducts