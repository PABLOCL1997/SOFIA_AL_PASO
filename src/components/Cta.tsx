import React, { FC } from "react";
import styled from "styled-components";

const Container = styled.div``;

const Button = styled.button<{ filled: boolean; hover: boolean; active: boolean }>`
  border: 1px solid var(--red);
  background: ${(props) => (props.filled ? "var(--red)" : "none")};
  color: ${(props) => (props.filled ? "var(--white)" : "var(--red)")};
  box-shadow: ${(props) => (props.filled ? "var(--btn-shadow)" : "0 0")};
  ${(props) =>
    props.active
      ? ""
      : `
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.65;
    filter: alpha(opacity=65);
    -webkit-box-shadow: none;
    box-shadow: none;
    `}
  padding: 5px 30px;
  border-radius: 30px;
  transition: all 0.2s linear;
  display: flex;
  align-items: center;
  margin: 0 auto;
  span {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    flex: 1;
  }
  &:hover {
    background: ${(props) => (props.hover ? (!props.filled ? "var(--red)" : "white") : !props.filled ? "white" : "var(--red)")};
    color: ${(props) => (props.hover ? (!props.filled ? "var(--white)" : "var(--red)") : !props.filled ? "var(--red)" : "var(--white)")};
    box-shadow: ${(props) => (props.hover ? (!props.filled ? "var(--btn-shadow)" : "0 0") : !props.filled ? "0 0" : "var(--btn-shadow)")};
  }
  svg {
    filter: ${(props) => (props.filled ? "brightness(100)" : "brightness(0)")};
  }
`;

const Link = styled.a<{ filled: boolean; hover: boolean }>`
  display: inline-block;
  border: 1px solid var(--red);
  background: ${(props) => (props.filled ? "var(--red)" : "none")};
  color: ${(props) => (props.filled ? "var(--white)" : "var(--red)")};
  box-shadow: ${(props) => (props.filled ? "var(--btn-shadow)" : "0 0")};
  padding: 5px 30px;
  border-radius: 30px;
  transition: all 0.2s linear;
  text-decoration: none;
  display: flex;
  align-items: center;
  margin: 0 auto;
  span {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    flex: 1;
  }
  &:hover {
    background: ${(props) => (props.hover ? (!props.filled ? "var(--red)" : "white") : !props.filled ? "white" : "var(--red)")};
    color: ${(props) => (props.hover ? (!props.filled ? "var(--white)" : "var(--red)") : !props.filled ? "var(--red)" : "var(--white)")};
    box-shadow: ${(props) => (props.hover ? (!props.filled ? "var(--btn-shadow)" : "0 0") : !props.filled ? "0 0" : "var(--btn-shadow)")};
  }
  svg {
    filter: ${(props) => (props.filled ? "brightness(100)" : "brightness(0)")};
  }
`;

type Props = {
  filled?: boolean;
  blank?: boolean;
  text: string;
  action: any;
  hover?: boolean;
  icon?: any;
  active?: boolean;
};

const Cta: FC<Props> = ({ filled = false, text, action, blank = false, hover = true, icon = false, active = true }) => {
  return (
    <Container>
      {blank ? (
        <Link hover={hover} filled={filled} href={action} target="_blank">
          <span>{text}</span>
        </Link>
      ) : (
        <Button hover={hover} filled={filled} onClick={action} active={active}>
          <span>{text}</span>
          {icon}
        </Button>
      )}
    </Container>
  );
};

export default Cta;
