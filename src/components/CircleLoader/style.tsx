import styled from "styled-components";

export const Wrapper = styled.div``;

export const Loader = styled.div<{ noHeader?: boolean; noHeight?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  height: calc(100vh - ${(props) => (props.noHeader ? "130px" : "260px")});

  width: 50px;
  margin: 0 auto;

  ${(props) => {
    if (props.noHeight) {
      return `
        height: auto;
     
    `;
    } else if (props.noHeader) {
      return `
        height: calc(100vh - 130px);
     
    `;
    } else {
      return `
      height: calc(100vh - 260
      px);
    `;
    }
  }}

  img {
    max-width: 100%;
  }
`;

export const Text = styled.h4`
  position: absolute;
  margin-top: 90px;
  margin-left: -40px;
  width: max-content;  
`;
