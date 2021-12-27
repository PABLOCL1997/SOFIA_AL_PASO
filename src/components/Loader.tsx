import React, { FC } from "react";
import styled from "styled-components";

const Container = styled.span`
  font-size: 24px;
  color: black;
  width: 100%;
  height: 100%;
`;

type Props = {
  show?: boolean;
};

const Loader: FC<Props> = ({ show = false }) => {
  return <Container>{show && "Loading..."}</Container>;
};

export default Loader;
