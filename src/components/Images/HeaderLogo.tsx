import React, { FC } from "react";
import styled from "styled-components";
import { LG } from "../../utils/constants";

const Image = styled.img`
  /*   width: 83px; */

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

type Props = {
  withSlogan?: boolean;
};

const HeaderLogo: FC<Props> = () => {
  return (
    /*     <Image
      width="83px"
      height="50px"
      src="/images/sofia-logo.svg"
      alt="Sofía"
    />
 */
    <Container>
      <picture>
        <source srcSet={"/images/sofia-logo.webp 2x"} type="image/webp" />
        <source srcSet={"/images/sofia-logo.png 1x"} type="image/jpeg" />
        <img
          src={"/images/sofia-logo.png"}
          width="83px"
          height="50px"
          alt={"Sofía"}
        />
      </picture>
    </Container>
  );
};
export default HeaderLogo;
