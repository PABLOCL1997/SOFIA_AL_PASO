import React, { FC } from "react";
import styled from "styled-components";

const SwitchContainer = styled.div`
  position: relative;
  background: var(--whiter);
  border-radius: 137px;
  display: flex;
  width: 100%;
  font-size: 14px;
  line-height: 14px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 0;
`;

const Highlight = styled.div<{ index: number; size: number }>`
  background: var(--red);
  position: absolute;
  left: ${(props) => (props.index ? `${(100 / props.size) * props.index}%` : "0")};
  top: 0;
  height: 100%;
  width: ${(props) => `${100 / props.size}%`};
  border-radius: 20px;
  z-index: -1;
  transition: all 0.3s linear;
`;

const Option = styled.div<{ selected: boolean; size: number }>`
  padding: 15px 0;
  cursor: pointer;
  transition: color 0.3s linear;
  text-align: center;
  width: ${(props) => `${100 / props.size}%`};
  color: ${(props) => (props.selected ? "white" : "var(--font)")};
  display: flex;
  justify-content: center;
  align-items: center;
`;

type Props = {
  option: string;
  values: Array<{ title: string; value: string }>;
  changeOption: Function;
};

const Switch: FC<Props> = ({ option, values, changeOption }) => {
  const index = () => {
    let index = values.findIndex(({ value }: { value: string }) => option === value);
    return index >= 0 ? index : 0;
  };

  return (
    <SwitchContainer>
      <Highlight size={values.length} index={index()}></Highlight>
      {values.map(({ title, value }: { title: string; value: string }) => (
        <Option size={values.length} key={value} selected={option === value} onClick={() => changeOption(value)}>
          {title}
        </Option>
      ))}
    </SwitchContainer>
  );
};

export default Switch;
