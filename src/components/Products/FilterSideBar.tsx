import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CategoryType, SubCategoryLvl3Type, SubCategoryLvl4Type } from "../../graphql/categories/type";
import { BREAKPOINT } from "../../utils/constants";

import { search, toLink, keepGoogleQueryParameter } from "../../utils/string";
import {
  TitleWrap,
  LevelSub,
  LevelSub2,
  MarcasWrap,
  MarcasList,
  BrandItem,
  RadioBtn,
  TopFilters,
  TagsWrap,
  Chip,
  Cross,
  OrderAndFilterBtn,
  OrderFilterXsWrap,
  MobileModal,
  OrderXsTabs,
  ResultadosXs,
  TabContent,
  TabsBtn,
  ModalCourtain,
  Modal,
  MarcasDesktop,
  TabClick,
  RadioWrap,
  RadioLi,
  SmallCatImage,
  TitleCatImage,
} from "../../styled-components/FilterSideBarStyles";
import CarritoNegro from "../../assets/images/carrito-black.svg";
import { customStyles } from "../../utils/constants";
import BrandEmpty from "../../assets/images/brand-empty.svg";
import BrandChecked from "../../assets/images/brand-checked.svg";
import CrossIcon from "../../assets/images/close-modal.svg";
import RadioIcon from "../../assets/images/radio-btn.svg";
import RadioIconChecked from "../../assets/images/radio-btn-checked.svg";
import { fromLink } from "../../utils/string";
import useCityPriceList from "../../hooks/useCityPriceList";
import { useUrlQuery } from "../../hooks/useUrlQuery";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Loader"));

const FreeDelivery = React.lazy(() => import(/* webpackChunkName: "FreeDelivery" */ "../Images/FreeDelivery"));

const Container = styled.div`
  position: relative;
  button {
    cursor: default;
    width: 100%;
    text-align: left;
    padding: 10px 30px;
    svg {
      display: none;
    }
    span {
      font-family: "MontserratBold";
      font-size: 14px;
      line-height: 14px;
    }
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    button {
      cursor: pointer;
    }
    > div:first-child {
      position: relative;
      z-index: 3;
      button {
        svg {
          display: block;
        }
      }
    }
  }
`;

const ContainerBrands = styled.div`
  position: relative;
  margin-top: 10px;
  button {
    cursor: default;
    width: 100%;
    text-align: left;
    padding: 10px 30px;
    svg {
      display: none;
    }
    span {
      font-family: "MontserratBold";
      font-size: 14px;
      line-height: 14px;
    }
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    display: block;
    button {
      cursor: pointer;
    }
    > div:first-child {
      position: relative;
      z-index: 3;
      button {
        svg {
          display: block;
        }
      }
    }
  }
`;

const CategoryList = styled.ul<{ open: boolean; show?: boolean }>`
  /*   background: var(--white); */
   /*  box-shadow: 0px 6px 74px rgba(0,0,0,0.06); */
    /* border-radius: 20px; */
    padding: 15px 0 25px;

    position:relative;

    border-top:1px solid #F0F0F0;
    border-bottom:1px solid #F0F0F0;

    display:${(props) => (props.show ? "block !important" : "none !important")};

    @media screen and (max-width: ${BREAKPOINT}) {
        // position: absolute;
        z-index: 2;
        width: 100%;
        top: 0;
        // padding-top: 60px;
        display: ${(props) => (props.open ? "block" : "block")};
        border-top:0;
    }
}
`;
CategoryList.displayName = "CategoryList";

const Category = styled.li<{ selected: boolean; key?: number; lvl?: any }>`
  padding: 5px 0;
  cursor: pointer;

  @media (max-width: ${BREAKPOINT}) {
    margin-bottom: 5px;
  }

  /*   &:before {
    content: "";
    display: block;
    left: 0;
    top: 5px;
    height: 30px;
    position: absolute;
    border-left: 3px solid
      ${(props) => (props.selected ? "var(--yellow)" : "transparent")};
  } */
  span {
  }
  a {
    color: inherit; /* blue colors for links too */
    text-decoration: inherit; /* no underline */
    font-family: "MontserratMedium";
    font-size: 14px;
    line-height: 20px;
    color: ${customStyles.black};

    display: flex;
    align-items: center;

    img {
      margin-right: 7px;
    }

    &:hover {
      text-decoration: underline;
    }
  }

  em {
    font-family: "MontserratBold";
    color: ${customStyles.black};
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.2px;
    text-transform: uppercase;
  }

  .cantidad {
    color: ${customStyles.darkGrey};
    font-size: 14px;
    line-height: 20px;
    margin-left: 2px;
  }
`;
Category.displayName = "Category";

const DesktopCategory = styled.div`
  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

const SubCategory = styled.div<{ selected: boolean; key?: number; lvl?: any }>`
  padding: 0 0 10px;

  span {
    font-family: "MontserratMedium";
  }

  a {
    position: relative;
    z-index: 10;
  }
  @media (max-width: ${BREAKPOINT}) {
    a {
      padding-left: 20px;
    }
  }
`;
SubCategory.displayName = "SubCategory";

const SubCategory4 = styled.div<{ selected: boolean; key?: number; lvl?: any }>`
  padding: 0 0 10px;

  @media (max-width: ${BREAKPOINT}) {
    a {
      padding-left: 20px;
    }
  }

  span {
    font-family: "MontserratMedium";
  }
`;

const DeliveryBox = styled.div`
  margin-top: 50px;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  span {
    font-size: 12px;
    line-height: 15px;
    text-transform: uppercase;
    color: var(--black);
    margin-left: 10px;
    flex: 1;
  }
`;

const Text = styled.div`
  font-family: "MontserratMedium";
  font-size: 14px;
  line-height: 18px;
  color: var(--black);
  margin: 20px 0;
`;

type Props = {
  count: number;
  offset: number;
  limit: number;
  categories: Array<CategoryType>;
  brands: any;
  order: any;
  orderQuery: Function;
  setBrand: Function;
};

const FilterSideBar: FC<Props> = ({ count, categories, brands, order, orderQuery, offset, limit, setBrand }) => {
  const { t } = useTranslation();

  const history = useHistory();
  const query = useUrlQuery();
  const { category, subcategory, lastlevel } = useParams();

  const { city } = useCityPriceList();

  const [open, setOpen] = useState(false);
  const brandQuery = query.get("marca")?.split(",");
  const [openModal, setOpenModal] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const navigateLink = (cat: CategoryType, s3cat?: SubCategoryLvl3Type, s4cat?: SubCategoryLvl4Type) => {
    if (cat.entity_id === 0) {
      return `/productos`;
    } else {
      let link = `/productos/${toLink(cat.name)}`;
      if (s3cat) link = `${link}/${toLink(s3cat.name)}`;
      if (s4cat) link = `${link}/${toLink(s4cat.name)}`;
      return link;
    }
  };

  const compare = (cat: CategoryType, s3cat?: SubCategoryLvl3Type, s4cat?: SubCategoryLvl4Type) => {
    let is = toLink(String(category)) === toLink(cat.name);
    if (s3cat) is = is && toLink(String(subcategory)) === toLink(s3cat.name);
    if (s4cat) is = is && toLink(String(lastlevel)) === toLink(s4cat.name);

    return is;
  };

  const [brandSelected, setBrandSelected] = useState("");
  const [arrayBrand, setArrayBrand] = useState([
    {
      name: "",
      toggle: false,
    },
  ]);

  const [brandsSelected, setBrandsSelected] = useState(0);

  useEffect(() => {
    const stateArray = brands.brands.map(({ name }: any) => {
      const toggle = brandQuery?.includes(name);
      return {
        name,
        toggle,
      };
    });
    setArrayBrand(stateArray);
  }, []);

  const handleBrandFilter = (index: number) => {
    let newState = [...arrayBrand];
    newState[index].toggle = !newState[index].toggle;
    setArrayBrand(newState);

    var toggleQty = arrayBrand.filter(({ toggle }: any) => toggle);
    setBrandsSelected(toggleQty.length);
    if (toggleQty.length) {
      setBrand(toggleQty.map(({ name }: any) => `'${name}'`).join(","));
    } else {
      setBrand(null);
    }
  };

  const handleToggleOff = () => {
    let newState = [...arrayBrand];

    newState.forEach((item) => {
      item.toggle = false;
    });
    setArrayBrand(newState);

    var toggleQty = arrayBrand.filter((item) => item.toggle === true);
    setBrandsSelected(toggleQty.length);
    setBrand(null);
  };

  useEffect(() => {
    const params = new URLSearchParams(history.location.search);
    const brands = arrayBrand.filter(({ toggle }) => toggle);
    if (brands.length) {
      params.delete("marca");
      params.append("marca", brands.map(({ name }) => name).join(","));
    } else {
      params.delete("marca");
    }
    const paramsParsed = params.toString().replaceAll("%2C", ",");

    history.push({ search: paramsParsed });
  }, [arrayBrand]);

  const arrayBrandParams = history.location.search.replace("?marca=", "").split(",");

  var sum = 0;

  const getSum = (n: any) => {
    sum = sum + n;
    return sum;
  };

  var result: any =
    categories.length &&
    categories.filter((obj: any) => {
      return obj?.name?.replace(/[^A-Z0-9]+/gi, "_").toLowerCase() === category?.replace(/[^A-Z0-9]+/gi, "_").toLowerCase();
    });

  const [hideCat, setHideCat] = useState(0);

  useEffect(() => {
    let catFilter = result[0]?.subcategories.filter(
      (cat: any) =>
        cat.name.replace(/[^A-Z0-9]+/gi, "_").toLowerCase() ===
        history.location.pathname
          .split("/")
          [history.location.pathname.split("/").length - 1].replace(/[^A-Z0-9]+/gi, "_")
          .toLowerCase()
    );

    setHideCat(catFilter && catFilter[0]?.subcategories.length);
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        <TitleWrap>
          {!lastlevel && !subcategory && !category ? (
            <img src={CarritoNegro} alt="Todos los Productos" />
          ) : category && !lastlevel && !subcategory ? (
            <>
              <TitleCatImage
                src={
                  search(
                    "name",
                    toLink(category),
                    categories.map((category: CategoryType) => {
                      return { ...category, name: toLink(category.name) };
                    })
                  )?.category_image
                }
                alt={""}
              />
            </>
          ) : (
            ""
          )}

          <h3>{lastlevel ? `${fromLink(subcategory)}: ${fromLink(lastlevel)}` : subcategory ? fromLink(subcategory) : category ? fromLink(category) : "Todos los productos"}</h3>
        </TitleWrap>

        <OrderFilterXsWrap>
          <ResultadosXs>
            {offset == 0 ? 1 : offset} - {limit + offset > count ? count : limit + offset} de {count} resultados
          </ResultadosXs>
          <OrderAndFilterBtn onClick={() => setOpenModal(true)}>Ordenar y filtrar</OrderAndFilterBtn>
        </OrderFilterXsWrap>

        {arrayBrandParams.length > 0 && arrayBrandParams[0] !== "" && (
          <TopFilters>
            <div>
              <h5>Filtros </h5>
              <em
                onClick={() => {
                  handleToggleOff();
                }}
              >
                Borrar todo
              </em>
            </div>
            <TagsWrap>
              {arrayBrandParams.length > 0 &&
                arrayBrandParams[0] !== "" &&
                arrayBrand.map((item, i) => {
                  return (
                    arrayBrand[i].toggle && (
                      <Chip
                        key={i}
                        onClick={() => {
                          handleBrandFilter(i);
                        }}
                      >
                        {item.name} <Cross />
                      </Chip>
                    )
                  );
                })}
            </TagsWrap>
          </TopFilters>
        )}

        <DesktopCategory>
          <CategoryList open={open} show={result[0]?.subcategories?.length !== 0 && hideCat !== 0 && history.location.pathname.split("/").length !== 5}>
            <Category onClick={() => {}} selected={!category || category === ""}>
              {history.location.pathname === "/productos" || history.location.pathname === "/productos/" ? <em>Categorías</em> : <em>Subcategorías</em>}
            </Category>

            {categories.length &&
              categories
                .filter((row: CategoryType) => {
                  return city === "CB" ? row : toLink(row.name).match(/cocha-days/) ? null : row;
                })
                .map((row: CategoryType) => (
                  <Category lvl={1} selected={compare(row)} key={row.entity_id}>
                    <Link to={keepGoogleQueryParameter(navigateLink(row))}>
                      <SmallCatImage src={row.category_image} alt="" />
                      {row.name}
                      <span className="cantidad">({row.quantity})</span>
                    </Link>

                    <LevelSub brandSelected={brandSelected !== ""} show={compare(row)}>
                      {compare(row) &&
                        row.subcategories &&
                        !!row.subcategories.length &&
                        row.subcategories.map((s3row: SubCategoryLvl3Type) => {
                          return (
                            <SubCategory selected={compare(row, s3row)} key={s3row.entity_id} lvl={compare(row, s3row)}>
                              <span onClick={() => {}}>
                                <Link to={keepGoogleQueryParameter(navigateLink(row, s3row))}>
                                  {s3row.name}

                                  <span className="cantidad">({s3row?.quantity})</span>
                                </Link>
                              </span>

                              <LevelSub2 show={compare(row, s3row)} index={getSum(s3row?.subcategories?.length !== 0)}>
                                {compare(row, s3row) &&
                                  s3row.subcategories &&
                                  !!s3row.subcategories.length &&
                                  s3row.subcategories.map((s4row: SubCategoryLvl4Type) => {
                                    if (s4row) {
                                      return (
                                        <SubCategory4 selected={compare(row, s3row, s4row)} key={s4row.entity_id} lvl={compare(row, s3row, s4row)}>
                                          <Link to={keepGoogleQueryParameter(navigateLink(row, s3row, s4row))}>
                                            {s4row.name}
                                            <span className="cantidad">({s4row.quantity})</span>
                                          </Link>
                                        </SubCategory4>
                                      );
                                    }
                                  })}
                              </LevelSub2>
                            </SubCategory>
                          );
                        })}
                    </LevelSub>
                  </Category>
                ))}
          </CategoryList>
        </DesktopCategory>

        <ModalCourtain className={openModal ? "visible" : ""}>
          {openModal && (
            <Modal>
              <img src={CrossIcon} className="close" alt="" onClick={() => setOpenModal(false)} />
              <OrderXsTabs>
                <TabsBtn>
                  <TabClick onClick={() => setCurrentTab(0)} active={currentTab === 0}>
                    <span>Filtrar</span>
                  </TabClick>
                  <TabClick onClick={() => setCurrentTab(1)} active={currentTab === 1}>
                    <span>Ordenar</span>
                  </TabClick>
                </TabsBtn>
                <TabContent active={currentTab === 0} current={currentTab}>
                  <CategoryList open={open} show={result[0]?.subcategories?.length !== 0 && hideCat !== 0 && history.location.pathname.split("/").length !== 5}>
                    <Category onClick={() => {}} selected={!category || category === ""}>
                      {history.location.pathname === "/productos" || history.location.pathname === "/productos/" ? (
                        <em>Categorías</em>
                      ) : (
                        <em>{result[0]?.subcategories?.length !== 0 ? "Subcategorías" : <br />}</em>
                      )}
                    </Category>
                    {categories.length &&
                      categories
                        .filter((row: CategoryType) => {
                          return city === "CB" ? row : toLink(row.name).match(/cocha-days/) ? null : row;
                        })
                        .map((row: CategoryType) => (
                          <Category lvl={1} selected={compare(row)} key={row.entity_id}>
                            <Link to={keepGoogleQueryParameter(navigateLink(row))}>
                              <SmallCatImage src={row.category_image} alt="" />
                              {row.name}
                              <span className="cantidad">({row?.quantity})</span>
                            </Link>

                            <LevelSub show={compare(row)}>
                              {compare(row) &&
                                row.subcategories &&
                                !!row.subcategories.length &&
                                row.subcategories.map((s3row: SubCategoryLvl3Type) => {
                                  return (
                                    <SubCategory selected={compare(row, s3row)} key={s3row.entity_id} lvl={compare(row, s3row)}>
                                      <span onClick={() => {}}>
                                        <Link to={keepGoogleQueryParameter(navigateLink(row, s3row))}>
                                          {s3row.name}
                                          <span className="cantidad">({s3row?.quantity})</span>
                                        </Link>
                                      </span>
                                      <LevelSub2 show={compare(row, s3row)} index={getSum(s3row?.subcategories?.length !== 0)}>
                                        {compare(row, s3row) &&
                                          s3row.subcategories &&
                                          !!s3row.subcategories.length &&
                                          s3row.subcategories.map((s4row: SubCategoryLvl4Type) => {
                                            if (s4row) {
                                              return (
                                                <SubCategory4 selected={compare(row, s3row, s4row)} key={s4row.entity_id} lvl={compare(row, s3row, s4row)}>
                                                  <Link to={keepGoogleQueryParameter(navigateLink(row, s3row, s4row))}>
                                                    {s4row.name}
                                                    <span className="cantidad">({s4row.quantity})</span>
                                                  </Link>
                                                </SubCategory4>
                                              );
                                            }
                                          })}
                                      </LevelSub2>
                                    </SubCategory>
                                  );
                                })}
                            </LevelSub>
                          </Category>
                        ))}
                  </CategoryList>
                  <ContainerBrands>
                    <MarcasWrap hide={brands && brands.brands && brands.brands.length <= 0}>
                      <h3>{t("products.filter_side_bar.marcas")}</h3>
                    </MarcasWrap>

                    <MarcasList hide={brands && brands.brands && brands.brands.length <= 0}>
                      {brands && brands.brands && brands.brands.length ? (
                        <>
                          {brands.brands.map(({ name, quantity }: any, index: number) =>
                            quantity > 0 ? (
                              <div
                                className="brand-link"
                                key={index}
                                onClick={() => {
                                  setBrandSelected(name);
                                  handleBrandFilter(index);
                                }}
                              >
                                <RadioBtn>{arrayBrand[index]?.toggle ? <img src={BrandChecked} alt="" /> : <img src={BrandEmpty} alt="" />}</RadioBtn>
                                <BrandItem onClick={() => {}} selected={index}>
                                  <div>
                                    <h5>{name}</h5>
                                    <span>({quantity})</span>
                                  </div>
                                </BrandItem>
                              </div>
                            ) : (
                              ""
                            )
                          )}
                        </>
                      ) : (
                        <Category onClick={() => {}} selected={!category || category === ""}>
                          <a key={1}>{t("products.product_list.no_brands")}</a>
                        </Category>
                      )}
                    </MarcasList>
                  </ContainerBrands>
                </TabContent>
                <TabContent active={currentTab === 1}>
                  <RadioWrap>
                    <ul>
                      <RadioLi onClick={() => orderQuery("position")}>
                        {order === "position" ? <img src={RadioIconChecked} alt="Posición" /> : <img src={RadioIcon} alt="Posición" />}

                        <span>Posición</span>
                      </RadioLi>
                      <RadioLi onClick={() => orderQuery("weight")}>
                        {order === "weight" ? <img src={RadioIconChecked} alt="Precio" /> : <img src={RadioIcon} alt="Precio" />}
                        <span>Precio</span>
                      </RadioLi>
                      <RadioLi onClick={() => orderQuery("price")}>
                        {order === "price" ? <img src={RadioIconChecked} alt="Peso" /> : <img src={RadioIcon} alt="Peso" />}
                        <span>Peso</span>
                      </RadioLi>
                    </ul>
                  </RadioWrap>
                </TabContent>
              </OrderXsTabs>
            </Modal>
          )}
        </ModalCourtain>
      </Container>

      <MarcasDesktop>
        <ContainerBrands>
          <MarcasWrap hide={brands && brands.brands && brands.brands.length <= 0}>
            <h3>{t("products.filter_side_bar.marcas")}</h3>
          </MarcasWrap>

          <MarcasList hide={brands && brands.brands && brands.brands.length <= 0}>
            {brands && brands.brands && brands.brands.length ? (
              <>
                {brands.brands.map(({ name, quantity }: any, index: number) =>
                  quantity > 0 ? (
                    <div
                      className="brand-link"
                      key={index}
                      onClick={() => {
                        setBrandSelected(name);
                        handleBrandFilter(index);
                      }}
                    >
                      <RadioBtn>{arrayBrand[index]?.toggle ? <img src={BrandChecked} alt="" /> : <img src={BrandEmpty} alt="" />}</RadioBtn>
                      <BrandItem onClick={() => {}} selected={index}>
                        <div>
                          <h5>{name}</h5>
                          <span>({quantity})</span>
                        </div>
                      </BrandItem>
                    </div>
                  ) : (
                    ""
                  )
                )}
              </>
            ) : (
              <Category onClick={() => {}} selected={!category || category === ""}>
                <a key={1}>{t("products.product_list.no_brands")}</a>
              </Category>
            )}
          </MarcasList>
        </ContainerBrands>
      </MarcasDesktop>

      <DeliveryBox>
        <Title>
          <FreeDelivery />
          <span>{t("products.filter_side_bar.freedelivery.title")}</span>
        </Title>
        <Text>{/*t('products.filter_side_bar.freedelivery.text')*/}</Text>
      </DeliveryBox>
      {/*       <ProductsFound>
        {t("products.filter_side_bar.product_count", { count })}
      </ProductsFound> */}
    </Suspense>
  );
};

export default FilterSideBar;
