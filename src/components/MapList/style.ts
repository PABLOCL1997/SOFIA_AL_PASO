import styled from "styled-components";
import { customStyles } from "../../utils/constants";

export const Container = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
`;

export const Card = styled.div<{ isCollapsed?: boolean }>`
  padding: 5px 30px 30px 30px;
  margin: 0 0 20px;
  background-color: white;
  box-shadow: 0 6px 74px rgb(0 0 0 / 6%);
  border-radius: 8px;
  max-height: ${({ isCollapsed }) => (isCollapsed ? "80px" : "720px")};
  height: auto;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
`;

export const CardHeader = styled.div`
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
`;

export const CardTitle = styled.h2`
  font-family: 'MontserratMedium';
  font-size: 20px;
  line-height: 2em;
  color: var(--black);
`;
