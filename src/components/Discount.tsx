import React, { FC, Suspense, useState, useEffect } from "react";

import { useQuery, useMutation, useLazyQuery } from "react-apollo";
import { COMPARE_PRICES } from "../graphql/cart/queries";



type Props = {
    name: string;
    qty: number | undefined;
    discount: any;
    index: any;
    city: any;
    id_price_list: any;
}

const Discount: FC<Props> = ({name, qty, discount, city, id_price_list, index}) => {
    const { data } = useQuery(COMPARE_PRICES, {
        variables: {
            name,
            city,
            id_price_list,
            qty
        },
        onCompleted: d=> {
            discount[index] = d.comparePrices * (qty || 1)
        }
    })
    return (
        <></>
    )
}

export default Discount