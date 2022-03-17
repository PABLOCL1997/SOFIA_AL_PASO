import styled from "styled-components";

export const Link = styled.a`
  &:focus {
    outline: none;
  }
`;

export const LogoWhatsApp = {
  Wrapper: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background-color: #4cca5a;
    font-weight: bold;
    width: 220px;
    border-radius: 100px;
    padding: 5px;
    margin-top: 20px;
    margin-bottom: 50px;
    &:hover {
      cursor: pointer;
    }
  `,
  Img: styled.img`
    width: 30px;
  `,
  Title: styled.h4`
    word-break: break-word;
    width: 120px;
    text-align: center;
    color: white;
  `
};