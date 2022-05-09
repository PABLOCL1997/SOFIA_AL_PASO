import React, { FC, Suspense } from "react";
import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Loader"));
const Chart = React.lazy(() => import(/* webpackChunkName: "Chart" */ "../Images/Chart"));
const Clock = React.lazy(() => import(/* webpackChunkName: "Clock" */ "../Images/Clock"));
const User = React.lazy(() => import(/* webpackChunkName: "User" */ "../Images/User"));

const Container = styled.a`
  max-width: 230px;
  margin-bottom: 50px;
  border-radius: 15px;
  cursor: pointer;
  text-decoration: none;
  background: var(--white);
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.14);
  display: block;
  &:hover {
    opacity: 0.8;
  }
  @media screen and (max-width: ${BREAKPOINT}) {
    max-width: 100%;
    box-shadow: 0 0;
  }
`;

const Image = styled.img`
  width: 230px;
  height: 150px;
  object-fit: cover;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  @media screen and (max-width: ${BREAKPOINT}) {
    width: 100%;
    height: 230px;
  }
`;
Image.displayName = "RecipeItemImage";

const IconBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  @media screen and (max-width: ${BREAKPOINT}) {
    justify-content: space-around;
  }
`;

const Icon = styled.div`
  position: relative;
  span {
    font-family: 'MontserratMedium';
    font-size: 12px;
    line-height: 110%;
    margin-left: 10px;
    color: var(--black);
  }
  &:nth-child(2):before {
    content: "";
    display: block;
    width: 1px;
    background: var(--m-gray);
    height: 15px;
    position: absolute;
    top: 0;
    left: -15px;
  }
  &:nth-child(2):after {
    content: "";
    display: block;
    width: 1px;
    background: var(--m-gray);
    height: 15px;
    position: absolute;
    top: 0;
    right: -15px;
  }
`;

const Title = styled.h2`
  font-family: 'MontserratMedium';  font-size: 20px;
  line-height: 110%;
  text-align: center;
  color: var(--black);
  padding: 10px 0 20px;
  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 30px 0;
  }
`;

export type RecipeType = {
  title: string;
  difficulty: string;
  mins: string;
  link: string;
  people: number;
};

type Props = {
  item: RecipeType;
  index: number;
};

const RecipeItem: FC<Props> = ({ item, index }) => {
  return (
    <Container href={item.link} target="_blank">
      <Image className="lazyload" width="230" height="150" src={`/images/recipes/recipe_${index}.webp`} alt={item.title} />
      <IconBox>
        <Icon>
          <Chart />
          <span>{item.difficulty}</span>
        </Icon>
        <Icon>
          <Clock />
          <span>{item.mins}</span>
        </Icon>
        <Icon>
          <User />
          <span>{item.people}</span>
        </Icon>
      </IconBox>
      <Title>{item.title}</Title>
    </Container>
  );
};

export default RecipeItem;
