import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.span`
    font-size: 24px;
    color: black;
`

type Props = {}

const Loader: FC<Props> = () => {
    return <Container></Container>
}

export default Loader;