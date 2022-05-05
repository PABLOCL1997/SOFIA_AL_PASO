import { useEffect, useState } from "react";
import { useQuery } from "react-apollo";
import { GET_USER } from "../graphql/user/queries";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { GET_CATEGORIES } from "../graphql/categories/queries";
import { toLink } from "../utils/string";
import { CategoryType, SubCategoryLvl3Type, SubCategoryLvl4Type } from "../graphql/categories/type";
import useCityPriceList from "./useCityPriceList";

const useCategory = (offset = 0) => {
  const allCategoriesId = 313;
  const history = useHistory();
  const { city, agency } = useCityPriceList();
  const { category, subcategory, lastlevel } = useParams();
  const categoryName = useLocation().pathname;
  const _category = categoryName ? (categoryName.split("/").length >= 3 ? categoryName.split("/")[2 + offset] : "") : "";
  const _subcategory = categoryName ? (categoryName.split("/").length >= 4 ? categoryName.split("/")[3 + offset] : "") : "";
  const _lastlevel = categoryName ? (categoryName.split("/").length >= 5 ? categoryName.split("/")[4 + offset] : "") : "";

  const { data, loading } = useQuery(GET_CATEGORIES, {
    fetchPolicy: "network-only",
    variables: {
      city,
      agency
    },
    onCompleted: (d) => {
      setCategories(d.categories);
    },
  });
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [tCategory, setTCategory] = useState<CategoryType | null>();
  const [category_id, setCategoryId] = useState(0);

  useEffect(() => {
    if (data && data.categories) {
      let entity_id = null;

      let __category: any = data.categories.find((row: CategoryType) => toLink(row.name) === toLink(category || _category) || "");
      if (__category) {
        setTCategory(__category);
        if (subcategory || _subcategory) {
          let __subcategory: any = __category.subcategories.find((row: SubCategoryLvl3Type) => toLink(row.name) === toLink(subcategory || _subcategory) || "");
          if (__subcategory) {
            if (lastlevel || _lastlevel) {
              let __lastlevel: any = __subcategory.subcategories.find((row: SubCategoryLvl4Type) => toLink(row.name) === toLink(lastlevel || _lastlevel) || "");
              if (__lastlevel) entity_id = __lastlevel.entity_id;
            } else {
              entity_id = __subcategory.entity_id;
            }
          }
        } else {
          entity_id = __category.entity_id;
        }
      }
      if (entity_id && entity_id !== category_id) {
        setCategoryId(entity_id);
      } else if (!entity_id) {
        setCategoryId(allCategoriesId);
        setTCategory(null);
      }
    }
  }, [categories, category, _category, subcategory, _subcategory, lastlevel, _lastlevel, data]);

  return { categories, category_id, category, subcategory, lastlevel, loading, setCategoryId, tCategory };
};

export default useCategory;
