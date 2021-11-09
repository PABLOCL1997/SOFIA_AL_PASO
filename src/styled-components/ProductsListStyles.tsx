import styled from "styled-components";
import { customStyles, BREAKPOINT } from "../utils/constants";

export const FiltersWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: ${BREAKPOINT}) {
    display: none;
  }
`;

export const Results = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: ${customStyles.black};
`;

export const Separador = styled.div`
  width: 1px;
  height: 100%;
  background-color: #000000;
  margin: 0 10px;
`;

export const OrderBy = styled.div``;
