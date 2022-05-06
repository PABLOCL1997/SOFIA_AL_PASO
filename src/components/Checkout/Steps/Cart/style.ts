import styled from "styled-components";
import { BREAKPOINT } from "../../../../utils/constants";

export const Content = {
    Container: styled.main`
        display: grid;
        grid-template-columns: 1fr 90px;
        column-gap: 5px;
        row-gap: 10px;
        padding: 7px 0;

        &:nth-last-child(n+3) {
            border-bottom: 1px solid rgba(0, 0, 0, 0.11);
        }
    `,
    Name: styled.strong`
    text-transform: lowercase;

    font-size: 14px;
    line-height: 20px;

    color: #808080;
    
    &:first-letter {
        text-transform: uppercase;
    }

    `,
    Price: styled.em`
        text-align: right;
        font-size: 14px;
        line-height: 20px;
        color: #808080;
    `,
    Bottom: styled.main`
        display: grid;
        grid-template-columns: 1fr 90px;
    `,
    Subtotal: {
        Wrapper: styled.main`
            display: grid;
            grid-template-columns: 1fr 90px;
            margin-top: 30px;
        `,
        Tag: styled.strong`
            font-family: 'Montserrat', sans-serif;
            font-weight: bold;
            color: var(--black);
            font-size: 14px;
            line-height: 14px;
        `,
        Price: styled.strong`
            text-align: right;
            font-family: 'Montserrat', sans-serif;
            font-weight: bold;
            color: var(--black);
            font-size: 14px;
            line-height: 14px;
        `
    },
}

export const Footer = {
    Wrapper: styled.footer`
      display: none;
      position: fixed;
      width: 100%;
      height: 242px;
      left: 0;
      bottom: 0;
      
      background: linear-gradient(0deg, #FFFFFF 0%, rgba(255, 255, 255, 0.94) 48.91%, rgba(255, 255, 255, 0) 82.18%);
      @media screen and (max-width: ${BREAKPOINT}) {
        display: block;
      }
    `,
    Cta: styled.section`
      position: fixed;
      bottom: 40px;
      width: 100%;
      padding: 0 24px;
  
      a, button {
        width: 100%;
        font-size: 12px;
        line-height: 16px;
        text-transform: uppercase;
        height: 40px;
      }
  
    `
  }