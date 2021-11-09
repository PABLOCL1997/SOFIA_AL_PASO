import React, { Suspense } from "react";
import styled from "styled-components";

import Arrow from "../Shared/Arrow";

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 0;
`;

const GoTop = () => {
  const handleGoTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <Wrapper>
      {/* <div onClick={() => handleGoTop} > */}
      <Arrow onClick={handleGoTop} background="#FECD00" color="black" rotate="0deg" />
      {/* </div> */}
    </Wrapper>
  );
};

export default GoTop;
