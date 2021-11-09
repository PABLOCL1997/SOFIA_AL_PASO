import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import useCityPriceList from "../../hooks/useCityPriceList";

const Wrapper = styled.nav`
  width: 100%;
  height: 44px;

  background-color: #cbcbcb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const Bold = styled.b`
  font-weight: bold;
  margin-right: 16px;
`;

const Anchor = styled.a`
  text-decoration: underline;
`;

const B2EBanner = () => {
  const { t } = useTranslation();
  const { idPriceList } = useCityPriceList();

  return idPriceList ? (
    <Wrapper>
      <div>
        <Bold>{t("header.employee.title")}</Bold>
        <span>{t("header.employee.description")}</span>
      </div>
      <Anchor>
        <Link to="/mi-cuenta">{t("header.employee.edit")}</Link>{" "}
      </Anchor>
    </Wrapper>
  ) : null;
};

export default B2EBanner;
