import styled from "styled-components";
import ArrowPrev from "../assets/images/arrow-prev.svg";
import ArrowNext from "../assets/images/arrow-next.svg";
import { BREAKPOINT, customStyles } from "../utils/constants";

export const Wrapper = styled.div`
  .slick-dots {
    bottom: 10px;

    li {
      background-color: grey;
      width: 10px;
      height: 10px;
      border: 1px solid #cbcbcb;
      background-color: #ffffff;
      border-radius: 50%;

      &.slick-active {
        background-color: ${customStyles.yellow};
        border-color: ${customStyles.black};
      }

      button {
        &:before {
          display: none;
        }
      }
    }
  }

  .slick-arrow {
    &:before {
      display: none;
    }
  }

  .slick-arrow.slick-next {
    background: url(${ArrowNext}) no-repeat center center / contain;
    right: -32px;
  }

  .slick-arrow.slick-prev {
    background: url(${ArrowPrev}) no-repeat center center / contain;
    left: -32px;
  }
`;
export const ImageContainer = styled.div<{ bg?: string }>`
  height: 100px;
  width: 100%;

  background: url("${(props) => props.bg}") no-repeat center center / cover;

  @media screen and (max-width: ${BREAKPOINT}) {
    background: url("${(props) => props.bg}") no-repeat center center / 100%;
  }
`;

export const LINK = styled.div`
  cursor: pointer;
`;
