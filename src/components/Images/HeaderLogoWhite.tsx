import React, { FC } from "react";
import styled from "styled-components";

type Props = {
  withSlogan?: boolean;
};

const Image = styled.img`
  width: 119px;
`;

const HeaderLogoWhite: FC<Props> = () => {
  return <Image src="/images/sofia-logo.png" />;
};
export default HeaderLogoWhite;
