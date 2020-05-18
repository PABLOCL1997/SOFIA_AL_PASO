import React, { FC } from 'react';
import styled from 'styled-components';
import { BREAKPOINT } from '../utils/constants';

const SwitchContainer = styled.div`
    position: relative;
    background: var(--whiter);
    border-radius: 137px;
    display: flex;
    width: fit-content;
    font-size: 14px;
    line-height: 14px;
    font-family: MullerMedium;
    text-transform: uppercase;
    z-index: 0;
`

const Highlight = styled.div<{ alternative: boolean }>`
    background: var(--red);
    position: absolute;
    left: ${props => props.alternative ? '50%' : '0'};
    top: 0;
    height: 100%;
    width: 50%;
    border-radius: 20px;
    z-index: -1;
    transition: all .3s linear;
`

const Option = styled.div<{ selected: boolean }>`
    padding: 15px 50px;
    cursor: pointer;
    transition: color .3s linear;
    color: ${props => props.selected ? 'white' : 'var(--font)'};
    @media screen and (max-width: ${BREAKPOINT}) {
        padding: 15px 40px;
    }
`

type Props = {
    option: string,
    values: Array<{ title: string, value: string }>,
    changeOption: Function
}

const Switch: FC<Props> = ({ option, values, changeOption }) => {
    return <SwitchContainer>
        <Highlight alternative={option === values[1].value}></Highlight>
        {values.map(({ title, value }: { title: string, value: string }) => <Option key={value} selected={option === value} onClick={() => changeOption(value)}>{title}</Option>)}
    </SwitchContainer>
}

export default Switch;