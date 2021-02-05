import React, { FC } from "react";
import styled from "styled-components";
import { LG } from "../../utils/constants";

type Props = {
  withSlogan?: boolean;
};

const Image = styled.img`
  @media (max-width: ${LG}) {
    height: auto !important;
  }
`;

const Container = styled.div`
  img {
    @media (max-width: ${LG}) {
      height: auto !important;
    }
  }
`;

const HeaderLogoWhite: FC<Props> = () => {
  return (
    <Container>
      <picture>
        <source srcSet={"/images/sofia-logo.webp 2x"} type="image/webp" />
        <source srcSet={"/images/sofia-logo.png 2x"} type="image/jpeg" />
        <img
          src={"/images/sofia-logo.png"}
          width="119px"
          height="83px"
          alt={"Sofía"}
        />
      </picture>
    </Container>

    /*   <Image src="/images/sofia-logo.svg" width="119px" height="83px" />; */
  );
};
export default HeaderLogoWhite;
