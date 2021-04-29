// this hook return city and id price list
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { GET_USER } from '../graphql/user/queries'

type usePriceListType = {
    city: string,
    idPriceList: number
}

const useCityPriceList = (): usePriceListType => {
    const { data: userData } = useQuery(GET_USER, {})

    const [city, setCity] = useState<string>("SC")
    const [idPriceList, setIdPriceList] = useState<number>(0)

    useEffect(() => {
        // update price list
        if(userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList >= 0) {
          if (userData.userInfo[0].idPriceList !== idPriceList) {
            setIdPriceList(userData.userInfo[0].idPriceList)
          }
        }
        // update city
        if(userData.userInfo.length && userData.userInfo[0].cityKey) {
          if (userData.userInfo[0].cityKey !== city) {
            setCity(userData.userInfo[0].cityKey)
          }
        }
    }, [userData])


    return { city, idPriceList }
}

export default useCityPriceList