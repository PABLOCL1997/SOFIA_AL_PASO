import { useMutation, useQuery } from '@apollo/react-hooks';
import { GET_CART_ITEMS } from '../graphql/cart/queries';
import { ProductType } from '../graphql/products/type';
import { trackAddToCart } from '../utils/dataLayer';
import { useTranslation } from 'react-i18next';
import { ADD_ITEM } from '../graphql/cart/mutations';
import { SET_USER } from '../graphql/user/mutations';

type CartReturn = {
    cart: any,
    hasStock: Function,
    isOverLimit: Function,
    addAndGo: Function,
}

const useCart = (): CartReturn => {
  const { t } = useTranslation();

  const { data: cart } = useQuery(GET_CART_ITEMS);
  const [addItem] = useMutation(ADD_ITEM, {});
  const [showSuccess] = useMutation(SET_USER, {});

  const hasStock = (product: ProductType, qty: number) => {
    const p = cart.cartItems.find( (p: ProductType) => p.entity_id === product.entity_id)

    return product.stock >= qty + (p && p.qty ? p.qty : 0);
  }

  const isOverLimit = (product: ProductType, qty: number) => {
    const p = cart.cartItems.find((p: ProductType) => p.entity_id === product.entity_id)

    return (
      product.maxPerUser > 0 &&
      product.maxPerUser < qty + (p && p.qty ? p.qty : 0)
    )
  }

  const addAndGo = (product: ProductType, qty: number, related: null|ProductType) => {
    if (isOverLimit(product, qty)) {
      showSuccess({
        variables: {
          user: {
            showModal: t("cart.over_limit", { units: product.maxPerUser })
          }
        }
      });
    } else if (!hasStock(product, qty)) {
      showSuccess({
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
      addItem({
        variables: {
            product: { ...product, categories: [], description: false, qty }
        }
      });
      showSuccess({
        variables: {
            user: { showModal: t("cart.add_msg", { product: product.name }) }
          }
      });
    }

  };


  return { cart, hasStock, isOverLimit, addAndGo }
}

export default useCart