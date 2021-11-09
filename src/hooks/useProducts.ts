import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { trackProductList } from "../utils/dataLayer";
import { GET_B2E_PRODUCTS, GET_PRODUCTS, GET_SAP_PRODUCTS } from "../graphql/products/queries";
import { GET_BRANDS } from "../graphql/metadata/queries";
import { useLocation } from "react-router-dom";
import useCategory from "./useCategory";
import { OrderColums } from "../graphql/products/type";
import useCityPriceList from "./useCityPriceList";
import axios from "axios";

type Products = {
  loading: boolean;
  products: any[];
  total: number;
  limit: number;
  query: any;
  offset: number;
  order: string;
  search: any;
  brand: any;
  brands: any;
  setLoading: Function;
  setOrder: Function;
  setBrand: Function;
  setCategoryId: Function;
};

function useUrlQuery() {
  return new URLSearchParams(useLocation().search);
}

const useProducts = (limit: number = 9, onsale: boolean = false): Products => {
  const logsUrl = process.env.REACT_APP_BACKEND + "/logs-product";

  let query = useUrlQuery();

  let cityUrl = query.get("ciudad");
  let agencyUrl = query.get("agencia");
  const pageNumber = parseInt(String(query.get("p")));

  const { city, idPriceList, agency } = useCityPriceList();
  const { category_id, category, subcategory, lastlevel, setCategoryId } = useCategory();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [brand, setBrand] = useState<any>(
    query
      .get("marca")
      ?.split(",")
      .map((brand: any) => `'${brand}'`)
      .join(",") || null
  );
  const [offset, setOffset] = useState(isNaN(pageNumber) || pageNumber == 1 ? 0 : (pageNumber - 1) * limit);
  const [search, setSearch] = useState(query.get("q"));
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState<string>(OrderColums[0]);
  const [error, setError] = useState();

  const errorHandler = (error: any, source: string) => {
    setError(error);
    setLoading(false);
    axios.post(logsUrl, {
      error,
      source,
    });
  };

  const [getBrands, { data: brands }] = useLazyQuery(GET_BRANDS, {
    fetchPolicy: "network-only",
    onError: (error) => errorHandler(error, "GET_BRANDS_PRODUCTS"),
  });

  const [loadProductsFromListing] = useLazyQuery(GET_B2E_PRODUCTS, {
    fetchPolicy: "network-only",
    onError: (error) => errorHandler(error, "GET_B2E_PRODUCTS"),
    onCompleted: (d) => {
      setProducts(d.productsB2E.rows);
      setTotal(d.productsB2E.count);
      setLoading(false);
      try {
        trackProductList(d.productsB2E.rows);
      } catch (e) {}
    },
  });
  const [loadProducts] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    onError: (error) => errorHandler(error, "GET_PRODUCTS"),
    onCompleted: (d) => {
      setProducts(d.products.rows);
      setTotal(d.products.count);
      setLoading(false);
      try {
        trackProductList(d.products.rows);
      } catch (e) {}
    },
  });

  const [loadSapProducts] = useLazyQuery(GET_SAP_PRODUCTS, {
    fetchPolicy: "network-only",
    onError: (error) => errorHandler(error, "GET_SAP_PRODUCTS"),
    onCompleted: (d) => {
      try {
        setProducts(d.productsSap.rows);
      } catch (e) {}
      setTotal(d.productsSap.count);
      setLoading(false);
    },
  });

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
    setLoading(true);
    // always get brands before modify entity id
    getBrands({
      variables: {
        categoryId: category_id || 0,
        city: city ? city : "SC",
      },
    });

    if (agency || agencyUrl) {
      loadSapProducts({
        variables: {
          agency: agency ? agency : agencyUrl,
          city: city ? city : "SC",
          category_id: search && search.length > 0 ? 0 : category_id || 0,
          limit,
          order,
          offset,
          search,
          onsale: category === "promociones" || onsale,
          brand: brand,
        },
      });
    }

    if (idPriceList > 0) {
      loadProductsFromListing({
        variables: {
          category_id: search && search.length > 0 ? 0 : category_id || 0,
          limit,
          order,
          offset,
          search,
          city: city ? city : "SC",
          id_price_list: String(idPriceList),
          onsale: category === "promociones" || onsale,
          brand: brand,
        },
      });
    }

    if (!agency && idPriceList === 0) {
      loadProducts({
        variables: {
          category_id: category_id || 0,
          limit,
          order,
          city: city ? city : "SC",
          offset: offset,
          search: search,
          onsale: category === "promociones" || onsale,
          brand: brand,
        },
      });
    }
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category_id, category, subcategory, lastlevel, order, search, brand, offset, idPriceList, city, agency]);

  return { loading, products, total, limit, query, offset, order, search, brand, brands, setLoading, setOrder, setBrand, setCategoryId };
};

export default useProducts;
