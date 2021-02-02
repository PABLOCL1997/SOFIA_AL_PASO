import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div``;

const Main = styled.div<{ show: boolean }>`
  opacity: ${props => (props.show ? 1 : 0)};
  transition: opacity 0.2s linear;
  min-height: 100vh;
`;

const Loader = styled.div<{ noHeader: boolean }>`
  display: flex;
  align-items: center;
  height: calc(100vh - ${props => (props.noHeader ? "130px" : "260px")});
  width: 50px;
  margin: 0 auto;
  img {
    max-width: 100%;
  }
`;

type Props = {
  noHeader?: boolean;
  time?: number;
};

const DelayedWrapper: FC<Props> = ({
  children,
  noHeader = false,
  time = 1000
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      {!show && (
        <Loader noHeader={noHeader}>
          <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
        </Loader>
      )}
      <Main show={show}>{children}</Main>
    </Wrapper>
  );
};

export default DelayedWrapper;
