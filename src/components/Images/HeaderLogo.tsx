import React, { FC } from "react";
import styled from "styled-components";
import { LG } from "../../utils/constants";

const Image = styled.img`
  /*   width: 83px; */

  @media (max-width: ${LG}) {
    height: auto !important;
  }
`;

type Props = {
  withSlogan?: boolean;
};

const HeaderLogo: FC<Props> = () => {
  return (
    <Image
      width="83px"
      height="50px"
      src="/images/sofia-logo.png"
      alt="Sofía"
    />
  );
};
export default HeaderLogo;
