import React, { FC, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from 'react-apollo';
import { GET_USER } from '../graphql/user/queries';
import { SET_USER } from '../graphql/user/mutations';

const Container = styled.span`
    position: fixed;
    background: var(--green);
    color: white;
    bottom: 20px;
    right: 20px;
    padding: 12px 50px 12px 15px;
    border-left: 4px double white;
    font-size: 14px;
    box-shadow: 2px 2px 2px var(--green);
    transform: translateX(calc(100% + 20px));
    transition: transform .3s linear;
    z-index: 5;
    &.visible {
        transform: translateX(0);
    }
`

type Props = {}

const Success: FC<Props> = () => {
    const { data } = useQuery(GET_USER, {});
    const [hideSuccess] = useMutation(SET_USER, { variables: { user: { showSuccess: '' } } });

    useEffect(() => {
        hideSuccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (data.userInfo.length && data.userInfo[0].showSuccess) {
            setTimeout(() => {
                hideSuccess();
            }, 3000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return <Container className={data.userInfo.length && data.userInfo[0].showSuccess ? 'visible' : ''}>
        {data.userInfo.length ? data.userInfo[0].showSuccess : ''}
    </Container>
}

export default Success;