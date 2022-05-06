import styled from "styled-components";
import { customStyles, transition, LG } from "../../utils/constants";
export const Wrapper = styled.div``;

export const Line = styled.div`
  content: "";
  width: 100%;
  height: 2px;
  background-color: #f0f0f0;
  position: absolute;
  top: 58px;
  left: 0;
  right: 0;
  z-index: 0;
  display: none;

  @media (max-width: 467px) {
    display: block;
  }
`;

export const Lista = styled.ul<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 18px 30px 10px;

  position: relative;

  background-color: ${(props) => (props.active ? "#fbfcfc" : "#ffffff")};

  border-radius: 20px;

  @media (max-width: ${LG}) {
    padding: 18px 30px 0;
    background-color: transparent;
    justify-content: space-between;
  }

  @media (max-width: 467px) {
    width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    display: block;
    height: 72px;

    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const Item = styled.li<{ active?: boolean }>`
  margin-right: 6px;
  cursor: pointer;
  padding: 10px;
  position: relative;

  @media (max-width: ${LG}) {
    margin-right: 5px;
    margin-left: 5px;
    padding: 0 0 10px 0;
  }

  @media (max-width: 467px) {
    padding: 10px 20px;
    margin: 0 10px;
    display: inline-block;
    clear: both;
  }

  &:before {
    content: "";
    position: absolute;
    right: 0;
    bottom: -12px;
    background-color: ${customStyles.red};
    width: ${(props) => (props.active ? "90%" : "0")};
    height: 2px;
    left: 50%;
    transform: translate(-50%, 0);

    transition: ${transition("ease-out", "0.4s")};

    @media (max-width: ${LG}) {
      width: ${(props) => (props.active ? "100%" : "0")};
      left: 51%;
      bottom: -2px;
      z-index: 2;
    }
  }
`;

export const Image = styled.img`
  margin-right: 8px;
`;

export const Text = styled.span<{ active?: boolean }>`
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => (props.active ? customStyles.red : customStyles.black)};
  font-family: 'Montserrat', sans-serif;
  font-weight: ${(props) => (props.active ? "500" : "400")};

  @media (max-width: ${LG}) {
    font-size: 13px;
  }
`;
