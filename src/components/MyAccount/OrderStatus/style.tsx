import styled from "styled-components";
import { customStyles } from "../../../utils/constants";

export const Estado = styled.div`
  display: flex;
  align-items: center;
  span {
    font-size: 14px;
    line-height: 20px;
    color: ${customStyles.black};
    padding-left: 5px;
  }
  img {
    cursor: pointer;
    margin: 0 10px;
  }
`;
Estado.displayName = "Estado";

export const EstadoCircle = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;
EstadoCircle.displayName = "EstadoCircle";
