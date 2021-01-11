import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";

import React, { FC, useEffect, useState } from "react";
import { GET_PRODUCT } from "../graphql/products/queries";
import { useLazyQuery, useQuery } from "react-apollo";
import { GET_USER } from "../graphql/user/queries";
import { ProductType } from "../graphql/products/type";

const Qty = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--yellow);
  padding: 10px 0;
  border-radius: 30px;
  margin-right: 20px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-right: 0;
  }
  select {
    cursor: pointer;
    -webkit-appearance: none;
    background: none;
    border: 0;
    width: 65px;
    padding-left: 25px;
    font-size: 12px;
    line-height: 12px;
  }
  svg {
    pointer-events: none;
    position: absolute;
    right: 10px;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 115px 1fr 95px 95px 100px 24px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #ccc;
  width: 100%;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 115px 1fr 70px;
  }
`;

const Image = styled.img`
  width: 100px;
  margin-right: 20px;
`;
Image.displayName = 'ProductCartImage'

const NameBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  flex: 1;
`;

const Name = styled.h3`
  font-family: MullerMedium;
  font-size: 14px;
  line-height: 14px;
  color: var(--black);
  margin-bottom: 5px;
`;

const Units = styled.span`
  font-family: MullerMedium;
  font-size: 12px;
  line-height: 12px;
  color: var(--font);
  margin-right: 20px;
`;

const UnitPrice = styled.span`
  font-family: MullerMedium;
  font-size: 12px;
  line-height: 12px;
  color: var(--font);
  margin-right: 5px;
`;

const Price = styled.span`
  margin-right: 20px;
  font-family: MullerMedium;
  font-size: 16px;
  line-height: 16px;
`;

const DeleteWrapper = styled.div`
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    text-align: center;
  }
`;

type Props = {
  product?: any;
  isStockAvaible: Function;
  // updateItem: Function;
  removeRow: Function;
};

const ProductCart: FC<Props> = ({ product, removeRow, isStockAvaible }) => {
  const Delete = React.lazy(
    () => import(/* webpackChunkName: "Delete" */ "./Images/Delete")
  );
  const Chevron = React.lazy(
    () => import(/* webpackChunkName: "Chevron" */ "./Images/Chevron")
  );

  const { data: userData } = useQuery(GET_USER, {});
  const [productCart, setProductCart] = useState<ProductType>();
  const [isAvaible, setStockAvaible] = useState<Boolean>(false);
  const [callParent, setCallParent] = useState<Boolean>(false);
  const [amount, setAmount] = useState<Number>(1);
  const [updateItem, setUpdateItem] = useState<Object>({
    nameItem: null,
    qtyItem: null,
  });

  const { loading: loadingProduct, data: productData } = useQuery(GET_PRODUCT, {
    fetchPolicy: "network-only",
    variables: {
      name: product.name,
      city: userData.userInfo.length
        ? String(userData.userInfo[0].cityKey)
        : "",
      categories: false,
      related: false,
    },
    onCompleted: (d) => {
      setProductCart(d.product);
    },
  });

  useEffect(() => {
    if (callParent)
      isStockAvaible(
        isAvaible,
        productCart ? productCart.stock : 0,
        updateItem
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAvaible, updateItem]);

  const handleStock = (qtySelected: Number, productCart: any) => {
    setStockAvaible(qtySelected <= productCart.stock ? true : false);
    setAmount(qtySelected <= productCart.stock ? qtySelected : 1);
    setUpdateItem({
      qtyItem: qtySelected,
      nameItem: productCart.name,
    });

    setCallParent(true);
  };

  return (
    <Row key={product.entity_id}>
      <Image
        className="lazyload"  data-src={
          product.image
            ? product.image.split(",")[0]
            : productCart?.image?.split(",")[0]
        }
      />
      <NameBox>
        <Name>
          {product.useKGS
            ? `${product.name} DE ${Number(product.weight)
                .toFixed(2)
                .replace(".", ",")} KGS APROX.`
            : product.name}
        </Name>
        <Units>&nbsp;</Units>
      </NameBox>
      <Qty>
        <select
          defaultValue={product.qty}
          onChange={(event) =>
            handleStock(Number(event.target.value), productCart)
          }
        >
          {[...(Array(21).keys() as any)]
            .slice(1)
            .map((opt: any, index: number) => (
              <option key={index} value={opt}>
                {opt}
              </option>
            ))}
        </select>
        <Chevron />
      </Qty>
      <UnitPrice>
        Bs. {product.special_price.toFixed(2).replace(".", ",")} c/u -
      </UnitPrice>
      <Price>
        Bs.{" "}
        {(product.special_price * Number(amount)).toFixed(2).replace(".", ",")}
      </Price>
      <DeleteWrapper onClick={() => removeRow(product)}>
        <Delete />
      </DeleteWrapper>
    </Row>
  );
};

export default ProductCart;
