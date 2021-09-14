// this hook return city and id price list
import { useEffect, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { GET_USER } from '../graphql/user/queries'
import { GET_SAP_AGENCIES } from '../graphql/products/queries'

type usePriceListType = {
    city: string,
    idPriceList: number,
    agency: string | null,
    setAgency: Function,
    agencies: any
}

const useCityPriceList = (): usePriceListType => {
    const { data: userData } = useQuery(GET_USER, {})
    useQuery(GET_SAP_AGENCIES, {
      fetchPolicy: "network-only",
      onCompleted: d => {
        setAgencies(d.agencies)
      }
  })
  
    const [agencies, setAgencies] = useState([]);
    const [city, setCity] = useState<string>("SC")
    const [idPriceList, setIdPriceList] = useState<number>(-1)
    const [agency, setAgency] = useState<string | null>(null)

    useEffect(() => {
        // update price list
        if(userData?.userInfo?.length && userData?.userInfo[0] && userData.userInfo[0].idPriceList >= 0) {
          if (userData.userInfo[0].idPriceList !== idPriceList) {
            setIdPriceList(userData.userInfo[0].idPriceList)
            setAgency(null)
          }
        }
        // update city
        if(userData.userInfo.length && userData.userInfo[0].cityKey) {
          if (userData.userInfo[0].cityKey !== city) {
            console.log('citykey', userData.userInfo[0].cityKey)
            setCity(userData.userInfo[0].cityKey)
            setAgency(null)
          }
        }

        // update agency
        if (userData.userInfo.length && userData.userInfo[0].agency) {
          if (userData.userInfo[0].agency !== agency) {
            setAgency(userData.userInfo[0].agency)
          }
        }
    }, [userData])


    return { city, idPriceList, agencies,
      agency: userData.userInfo.length && userData.userInfo[0].agency ?
      userData.userInfo[0].agency :
      null, setAgency }
}

export default useCityPriceList