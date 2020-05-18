import React, { FC, Suspense, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const Switch = React.lazy(() => import(/* webpackChunkName: "Switch" */'../Switch'));

const Container = styled.div``

const Title = styled.h2`
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    color: var(--red);
    margin-bottom: 30px;
`

const Disclaimer = styled.div`
    font-family: MullerMedium;
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.01em;
    color: var(--black);
    margin-top: 20px;
`

type Props = {
    updateOrder: Function
}

const Payment: FC<Props> = ({ updateOrder }) => {
    const { t } = useTranslation();
    const [option, setOption] = useState('cash');

    const changeOption = (val: string) => {
        setOption(val);
        updateOrder('payment', { method: option });
    }

    const values = [
        {
            title: t('checkout.payment.cash'),
            value: 'cash'
        },
        {
            title: t('checkout.payment.card'),
            value: 'card'
        }
    ]

    return <Suspense fallback={<Loader />}>
        <Container>
            <Title>{t('checkout.payment.title')}</Title>
            <Switch changeOption={changeOption} option={option} values={values} />
            <Disclaimer>{t('checkout.payment.bs_only')}</Disclaimer>
        </Container>
    </Suspense>
}

export default Payment;