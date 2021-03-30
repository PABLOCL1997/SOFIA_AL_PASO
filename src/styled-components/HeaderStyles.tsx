import styled from "styled-components";
import { customStyles } from "../utils/constants";

export const IngresarWrap = styled.div<{ action?: any }>`
  cursor: pointer;
  margin: 0 0 0 auto;
  padding-right: 25px;

  img {
    margin-right: 5px;
  }

  span {
    font-size: 14px;
    line-height: 20px;
    color: ${customStyles.red};
    font-family: MullerMedium;
  }
`;

export const AddressHeader = styled.div`
  > div {
    grid-template-columns: 20px 100%;
    margin-right: 20px;
    display:grid;
  }

  span {
    line-height: 15px;
    max-height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;


export const RightMenu = styled.div`

display:flex;
align-items: center;

>div{
  margin-left:15px;
  margin-bottom:0;

  svg{
    width: 20px;
    position: relative;
    top: 3px;
  }
}

`
