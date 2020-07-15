import React, { FC, Suspense, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Desktop, Mobile } from '../ResponsiveContainers';
import { BREAKPOINT } from '../../utils/constants';
import { SUBSCRIBE, SET_USER } from '../../graphql/user/mutations';
import { useMutation } from 'react-apollo';
import { isValidEmail } from '../../utils/string';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Loader'));
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */'../Cta'));
const HeaderLogo = React.lazy(() => import(/* webpackChunkName: "HeaderLogo" */'../Images/HeaderLogo'));

const Container = styled.div`
    background: #ebebeb url(/images/salad.png) top right no-repeat;
    background-size: 400px;
    width: calc(100% - 120px);
    margin: auto;
    padding: 45px 95px;
    border-radius: 15px;
    box-shadow: 25px 19px 0px #fecd00;
    @media screen and (min-width: ${BREAKPOINT}) and (max-width: 1300px) {
        background: none;
    }
`

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    span {
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        letter-spacing: 0.105em;
        text-transform: uppercase;
        color: var(--red);
        margin-left: 15px;
    }
`

const Notifications = styled.h3`
    margin: 60px 0 16px;
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.24em;
    color: var(--red);
    @media screen and (max-width: ${BREAKPOINT}) {
        margin: 30px 0;
        text-align: center;
        font-size: 12px;
    }
`

const Title = styled.h2`
    font-family: MullerBold;
    font-size: 40px;
    line-height: 47px;
    letter-spacing: 0.015em;
    color: var(--dark);
    max-width: 660px;
    @media screen and (max-width: ${BREAKPOINT}) {
        text-align: center;
        font-size: 24px;
        line-height: 117.5%;
    }
`

const InputGroup = styled.div`
    margin: 40px 0;
    display: flex;
    max-width: 600px;
    background: var(--f-gray);
    border-radius: 30px;
    input {
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        background: none;
        border: 0;
        padding: 15px 30px;
        flex: 1;
    }
    @media screen and (max-width: ${BREAKPOINT}) {
        flex-direction: column;
        background: none;
        width: 100%;
        input {
            text-align: center;
            background: var(--f-gray);
            border-radius: 30px; 
        }
    }
`
const CtaWrapper = styled.div`
    button {
        padding: 15px 40px;
        text-transform: uppercase;
        span {
            font-family: MullerBold;
            font-size: 12px;
            line-height: 12px;
        }
        @media screen and (max-width: ${BREAKPOINT}) {
            width: 100%;
            margin-top: 10px;
        }
    }
`

const Text = styled.div`
    font-size: 16px;
    line-height: 152.5%;
    letter-spacing: 0.01em;
    color: var(--font);
    max-width: 412px;
`

const MobileContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    border-radius: 19px;
    margin: 20px;
    align-items: center;
    box-shadow: 0px 8px 80px rgba(0, 0, 0, 0.12);
    padding: 30px;
    margin-top: 80px;
`

const Image = styled.img`
    transform: rotate(90deg);
    width: calc(100% + 15px);
    margin-bottom: -55px;
    @media screen and (max-width: ${BREAKPOINT}) {
        width: calc(100% - 30px);
        margin-bottom: -80px;
    }
`

type Props = {}

const Subscribe: FC<Props> = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [subscribe] = useMutation(SUBSCRIBE, { variables: { email } });
    const [showError] = useMutation(SET_USER, { variables: { user: { showError: t('homepage.subscribe.error') } } });
    const [showSuccess] = useMutation(SET_USER, { variables: { user: { showSuccess: t('homepage.subscribe.success') } } });

    const doSubscribe = async () => {
        try {
            if (!isValidEmail(email)) throw new Error("");
            const response = await subscribe();
            if (response.data.subscribe.status) showSuccess();
            else showError();
        } catch (e) {
            showError();
        }
    }

    return <Suspense fallback={<Loader />}>
        <>
            <Desktop>
                <Container>
                    <LogoContainer>
                        <HeaderLogo />
                        <span>{t('homepage.subscribe.store')}</span>
                    </LogoContainer>
                    <Notifications>{t('homepage.subscribe.notifications')}</Notifications>
                    <Title>{t('homepage.subscribe.title')}</Title>
                    <InputGroup>
                        <input value={email} onChange={$evt => setEmail($evt.target.value)} placeholder={t('homepage.subscribe.mail')} type="email" />
                        <CtaWrapper>
                            <Cta filled={true} text={t('homepage.subscribe.button')} action={doSubscribe} />
                        </CtaWrapper>
                    </InputGroup>
                    <Text>{t('homepage.subscribe.text')}</Text>
                </Container>
            </Desktop>
            <Mobile>
                <MobileContainer>
                    <LogoContainer>
                        <HeaderLogo />
                    </LogoContainer>
                    <Notifications>{t('homepage.subscribe.notifications')}</Notifications>
                    <Title>{t('homepage.subscribe.title')}</Title>
                    <InputGroup>
                        <input placeholder={t('homepage.subscribe.mail')} type="email" />
                        <CtaWrapper>
                            <Cta filled={true} text={t('homepage.subscribe.button')} action={doSubscribe} />
                        </CtaWrapper>
                    </InputGroup>
                    <Text>{t('homepage.subscribe.text')}</Text>
                    <Image src="/images/salad.png" alt="newsletter" />
                </MobileContainer>
            </Mobile>
        </>
    </Suspense>
}

export default Subscribe;