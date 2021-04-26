import { useEffect, useState } from 'react'
import { useQuery, useMutation, useLazyQuery } from "react-apollo"
import { ORDER_MINIMUM_PRICE } from '../graphql/cart/queries'
import { GET_USER } from '../graphql/user/queries'

const useMinimumPrice = () => {
  const { data: userData } = useQuery(GET_USER, {})
  const [getMinimumPrice] = useLazyQuery(ORDER_MINIMUM_PRICE, {
    fetchPolicy: 'network-only',
    onCompleted: d => {
      if(d && d.minimum_price){
        setMinimumPrice(d.minimum_price)
      }
    }
  })
  const [city, setCity] = useState<string>("SC")
  const [store, setStore] = useState<string>("b2c")
  const [idPriceList, setIdPriceList] = useState<number>(0)
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
    // update price list
    if(userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList >= 0) {
      if (userData.userInfo[0].idPriceList !== idPriceList) {
        setIdPriceList(userData.userInfo[0].idPriceList)
        // if it changes, if new value is b2e or not
        if(userData.userInfo[0].idPriceList > 0) {
          setStore("b2e")
        } else {
          setStore("b2c")
        }
      }
    }
    // update city
    if(userData.userInfo.length && userData.userInfo[0].cityKey) {
      if (userData.userInfo[0].cityKey !== city) {
        setCity(userData.userInfo[0].cityKey)
      }
    }
  }, [userData])

  return minimumPrice
}

export default useMinimumPrice