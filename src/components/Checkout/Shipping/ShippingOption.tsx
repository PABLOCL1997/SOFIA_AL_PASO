import React, { FC } from "react";
import styled from "styled-components";
import { ShippingOptions } from "./types";

import * as Icons from "../../../assets/employee/Icons";

const Wrapper = styled.div<{ selected: boolean }>`
  border-radius: 12px;
  background: #f0f0f0;
  display: grid;
  grid-template-columns: 54px 1fr 108px;
  margin-bottom: 20px;
  align-items: center;
  padding: 21px 24px 21px 32px;

  ${({ selected }) => selected && ` background: #FECD00;`}
`;

const TitleStreet = styled.div<{ selected: boolean }>`
  h3 {
    font-family: MullerMedium;
    font-size: 16px;
    margin-bottom: 4px;
  }
  p {
    font-family: MullerRegular;
    font-size: 12px;
    color: #767474;
  }
  ${({ selected }) =>
    !selected &&
    `
        p {
            display: none;
        }
    `}
`;

const Chip = styled.p`
  background: rgba(220, 220, 220, 0.5);
  border-radius: 23px;
  padding: 4px 10px;
  font-size: 12px;
`;

const ChipWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const CallToAction = styled.a`
  font-size: 14px;
  font-family: MullerMedium;

  color: var(--red);

  text-decoration: underline;

  cursor: pointer;
  @media screen and (max-width: 420px) {
    margin-left: 20px;
  }
`;

const ShippingOption: FC<{
  option: ShippingOptions;
  title: string;
  description: string;
  street: string;
  isSelected: boolean;
  hasValidAddress?: boolean;

  onSelect: () => void;
  onInfo: () => void;
  onAddAddress: () => void;
}> = ({ option, title, description, street, isSelected, onSelect, onInfo, onAddAddress, hasValidAddress = true }) => {
  const selectText = "Seleccionar";
  const infoText = "Más información";
  const addAddressText = "Agregar dirección";
  return (
    <Wrapper selected={isSelected}>
      {option === ShippingOptions.Employee ? <Icons.Employee /> : null}
      {option === ShippingOptions.Delivery ? <Icons.Delivery /> : null}
      {option === ShippingOptions.Pickup ? <Icons.Pickup /> : null}
      {/* if it isn't selected shouldn't show street */}
      <TitleStreet selected={isSelected}>
        <h3>{title}</h3>
        <p>{street}</p>
      </TitleStreet>
      <CallToAction onClick={!hasValidAddress ? onAddAddress : isSelected ? onInfo : onSelect}>{!hasValidAddress ? addAddressText : isSelected ? infoText : selectText}</CallToAction>
    </Wrapper>
  );
};

export default ShippingOption;
