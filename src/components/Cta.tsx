import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    
`

const Button = styled.button<{ filled: boolean, hover: boolean }>`
    border: 1px solid var(--red);
    background: ${props => props.filled ? 'var(--red)' : 'none'};
    color: ${props => props.filled ? 'var(--white)' : 'var(--red)'};
    box-shadow: ${props => props.filled ? 'var(--btn-shadow)' : '0 0'};
    padding: 5px 30px;
    border-radius: 30px;
    transition: all .2s linear;
    span {
        font-family: MullerMedium;
        font-size: 16px;
        line-height: 16px;
    }
    &:hover {
        background: ${props => props.hover ? (!props.filled ? 'var(--red)' : 'white') : (!props.filled ? 'white' : 'var(--red)')};
        color: ${props => props.hover ? (!props.filled ? 'var(--white)' : 'var(--red)') : (!props.filled ? 'var(--red)' : 'var(--white)')};
        box-shadow: ${props => props.hover ? (!props.filled ? 'var(--btn-shadow)' : '0 0') : (!props.filled ? '0 0' : 'var(--btn-shadow)')};
    }
`

const Link = styled.a<{ filled: boolean, hover: boolean }>`
    display: inline-block;
    border: 1px solid var(--red);
    background: ${props => props.filled ? 'var(--red)' : 'none'};
    color: ${props => props.filled ? 'var(--white)' : 'var(--red)'};
    box-shadow: ${props => props.filled ? 'var(--btn-shadow)' : '0 0'};
    padding: 5px 30px;
    border-radius: 30px;
    transition: all .2s linear;
    text-decoration: none;
    span {
        font-family: MullerMedium;
        font-size: 16px;
        line-height: 16px;
    }
    &:hover {
        background: ${props => props.hover ? (!props.filled ? 'var(--red)' : 'white') : (!props.filled ? 'white' : 'var(--red)')};
        color: ${props => props.hover ? (!props.filled ? 'var(--white)' : 'var(--red)') : (!props.filled ? 'var(--red)' : 'var(--white)')};
        box-shadow: ${props => props.hover ? (!props.filled ? 'var(--btn-shadow)' : '0 0') : (!props.filled ? '0 0' : 'var(--btn-shadow)')};
    }
`

type Props = {
    filled?: boolean,
    blank?: boolean,
    text: string,
    action: any,
    hover?: boolean
}

const Cta: FC<Props> = ({ filled = false, text, action, blank = false, hover = true }) => {
    return <Container>
        {blank ?
            <Link hover={hover} filled={filled} href={action} target="_blank">
                <span>{text}</span>
            </Link> :
            <Button hover={hover} filled={filled} onClick={action}>
                <span>{text}</span>
            </Button>}
    </Container>
}

export default Cta;