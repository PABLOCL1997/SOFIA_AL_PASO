import styled from "styled-components";
import { customStyles, BREAKPOINT } from "../utils/constants";

export const BreadWrap = styled.div`
  margin: 15px 0;
  padding: 0;
  ul {
    li {
      a {
        color: ${customStyles.darkGrey};
        font-size: 12px;
        line-height: 16px;
      }
    }
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 15px 15px 0 15px;
  }
`;
