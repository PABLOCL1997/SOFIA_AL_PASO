import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { CHECK_CART, GET_CART_ITEMS, GET_QTY, GET_TOTAL } from "../graphql/cart/queries";
import { ProductType } from "../graphql/products/type";
import { trackAddToCart, trackRemoveFromCart, trackRemoveCartEvent } from "../utils/dataLayer";
import { useTranslation } from "react-i18next";
import { ADD_ITEM, CHECK_COUPON, DELETE_ITEM, EMPTY_CART } from "../graphql/cart/mutations";
import { SET_USER } from "../graphql/user/mutations";
import { useEffect, useMemo, useState } from "react";
import useCityPriceList from "./useCityPriceList";
import useMinimumPrice from "./useMinimumPrice";
import useUser from "./useUser";

type CartReturn = {
  cart: any;
  quantity: number;
  totalAmount: string;
  shippingPrice: number;
  hasStock: Function;
  isOverLimit: Function;
  addAndGo: Function;
  addItem: Function;
  updateItem: Function;
  deleteItem: Function;
  removeRow: Function;
  empty: Function;
  closeCartModal: Function;
  checkCart: Function;
  discountAmount: number;
  removeCoupon: Function;
};

type Action = {
  qty: number;
  product: ProductType;
  action: string;
};

type ActionEmpty = {
  action: string;
};

const useCart = (): CartReturn => {
  const { t } = useTranslation();
  const { city, idPriceList, agency } = useCityPriceList();
  const minimumPrice = useMinimumPrice();
  const { coupon, store } = useUser();
  const [totalAmount, setTotalAmount] = useState("0.0");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [action, setAction] = useState<Action | ActionEmpty>({ action: "no-action" });

  const [getCart, { data: cart }] = useLazyQuery(GET_CART_ITEMS, {
    fetchPolicy: "network-only",
    onError: (e: any) => {
      console.error("cart error", e);
    },
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
                  replace: true,
                },
              },
            });
          }
        }
      })();
    },
  });

  const shippingPrice = useMemo(() => {
    const shippingCost = 15; // Bs. 15
    const noShippingCost = 0; // Bs. 0
    if (parseFloat(totalAmount.replace(",", ".")) < minimumPrice && 
      store !== 'PICKUP' && store !== 'EXPRESS'
    ) {
      return shippingCost; 
    } else {
      return noShippingCost;
    }
  }, [minimumPrice, totalAmount, agency]);

  const [addItem] = useMutation(ADD_ITEM, {});
  const [showSuccess] = useMutation(SET_USER, {});
  const [deleteItem] = useMutation(DELETE_ITEM);
  const [emptyCart] = useMutation(EMPTY_CART, { variables: {} });
  const [closeCartModal] = useMutation(SET_USER, {
    variables: { user: { openCartModal: false } },
  });
  const [saveCoupon] = useMutation(SET_USER, {});

  const twoDecimals = (value: number): string => {
    const valueString = value.toString().replace('.', ',');
    const valueArray = valueString.split(',');
    if (valueArray.length > 1) {
      // return two first valus of valueArray[1]
      const integers = valueArray[0]
      const decimal = valueArray[1].substring(0, 2);
      return `${integers}.${decimal}`;
    }
    return String(value);
  }

  const [checkCoupon] = useMutation(CHECK_COUPON, {
    variables: { name: coupon },
    onCompleted: (data) => {
      const discount_amount: number = data?.coupon?.discount_amount;
      const discount_type: string = data?.coupon?.type

      if (discount_type === "%") {
        const total: number = parseFloat(totalAmount.replace(",", ".")) - shippingPrice;        
        const _discount_amount = (parseFloat(total.toFixed(2)) * discount_amount) / 100; 

        setDiscountAmount(parseFloat(twoDecimals(_discount_amount)));
      } else {
        setDiscountAmount(parseFloat(discount_amount.toFixed(2)));
      }
    }
  });
  const hasStock = (product: ProductType, qty: number) => {
    return product.stock >= qty;
  };

  const isOverLimit = (product: ProductType, qty: number) => {
    // product has a limit and the current qty is over the limit
    return product.maxPerUser > 0 && product.maxPerUser < qty;
  };

  const addAndGo = async (product: ProductType, qty: number, related: null | ProductType) => {
    if (isOverLimit(product, qty)) {
      await showSuccess({
        variables: {
          user: {
            showModal: t("cart.over_limit", { units: product.maxPerUser }),
          },
        },
      });
    } else if (!hasStock(product, qty)) {
      await showSuccess({
        variables: {
          user: { showModal: t("cart.no_stock", { qty: product.stock }) },
        },
      });
    } else {
      if (related) {
        let localProd: any = { ...product };
        localProd.related = related;
        localProd.related = localProd.related.filter((el: any) => el.infinite_stock || el.stock > 0 || el.maxPerUser > 0);
        localProd.related.forEach((el: any) => {
          el.qty = el.multiplier ? Number(el.multiplier) : 1;
        });
        product = localProd;
      }
      trackAddToCart({ ...product, categories: [], description: "", qty });
      await addItem({
        variables: {
          product: { ...product, categories: [], description: false, qty },
        },
      });
      await showSuccess({
        variables: {
          user: { showModal: t("cart.add_msg", { product: product.name }) },
        },
      });
    }
  };

  const updateItem = (_qty: number, _product: ProductType) => {
    setAction({
      qty: _qty,
      product: _product,
      action: "update",
    });
  };

  const removeRow = (_product: ProductType) => {
    setAction({
      product: _product,
      action: "delete",
    } as Action);
  };

  const empty = () => {
    setAction({
      action: "empty",
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
                units: product.maxPerUser,
              }),
            },
          },
        });
      } else if (!hasStock(product, qty)) {
        return showSuccess({
          variables: {
            user: {
              showModal: t("cart.no_stock", {
                qty: product.stock,
              }),
            },
          },
        });
      }

      if ((product?.qty ?? 0) < qty) {
        trackRemoveCartEvent();
        trackRemoveFromCart({
          ...product,
          qty,
        } as ProductType);
      } else {
        trackAddToCart({ ...product, qty } as ProductType);
      }
      await addItem({
        variables: {
          product: { ...product, qty, replace: action.action === "update" },
        },
      });
      setAction({ action: "no-action" });
    } else if (action.action === "delete") {
      const { product }: Action = action as Action;

      await deleteItem({
        variables: {
          product,
        },
      });
      setAction({ action: "no-action" });
      if (cart && !cart.cartItems.length) closeCartModal();

      trackRemoveCartEvent();
      trackRemoveFromCart({
        ...product,
        qty: 0,
      } as ProductType);
    } else if (action.action === "empty") {
      await emptyCart();
      setAction({ action: "no-action" });
      closeCartModal();
    }
  };

  const removeCoupon = async () => {
    setDiscountAmount(0);
    await saveCoupon({
      variables: { user: { coupon: null } },
    })
  };

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (coupon) { 
      checkCoupon();
    }
  }, [coupon]);

  useEffect(() => {
    if (action && action.action !== "no-action") {
      doAction(action);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  useEffect(() => {
    // when city or idPriceList or agency changes, updateCart
    if ((city || idPriceList || agency) && cart?.cartItems?.length) {
      checkCart({
        variables: {
          city,
          id_price_list: idPriceList,
          agency,
          cart: JSON.stringify(
            cart.cartItems.map((p: ProductType) => ({
              entity_id: p.entity_id,
              qty: p.qty,
            }))
          ),
        },
      });
    }
  }, [city, idPriceList, agency]);

  useEffect(() => {
    if (cart?.cartItems?.length) {
      setTotalAmount(GET_TOTAL(cart?.cartItems, shippingPrice));
    }
  }, [cart, shippingPrice]);

  const quantity = useMemo(() => cart?.cartItems?.length ? GET_QTY(cart.cartItems) : 0, [cart])
  const total = useMemo(() => (parseFloat(totalAmount.replace(',','.')) - discountAmount).toFixed(2).replace(".", ","), [totalAmount, discountAmount])

  return {
    cart,
    totalAmount: total,
    quantity,
    shippingPrice,
    discountAmount,
    hasStock,
    isOverLimit,
    addAndGo,
    addItem,
    updateItem,
    removeRow,
    deleteItem,
    empty,
    closeCartModal,
    checkCart,
    removeCoupon,
  };
};

export default useCart;
