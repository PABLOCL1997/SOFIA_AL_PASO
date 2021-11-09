import styled from "styled-components";
import { BREAKPOINT } from "../../utils/constants";

export const ListItem = styled.span`
  color: #767474;
  font-size: 12px;
  line-height: 16px;

  svg {
    transform: rotate(90deg);
  }
`;

export const ListItemTitle = styled.span`
  margin: 0;

  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 0 6.5px;
  }
`;
