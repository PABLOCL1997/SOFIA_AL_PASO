import styled from "styled-components";
import { BREAKPOINT } from "../../../utils/constants";


export const CallToAction = styled.div`
    margin-top: calc(200px + 116px);
    display: grid;
    justify-content: center;
    width: 100%;
    column-gap: 37px;
    grid-template-columns: 176px 176px;

    @media screen and (max-width: ${BREAKPOINT}) {
        margin: 223px 0 0;
        grid-column: 1/3;
        column-gap: 0;
        button {
            margin-left: 30px;
        }
    }
`

export const Inputs = {
    Wrapper: styled.div`
        display: grid;
        grid-template-columns: 1fr 1fr;
        row-gap: 36px;
        column-gap: 19px;
    `,
    Address: {
        Wrapper: styled.div`
            position: relative;
            grid-column: 1/3;
        `,
        Label: styled.label`
            font-size: 10px;
            padding: 0 24px;
            text-transform: uppercase;        
        `,
        Input: styled.input`
            position: relative;
            border-radius: 44px;
            background: #F0F0F0;
            border: none;
            padding: 13px 34px 13px 44px;
            width: calc(100% - 48px);
            font-size: 14px;
            font-family: MullerRegular;
            
            @media screen and (max-width: ${BREAKPOINT}) {
                width: calc(100% - 48px);
                padding: 13px 0px 13px 44px;
            }
        `,
        Pin: styled.span`
            position: absolute;
            top: 50%;
            left: 24px;
        `,
        Icon: styled.span`
            position: absolute;
            cursor: pointer;
            top: 50%;
            right: 24px;
        `
    
    },
    Input: {
        Wrapper: styled.div`
            position: relative;

            @media screen and (max-width: ${BREAKPOINT}) {
                grid-column: 1/3;
            }

        `,
        Label: styled.label`
            font-size: 10px;
            padding: 0 24px;  
            text-transform: uppercase;        
        `,
        Input:styled.input`
            border-radius: 44px;
            background: #F0F0F0;
            border: none;
            padding: 13px 24px;
            font-size: 14px;
            font-family: MullerRegular;

            @media screen and (max-width: ${BREAKPOINT}) {
                width: calc(100% - 48px);
            }

        `,
        Icon: styled.span`
            position: absolute;
            cursor: pointer;
            top: 50%;
            right: 24px;
        `
    },
}

export const Map = {
    Wrapper: styled.div`
        width: 100%;
        height: 100px;

        @media screen and (max-width: ${BREAKPOINT}) {
            width: 272px;
            height: 223px;
        }

    `
}