import { CategoryType } from "../../graphql/categories/type";

export type Alias = {
    oldName: string
    newName: string
  }
  
export type BreadCrum = {
routeName: string
routeLink: string
length: number
}

export type Props = {
isMobile?: boolean,
alias?: Alias[],
additionalLinks?: any[]
};