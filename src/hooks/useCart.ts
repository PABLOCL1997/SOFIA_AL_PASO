import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks';
import { CHECK_CART, GET_CART_ITEMS, GET_QTY, GET_TOTAL } from '../graphql/cart/queries';
import { ProductType } from '../graphql/products/type';
import { trackAddToCart, trackRemoveFromCart, trackRemoveCartEvent } from '../utils/dataLayer';
import { useTranslation } from 'react-i18next';
import { ADD_ITEM, DELETE_ITEM, EMPTY_CART } from '../graphql/cart/mutations';
import { SET_USER } from '../graphql/user/mutations';
import { useEffect, useState } from 'react';
import useCityPriceList from './useCityPriceList';

type CartReturn = {
    cart: any,
    quantity: number,
    totalAmount: any,
    hasStock: Function,
    isOverLimit: Function,
    addAndGo: Function,
    addItem: Function,
    updateItem: Function,
    deleteItem: Function,
    removeRow: Function,
    empty: Function,
    closeCartModal: Function
}

type Action = {
  qty: number;
  product: ProductType;
  action: string;
};

type ActionEmpty = {
  action: string;
}

const useCart = (): CartReturn => {
  const { t } = useTranslation();
  const { city, idPriceList, agency } = useCityPriceList()
  const [totalAmount, setTotalAmount] = useState("0.0")
  const [quantity, setQuantity] = useState(0)
  
  const [action, setAction] = useState<Action | ActionEmpty>({action: "no-action"});

  const [getCart, { data: cart }] = useLazyQuery(GET_CART_ITEMS, 
    {
      fetchPolicy: "network-only",
      onError: (e: any) => {
        console.error('cart error', e)
      }
    });
  const [checkCart] = useLazyQuery(CHECK_CART, {
    fetchPolicy: "network-only",
    onCompleted: (data: any) => {
      (async () => {
        let cartItems = JSON.parse(data.checkCart.cart);
        await emptyCart();
        for (let i = 0; i < cartItems.length; i++) {
          if (cartItems[i].stock > 0) {
            await addItem({
              variables: {
                product: {
                  ...cartItems[i],
                  replace: true
                }
              }
            });
          }
        }
      })();
    }
  })
  
  const [addItem] = useMutation(ADD_ITEM, {});
  const [showSuccess] = useMutation(SET_USER, {});
  const [deleteItem] = useMutation(DELETE_ITEM);
  const [emptyCart] = useMutation(EMPTY_CART, { variables: {} });
  const [closeCartModal] = useMutation(SET_USER, {
    variables: { user: { openCartModal: false } }
  });
  const hasStock = (product: ProductType, qty: number) => {
    return product.stock >= qty;
  }

  const isOverLimit = (product: ProductType, qty: number) => {
    // product has a limit and the current qty is over the limit
    return product.maxPerUser > 0 && product.maxPerUser < qty
  }

  const addAndGo = async (product: ProductType, qty: number, related: null|ProductType) => {
    if (isOverLimit(product, qty)) {
      await showSuccess({
        variables: {
          user: {
            showModal: t("cart.over_limit", { units: product.maxPerUser })
          }
        }
      });
    } else if (!hasStock(product, qty)) {
      await showSuccess({
        variables: {
          user: { showModal: t("cart.no_stock", { qty: product.stock }) }
        }
      });
    } else {
      if(related){
        let localProd: any = {...product};
        localProd.related = related;
        localProd.related = localProd.related.filter((el: any) => el.infinite_stock || el.stock > 0 || el.maxPerUser > 0)
        localProd.related.forEach((el: any) => {
          el.qty = el.multiplier ? Number(el.multiplier) : 1
        });
        product = localProd;
      }
      trackAddToCart({ ...product, categories: [], description: "", qty });
      await addItem({
        variables: {
            product: { ...product, categories: [], description: false, qty }
        }
      });
      await showSuccess({
        variables: {
            user: { showModal: t("cart.add_msg", { product: product.name }) }
          }
      });
    }
  };

  const updateItem = (_qty: number, _product: ProductType) => {
    setAction({
      qty: _qty,
      product: _product,
      action: "update"
    });
  };

  const removeRow = (_product: ProductType) => {
    setAction({
      product: _product,
      action: "delete"
    } as Action );
  };

  const empty = () => {
    setAction({
      action: "empty"
    } as ActionEmpty);
  };


  const doAction = async (action: Action | ActionEmpty) => {
    if (action.action === "add" || action.action === "update") {
      const { qty, product }: Action = action as Action;
      if (isOverLimit(product, qty)) {
        return showSuccess({
          variables: {
            user: {
              showModal: t("cart.over_limit", {
                units: product.maxPerUser
              })
            }
          }
        });
      } else if (!hasStock(product, qty)) {
        return showSuccess({
          variables: {
            user: {
              showModal: t("cart.no_stock", {
                qty: product.stock
              })
            }
          }
        });
      }

      if ((product?.qty ?? 0) < qty) {
        trackRemoveCartEvent();
        trackRemoveFromCart({
          ...product,
          qty
        } as ProductType);
      } else {
        trackAddToCart({ ...product, qty } as ProductType);
      }
      await addItem({
        variables: {
          product: { ...product, qty, replace: action.action === "update" }
        }
      });
      setAction({action: "no-action"});
    } else if (action.action === "delete") {
      const { product }: Action = action as Action;

      trackRemoveCartEvent();
      trackRemoveFromCart({
        ...product,
        qty: 0
      } as ProductType);
      await deleteItem({
        variables: {
          product
        }
      });
      setAction({action: "no-action"});
      if (cart && !cart.cartItems.length) closeCartModal();
    } else if (action.action === "empty") {
      await emptyCart();
      setAction({action: "no-action"});
      closeCartModal();
    }
  };


  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (action && action.action !== "no-action"){
      doAction(action);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  useEffect(() => {
    // when city or idPriceList or agency changes, updateCart
    if ((city || idPriceList || agency) && cart && cart.cartItems) {
      checkCart({
        variables: {
          city,
          id_price_list: idPriceList,
          agency,
          cart: JSON.stringify(
            cart.cartItems.map((p: ProductType) => ({
              entity_id: p.entity_id,
              qty: p.qty
            }))
          ),
        }
      })
    }
  }, [city, idPriceList, agency]);

  useEffect(() => {
    if (cart && cart.cartItems && cart.cartItems.length) {
      setQuantity(GET_QTY(cart.cartItems))
      setTotalAmount(GET_TOTAL(cart.cartItems))
    }
  }, [cart]);

  return { cart, totalAmount, quantity, hasStock, isOverLimit, addAndGo, addItem, updateItem, removeRow, deleteItem, empty, closeCartModal }
}

export default useCart