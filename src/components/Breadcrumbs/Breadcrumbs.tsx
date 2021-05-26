import React, { FC } from "react"
import { Link, useLocation } from "react-router-dom"
import { fromLink } from "../../utils/string"
import { Alias, Props, BreadCrum } from './types'
import { ListItem, ListItemTitle } from './styled'

const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */ "../Images/Chevron"))

const BreadCrumbs: FC<Props> = ({ alias, isMobile = true, additionalLinks }) => {
  const { pathname } = useLocation()
  const Home = "Home"
  const routes = pathname.split('/')
  
  const getLink = (array:string[], index: number): string => array.reduce((acc,val,currIndex) => index >= currIndex ? acc + "/" + val : acc)
  
  const links: BreadCrum[] = routes.map((route: string, index: number, array: string[]) => {
    const length = array.length
    const replace : Alias | undefined = alias?.find(({ oldName }: Alias) => oldName === route)
    const routeName = index === 0 ? Home : replace ? replace.newName : fromLink(route)
    const routeLink = getLink(array, index)
        
    return { routeName, routeLink, length }
  })

  let finalLinks: BreadCrum[];
  
  if (isMobile){
    const { length } = links
    if (length < 2){
      const newLink: BreadCrum = links[0]
      finalLinks = [newLink] 
    } else {
      const newLink: BreadCrum = links[length - 2]
      finalLinks = [newLink]
    }
  } else {
    if (additionalLinks) {
      finalLinks = additionalLinks
    } else {
      finalLinks = links
    }
  }

  return <nav>
      {finalLinks.map(({ routeLink, routeName, length }, index) => 
        <Link key={index} to={routeLink} >
          <ListItem>
            {isMobile && <Chevron />}
            <ListItemTitle>{routeName}</ListItemTitle>
            {!isMobile && index < length - 1 && " / " }
          </ListItem>
        </Link>
      )}
    </nav>
}

export default BreadCrumbs