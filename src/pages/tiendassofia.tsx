import React, { FC } from "react";
import styled from "styled-components";
import DelayedWrapper from "../components/DelayedWrapper";

const Container = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;

  iframe {
    margin: 20px auto;
    width: 100%;
    height: 1000px;
  }
`;

const Tiendassofia: FC = () => {
  return (
    <DelayedWrapper>
      <Container>
        <iframe src="https://sofia.com.bo/mapa-para-sofiaalpaso/"></iframe>
      </Container>
    </DelayedWrapper>
  );
};

export default Tiendassofia;
