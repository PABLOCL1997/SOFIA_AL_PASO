import React, { FC } from "react";
import styled from "styled-components";

const Image = styled.img`
  width: 83px;
`;

type Props = {
  withSlogan?: boolean;
};

const HeaderLogo: FC<Props> = () => {
  return <Image src="/images/sofia-logo.png" />;
};
export default HeaderLogo;
