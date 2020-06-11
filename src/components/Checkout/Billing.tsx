import React, { FC, Suspense, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { BREAKPOINT } from '../../utils/constants';
import { useQuery } from 'react-apollo';
import { DETAILS } from '../../graphql/user/queries';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));

const Container = styled.div``

const Title = styled.h2`
    font-family: MullerMedium;
    font-size: 16px;
    line-height: 16px;
    color: var(--red);
    margin-bottom: 30px;
`

const Form = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 24px;
    row-gap: 30px;
    @media screen and (max-width: ${BREAKPOINT}) {
        grid-template-columns: 1fr;
        column-gap: 0;
    }
`

const InputGroup = styled.div<{ key: string }>`
    display: flex;
    flex-direction: column;
    label {
        font-family: MullerMedium;
        font-size: 10px;
        line-height: 10px;
        letter-spacing: 0.01em;
        text-transform: uppercase;
        color: var(--font);
        padding-left: 20px;
    }
    input {
        background: var(--whiter);
        border-radius: 44px;
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        display: flex;
        align-items: center;
        letter-spacing: 0.01em;
        color: var(--font);
        padding: 12px 20px;
        border: 0;
        margin-top: 10px;
    }
`

const Other = styled.button`
    font-family: MullerMedium;
    font-size: 14px;
    line-height: 14px;
    text-decoration-line: underline;
    color: var(--red);
    border: 0;
    background: none;
    margin-top: 40px;
    &:hover {
        opacity: .8;
    }
`

type Props = {
    updateOrder: Function
}

const Billing: FC<Props> = ({ updateOrder }) => {
    const { t } = useTranslation();
    const [other, setOther] = useState(false);
    const [inputs, setInputs] = useState({});
    const { data: userData } = useQuery(DETAILS);

    const onChange = (key: string, value: string) => {
        setInputs({
            ...inputs,
            [key]: value
        })
    }

    const loadUser = () => {
        if (userData && userData.details) {
            setInputs({
                firstname: userData.details.firstname,
                lastname: userData.details.lastname,
                email: userData.details.email,
                nit: userData.details.nit
            })
        }
    }

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData]);

    useEffect(() => {
        if (other) setInputs({});
        else loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [other]);

    useEffect(() => {
        if ((inputs as any).email) updateOrder('billing', inputs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputs]);

    return <Suspense fallback={<Loader />}>
        <Container>
            <Title>{t('checkout.billing.title')}</Title>
            <Form>
                {['firstname', 'lastname', 'email', 'nit'].map((key: string) => <InputGroup key={key}>
                    <label>{t('checkout.billing.' + key)}</label>
                    <input value={(inputs as any)[key] || ''} onChange={evt => onChange(key, evt.target.value)} pattern={key === 'nit' ? '[0-9]*' : ''} type={key === 'nit' ? 'number' : 'text'} placeholder={t('checkout.billing.' + key)} />
                </InputGroup>)}
            </Form>
            <Other onClick={() => setOther(!other)}>{t(!other ? 'checkout.billing.other_person' : 'checkout.billing.to_me')}</Other>
        </Container>
    </Suspense>
}

export default Billing;