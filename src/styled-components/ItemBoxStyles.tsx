import styled from "styled-components";

export const NewLabelV2 = styled.div``;

export const NewDiscount = styled.div`
  position: absolute;
  top: 0;
  right: 20px;
  z-index: 2;

  & > img {
    width: 32px !important;
    height: 48px !important;
  }
`;

export const ProductLink = styled.a`
  img {
  }
`;
export const BottomCard = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 10px;
`;

export const BottomCardHome = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  font-family: MullerRegular;
  font-size: 14px;
`;
