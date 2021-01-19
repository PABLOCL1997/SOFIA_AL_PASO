import React, { FC, useEffect } from "react";
import {
  Wrapper,
  Headline,
  Subtitle,
  TextWrap,
  BigImg,
  ButtonWrap,
  MainContent
} from "./style";
import { Link } from "react-router-dom";
import BigImgIcon from "../../assets/images/error-img.svg";
import WaringIcon from "../../assets/images/error-waring.svg";

const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Cta"));

type Props = {};

const Page404: FC<Props> = () => {
  return (
    <Wrapper>
      <MainContent>
        <TextWrap>
          <h2>404</h2>
          <Headline>
            <img src={WaringIcon} alt="(!)" />
            <span>Página no encontrada</span>
          </Headline>
          <Subtitle>
            Lo sentimos, la página a la que estás intentando acceder no existe o
            ha cambiado. Prueba utilizar el buscador para hallar lo que estás
            buscando o dirígete a la Home.
          </Subtitle>
          <ButtonWrap>
            <Link to="/">
              <Cta filled={true} text={"VOLVER A LA HOME"} action={() => {}} />
            </Link>
          </ButtonWrap>
        </TextWrap>
        <BigImg src={BigImgIcon} />
      </MainContent>
    </Wrapper>
  );
};

export default Page404;
