import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";

export const CallToAction = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;    
  margin-top: auto;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin-top: 50px;
  }
`;

export const Options = {
  Button: styled.button<{ selected?: boolean, active?: boolean }>`
    border: ${(props) => (props.selected ? "2px solid var(--red)" : "")};
    opacity: ${(props) => (props.active ? "0.5" : "1")};
    width: 126px;
    height: 76px;
    background: #fff;
    border-radius: 8px;
    font-family: MullerRegular;
  `,
  Wrapper: styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;

  `
}