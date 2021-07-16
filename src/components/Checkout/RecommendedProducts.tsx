import React, { FC, Suspense, useEffect, useState } from "react";
import {
  ModalCourtain,
  Modal,
  Header,
  Title,
  Items,
  Total,
  Footer,
  Toolbox,
  Image,
  NameBox,
  Name,
  Units
} from "../../styled-components/RecommendedProductsStyles"
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useLazyQuery } from "react-apollo";
import { SET_USER } from "../../graphql/user/mutations";
import styled from "styled-components";
import { GET_USER } from "../../graphql/user/queries";
import { trackAddToCart, trackRemoveFromCart } from "../../utils/dataLayer";
import { ProductType } from "../../graphql/products/type";
import { ADD_ITEM } from "../../graphql/cart/mutations";
import { BREAKPOINT } from "../../utils/constants";
import useCityPriceList from "../../hooks/useCityPriceList";
import { GET_PRODUCT } from "../../graphql/products/queries";
import InfiniteScroll from 'react-infinite-scroll-component';

const Row = styled.div`
  display: grid;
  grid-template-columns: 115px 1fr 95px 95px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
  width: 100%;
  opacity: 1;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 115px 1fr 1fr;
  }
  @media screen and (max-width: 470px) {
    grid-template-columns: 1fr 1fr;
    img{
      margin-right: 0px;
      margin-left: 20px;
    }
  }
  &.fading{
    opacity: 0;
  }
  transition: all 0.5s;
  -webkit-transition: all 0.5s;
`;

const FullRow = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
  width: 100%;
  text-align:center;
`;

const EmptyRow = styled.div`
  margin: 30px 0px;
`;

const CtaWrapper = styled.div`
  margin-top: 20px;
  margin-left: 20px;
  button {
    padding: 10px 50px;
    text-transform: uppercase;
    span {
      font-size: 14px;
    }
  }
`;

const Pill = styled.div`
  border: 1px solid var(--yellow);
  border-radius: 30px;
  display: flex;
  width: fit-content;
  margin: 0 auto;

  @media screen and (max-width: 470px) {
    grid-column: 1 / -1;
  }
`;

const Qty = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  select {
    cursor: pointer;
    -webkit-appearance: none;
    background: none;
    border: 0;
    width: 65px;
    padding-left: 30px;
    font-size: 12px;
    line-height: 12px;
  }
  svg {
    pointer-events: none;
    position: absolute;
    right: 0;
  }
`;

const Add = styled.button`
  font-family: MullerBold;
  border: 0;
  background: var(--yellow);
  color: var(--black);
  padding: 11px 20px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  margin-left: 10px;
  font-size: 10px;
  line-height: 10px;
  text-transform: uppercase;
  transition: all 0.2s linear;
  &:hover {
    background: none;
    color: var(--red);
    box-shadow: 1px 0px var(--yellow) inset;
  }
`;

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Cta"));

type Action = {
  qty?: number;
  product?: ProductType;
  action?: string;
};

type Props = {
  items: any;
  visible: boolean;
  close: Function;
  dropDownQty?: number;
};

const RecommendedProducts: FC<Props> = ({ items, visible, close, dropDownQty = 21 }) => {
  const { t } = useTranslation();
  const [action, setAction] = useState<Action>({});
  const [relatedProducts, setRelatedProducts] = useState<any>([]);
  const [itemsSection, setItemsSection] = useState<any>([]);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(false);
  const { city, idPriceList } = useCityPriceList()
  const [itemsSectionStep, setItemsSectionStep] = useState<number>(5);

  const [addItem] = useMutation(ADD_ITEM, {
    variables: {
      product: { ...action.product, qty: action.qty, replace: true }
    }
  });

  const [showSuccess] = useMutation(SET_USER, {
    variables: { user: { showModal: t("auth_modal.success") } }
  });

  const updateItem = (_qty: number, _product: any) => {
    _product.qty = _qty < 1 ? 1 : _qty;
    setAction({
      qty: _product.qty,
      product: _product,
      action: "add"
    });
  };

  const hasStock = (product: null | any = null) => {
    let prod = action.product;
    if(product){
      prod = product;
    }

    return (
      (prod?.stock ?? 0) >= (action.qty || 0)
    );
  };

  const isOverLimit = (product: null | any = null) => {
    let prod = action.product;
    if(product){
      prod = product;
    }

    let p = relatedProducts.find(
      (p: ProductType) => p.entity_id === prod?.entity_id
    );

    return (
      (prod?.maxPerUser ?? 0) > 0 &&
      (prod?.maxPerUser ?? 0) < (action.qty || 0)
    );
  };

  const fetchMoreItems = () => {
    let step = itemsSectionStep+5;
    setItemsSectionStep(step);
    if(step > relatedProducts.length){
      setItemsSectionStep(relatedProducts.length);
      setHasMoreItems(false)
    }
    setHasMoreItems(true)
    setTimeout(() => {
      setItemsSection(relatedProducts.slice(0, step))
    }, 1000);
  };

  const [getRelatedProducts] = useLazyQuery(GET_PRODUCT, {
    fetchPolicy: "no-cache",
    onError: (err) => {
      console.log(err)
    },
    onCompleted: d => {
      if (d.product.related && action && action.product && action.qty){
        let {related} = d.product;
        let localProd: any = {...action.product};
        localProd.related = related;
        localProd.related = localProd.related.filter((el: any) => el.stock > 0 || el.maxPerUser > 0)
        localProd.related.forEach((el: any) => {
          el.qty = el.multiplier ? Number(el.multiplier) : 1
        });
        setTimeout(() => {
          trackAddToCart({ ...localProd, qty: action.qty });
          addItem({
            variables: { product: { ...localProd, qty: action.qty } }
          });
          let newItems = relatedProducts.filter(
            (p: ProductType) => p.entity_id !== action.product?.entity_id
          );
          setRelatedProducts(newItems);
          setItemsSection(newItems.slice(0,itemsSectionStep));
        }, 500);
      } else console.log("Error: Product has no related products");
    }
  });

  useEffect(() => {
    let relProducts = items;
    relProducts.forEach((el: any) => {
      el.qty = el.multiplier || 1;
      el.fading = false;
    });
    setItemsSection(relProducts.slice(0,itemsSectionStep));
    setRelatedProducts(relProducts)
  }, [items])

  return (
    <Suspense fallback={<Loader />}>
      <ModalCourtain className={visible ? "visible" : ""}>
        <Modal>
          <Header>
            <Title>{t("checkout.recommendedproducts.title")}</Title>
          </Header>
          <Items id="scrollableDiv">
            {itemsSection && itemsSection.length > 0 ? <InfiniteScroll
              dataLength={itemsSection.length}
              next={fetchMoreItems}
              hasMore={hasMoreItems}
              inverse={false}
              loader={<FullRow>Cargando más productos...</FullRow>}
              scrollableTarget="scrollableDiv">
              {
                itemsSection.map((product: any, index: number) => (
                  <Row key={`CartModalRow-${product.entity_id}`} className={`${product.fading ? 'fading' : ''}`}>
                    <Image src={product.image.split(",")[0]}></Image>
                    <NameBox>
                      <Name>
                        {product.useKGS
                          ? `${product.name} DE ${Number(product.weight)
                              .toFixed(2)
                              .replace(".", ",")} KGS APROX.`
                          : product.name}
                        <Units>&nbsp;</Units>
                      </Name>
                    </NameBox>
                    <Pill>
                      <Qty>
                        <select
                          defaultValue={1}
                          onChange={event => updateItem(Number(event.target.value), product)}
                        >
                          {[...(Array(dropDownQty).keys() as any)]
                            .slice(1)
                            .map((opt: any, index: number) => (
                              <option key={index} value={opt}>
                                {opt}
                              </option>
                            ))}
                        </select>
                        {/* Chevron */}
                        <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1.38452L5.5 5.077L10 1.38452" stroke="#808080" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Qty>
                      <Add onClick={() => {
                        if(!hasStock(product)){
                          showSuccess({
                            variables: {
                              user: { showModal: t("cart.no_stock", { qty: product.stock }) }
                            }
                          });
                        } else if(isOverLimit(product)){
                          showSuccess({
                            variables: {
                              user: { showModal: t("cart.over_limit", { units: product.maxPerUser }) }
                            }
                          });
                        } else {
                          updateItem(Number(product.qty), product);
                          product.fading = true;
                          getRelatedProducts({
                            variables:{
                            name: product.name,
                            id_price_list: String(idPriceList),
                            city,
                            related: true}
                          })}
                        }
                      }>{t("itembox.add")}</Add>
                    </Pill>
                  </Row>)
                )
              }
            </InfiniteScroll> :
            <FullRow>
              No hay mas productos recomendados
            </FullRow>}
          </Items>
          <Footer>
            <Toolbox>
              <CtaWrapper>
                <Cta filled={true} text={t("checkout.recommendedproducts.close")} action={() => close()} />
              </CtaWrapper>
            </Toolbox>
          </Footer>
        </Modal>
      </ModalCourtain>
    </Suspense>
  );
};

export default RecommendedProducts;
