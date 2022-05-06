import styled from "styled-components";
import { LG } from "../../../utils/constants";

export const Wrapper = styled.div`
  background-color: #fafafa;
  padding-bottom: 80px;
  padding-top: 60px;
  position: relative;

  @media (max-width: ${LG}) {
    padding-top: 0;
    padding-bottom: 40px;
    top: -150px;
  }
`;

export const Mask = styled.div<{ maskOn?: boolean }>`
  @media (max-width: ${LG}) {
    position: fixed;
    z-index: 3;
    background-color: #0000006b;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100%;
  }
`;

export const Box = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.09);
  border-radius: 20px;
  top: 20px;
  max-width: 1330px;
  margin: 0 auto 30px;
  position: relative;

  @media (max-width: ${LG}) {
    margin-top: 181px;
    background: transparent;
    box-shadow: none;
  }
`;

export const Divider = styled.div`
  height: 2px;
  background-color: #f0f0f0;
  width: 100%;

  @media (max-width: ${LG}) {
    background-color: #cbcbcb;
    width: 90%;
    margin: 0 auto;
  }

  @media (max-width: 467px) {
    display: none;
  }
`;
