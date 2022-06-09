import React, { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { fromLink, keepQueryParameter } from "../../utils/string";
import { Alias, Props, BreadCrum } from "./types";
import { ListItem, ListItemTitle } from "./styled";

const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */ "../Images/Chevron"));

const BreadCrumbs: FC<Props> = ({ alias, isMobile = true, additionalLinks }) => {
  const { pathname } = useLocation();
  const Home = "Home";
  const routes = pathname.split("/");

  const getLink = (array: string[], index: number): string => array.reduce((acc, val, currIndex) => (index >= currIndex ? acc + "/" + val : acc));

  const links: BreadCrum[] = routes.map((route: string, index: number, array: string[]) => {
    const length = array.length;
    const replace: Alias | undefined = alias?.find(({ oldName }: Alias) => oldName === route);
    const routeName = index === 0 ? Home : replace ? replace.newName : fromLink(route);
    const routeLink = getLink(array, index);

    return { routeName, routeLink, length };
  });

  let finalLinks: BreadCrum[] = links;
  if (additionalLinks) {
    finalLinks = additionalLinks;
  }

  if (isMobile) {
    if (additionalLinks) {
      finalLinks = additionalLinks.map((bc: BreadCrum) => {
        return { ...bc, routeName: String(bc.routeName).replaceAll("/", "").replaceAll(" ", "") };
      });
    }
    const { length } = finalLinks;
    if (length < 1) {
      const newLink: BreadCrum = finalLinks[0];
      finalLinks = [newLink];
    } else {
      const newLink: BreadCrum = finalLinks[length - 2];
      finalLinks = [newLink];
    }
  }

  return (
    <nav>
      {finalLinks.map(({ routeLink, routeName, length }, index) => (
        <Link key={index} to={keepQueryParameter(routeLink)}>
          <ListItem>
            {isMobile && <Chevron />}
            <ListItemTitle>{routeName}</ListItemTitle>
            {!isMobile && index < length - 1 && " / "}
          </ListItem>
        </Link>
      ))}
    </nav>
  );
};

export default BreadCrumbs;
