import React, {
    FC,
    useState,
    SetStateAction,
    Fragment,
    useEffect
  } from "react";
import styled from "styled-components";
import * as GSC from "../style";

export const Wrapper = styled.div`
  background: white;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  border-radius: 20px;
  img {
    width: 50px;
  }
`;



  const Loading = () => {
      return (
      <GSC.Wrapper>
          <GSC.Square>
              <Wrapper>
                <img src="/images/loader.svg" alt="loader" />
              </Wrapper>
          </GSC.Square>
      </GSC.Wrapper>
      )

  }

export default Loading;