import { useEffect, useState } from 'react'
import { useLazyQuery } from "react-apollo"
import { ORDER_MINIMUM_PRICE } from '../graphql/cart/queries'
import useCityPriceList from './useCityPriceList'

const useMinimumPrice = () => {
  const { city, idPriceList } = useCityPriceList()
  const [getMinimumPrice] = useLazyQuery(ORDER_MINIMUM_PRICE, {
    fetchPolicy: 'network-only',
    onCompleted: d => {
      if(d && d.minimum_price){
        setMinimumPrice(d.minimum_price)
      }
    }
  })
  const [store, setStore] = useState<string>("b2c")
  const [minimumPrice, setMinimumPrice] = useState(200)

  useEffect(() => {
    getMinimumPrice({
      variables: {
        city,
        store
      }
    })
  }, [city, store])

  useEffect(() => {
    if(idPriceList > 0) {
      setStore("b2e")
    } else {
      setStore("b2c")
    }
  }, [city, idPriceList])

  return minimumPrice
}

export default useMinimumPrice