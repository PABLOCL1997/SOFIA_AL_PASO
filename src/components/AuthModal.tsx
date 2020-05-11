import React, { FC, Suspense, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-apollo';
import { SET_USER, SIGN_UP, LOGIN, RECOVER, RESET } from '../graphql/user/mutations';
import { GET_USER } from '../graphql/user/queries';
import { googleLogin, facebookLogin } from '../utils/social';
import { useParams } from 'react-router-dom';

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */'./Loader'));
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */'./Cta'));
const Google = React.lazy(() => import(/* webpackChunkName: "Google" */'./Images/Google'));
const Facebook = React.lazy(() => import(/* webpackChunkName: "Facebook" */'./Images/Facebook'));

const ModalCourtain = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0,.3);
    z-index: 4;
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    &.visible {
        display: flex;
    }
`

const Modal = styled.div`
    padding: 42px;
    background: white;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 380px;
    max-width: 100%;

    input {
        background: var(--f-gray);
        border-radius: 44px;
        width: calc(100% - 60px);
        border: 0;
        padding: 15px 30px;
        margin-bottom: 20px;
        font-family: MullerMedium;
        font-size: 14px;
        line-height: 14px;
        letter-spacing: 0.01em;
        color: var(--font);
    }
`

const Title = styled.h2`
    font-family: MullerMedium;
    font-size: 24px;
    line-height: 24px;
    color: var(--black);
    margin-bottom: 20px;
`

const Description = styled.p`
    font-family: MullerMedium;
    font-size: 12px;
    line-height: 137%;
    letter-spacing: 0.01em;
    color: var(--font);
    margin-bottom: 20px;
    max-width: 250px;
    text-align: center;
`

const Link = styled.span<{ position?: string }>`
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.01em;
    text-decoration-line: underline;
    color: var(--red);
    cursor:pointer;
    display: ${props => props.position ? 'block' : 'inline-block'};
    width: 100%;
    text-align: ${props => props.position ? props.position : 'left'};
    margin-bottom: 20px;
    &:hover {
        opacity: .8;
    }
`

const CtaWrapper = styled.div`
    width: 100%;
    button {
        width: 100%;
        padding: 15px 30px;
        text-transform: uppercase;
    }
    margin-bottom: 20px;
`

const Line = styled.div`
    border-bottom: 2px solid rgba(0, 0, 0, 0.11);
    width: 100%;
    margin-bottom: 20px;
`

const SocialButton = styled.button<{ network: string }>`
    width: 190px;
    border: 1px solid var(--${props => props.network});
    padding: 10px 20px;
    display: flex;
    align-items: center;
    border-radius: 20px;
    margin-bottom: 20px;
    transition: all .3s linear;
    svg {
        margin-right: 10px;
    }
    span, b {
        font-size: 12px;
        line-height: 12px;
        color: var(--${props => props.network});
    }
    b {
        font-family: MullerBold;
        margin-left: 5px;
    }
    &:hover {
        background: var(--${props => props.network}); 
        * {
            filter: brightness(100);
        } 
    }
`

const Disclaimer = styled.div`
    font-size: 12px;
    line-height: 12px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.01em;
    color: var(--black);

    span {
        width: auto;
        margin-bottom: 0;
        margin-right: 5px;
    }
`

type Props = {}

type User = {
    id?: Number,
    isLoggedIn?: Boolean,
    openLoginModal?: Boolean
}

type FormData = {
    email: String,
    password?: String,
    rpassword?: String,
    firstname?: String,
    lastname?: String,
    network?: Boolean
}

const Steps = {
    Login: 0,
    SignUp: 1,
    ForgotPassword: 2,
    ForgotPasswordMsg: 3,
    ResetPassword: 4
}

const AuthModal: FC<Props> = () => {
    let { token } = useParams();
    const { t } = useTranslation();
    const { data } = useQuery(GET_USER, {});
    const [step, setStep] = useState(Steps.Login);
    const [user, setUser] = useState<User>({});
    const [form, setForm] = useState<FormData>({ email: '' });

    const [doSignUp] = useMutation(SIGN_UP, { variables: { email: form.email, password: form.password, firstname: form.firstname, lastname: form.lastname } });
    const [doLogin] = useMutation(LOGIN, { variables: { email: form.email, password: form.password } });
    const [doRecover] = useMutation(RECOVER, { variables: { email: form.email } });
    const [doReset] = useMutation(RESET, { variables: { email: form.email, token, password: form.password } });
    const [updateUser] = useMutation(SET_USER, { variables: { user } });
    const [closeLoginModal] = useMutation(SET_USER, { variables: { user: { openLoginModal: false } } });
    const [openLoginModal] = useMutation(SET_USER, { variables: { user: { openLoginModal: true } } });

    useEffect(() => {
        closeLoginModal();
        if (token) {
            setStep(Steps.ResetPassword);
            openLoginModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (user.isLoggedIn) updateUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const login = async () => {
        try {
            const response: any = await doLogin();
            setUser({
                openLoginModal: false,
                isLoggedIn: true,
                id: response.data.login.id
            });
        } catch (e) {
            console.log(e);
        }
    };

    const networkCallback = async ({ email, firstname, lastname, password }: FormData) => {
        setForm({
            ...form,
            email,
            firstname,
            lastname,
            password,
            network: true
        })
        const response = await doSignUp();
        setUser({
            openLoginModal: false,
            isLoggedIn: true,
            id: response.data.signup.id
        });
    }

    const loginWithGoogle = async () => {
        googleLogin(networkCallback);
    };

    const loginWithFacebook = async () => {
        facebookLogin(networkCallback);
    };

    const signUp = async () => {
        try {
            const response = await doSignUp();
            setUser({
                openLoginModal: false,
                isLoggedIn: true,
                id: response.data.signup.id
            });
        } catch (e) {
            console.log(e);
        }
    };

    const recoverPassword = async () => {
        await doRecover();
        setStep(Steps.ForgotPasswordMsg)
    }

    const resetPassword = async () => {
        const response = await doReset();
        setStep(Steps.Login);
    }

    const closeModal = () => {
        setStep(Steps.Login);
        closeLoginModal();
    }

    return <Suspense fallback={<Loader />}>
        <ModalCourtain className={(!data.userInfo.length || data.userInfo[0].openLoginModal) && 'visible'}>
            {step === Steps.Login && <Modal>
                <Title>{t('auth_modal.login.title')}</Title>
                <input type="email" onChange={$evt => setForm({ ...form, email: $evt.target.value })} placeholder={t('auth_modal.login.email')} />
                <input type="password" onChange={$evt => setForm({ ...form, password: $evt.target.value })} placeholder={t('auth_modal.login.password')} />
                <Link position="right" onClick={() => setStep(Steps.ForgotPassword)}>{t('auth_modal.login.forget_password')}</Link>
                <CtaWrapper>
                    <Cta filled={true} action={login} text={t('auth_modal.login.button')} />
                </CtaWrapper>
                <Line />
                <SocialButton className={'googleBtn'} onClick={loginWithGoogle} network="google">
                    <Google />
                    <span>{t('auth_modal.login.google.text')}</span>
                    <b>{t('auth_modal.login.google.network')}</b>
                </SocialButton>
                <SocialButton onClick={loginWithFacebook} network="facebook">
                    <Facebook />
                    <span>{t('auth_modal.login.facebook.text')}</span>
                    <b>{t('auth_modal.login.facebook.network')}</b>
                </SocialButton>
                <Disclaimer>
                    <span>{t('auth_modal.login.disclaimer.no_account')}</span>
                    <Link onClick={() => setStep(Steps.SignUp)}>{t('auth_modal.login.disclaimer.sign_up')}</Link>
                </Disclaimer>
            </Modal>}
            {step === Steps.SignUp && <Modal>
                <Title>{t('auth_modal.sign_up.title')}</Title>
                <input type="email" onChange={$evt => setForm({ ...form, email: $evt.target.value })} placeholder={t('auth_modal.sign_up.email')} />
                <input type="password" onChange={$evt => setForm({ ...form, password: $evt.target.value })} placeholder={t('auth_modal.sign_up.password')} />
                <input type="password" onChange={$evt => setForm({ ...form, rpassword: $evt.target.value })} placeholder={t('auth_modal.sign_up.r_password')} />
                <CtaWrapper>
                    <Cta filled={true} action={signUp} text={t('auth_modal.sign_up.button')} />
                </CtaWrapper>
                <Line />
                <SocialButton className={'googleBtn'} onClick={loginWithGoogle} network="google">
                    <Google />
                    <span>{t('auth_modal.sign_up.google.text')}</span>
                    <b>{t('auth_modal.sign_up.google.network')}</b>
                </SocialButton>
                <SocialButton onClick={loginWithFacebook} network="facebook">
                    <Facebook />
                    <span>{t('auth_modal.sign_up.facebook.text')}</span>
                    <b>{t('auth_modal.sign_up.facebook.network')}</b>
                </SocialButton>
                <Disclaimer>
                    <span>{t('auth_modal.sign_up.disclaimer.account')}</span>
                    <Link onClick={() => setStep(Steps.Login)}>{t('auth_modal.sign_up.disclaimer.login')}</Link>
                </Disclaimer>
            </Modal>}
            {step === Steps.ForgotPassword && <Modal>
                <Title>{t('auth_modal.forgot_password.title')}</Title>
                <Description>{t('auth_modal.forgot_password.subtitle')}</Description>
                <input type="email" onChange={$evt => setForm({ ...form, email: $evt.target.value })} placeholder={t('auth_modal.forgot_password.email')} />
                <CtaWrapper>
                    <Cta filled={true} action={recoverPassword} text={t('auth_modal.forgot_password.button')} />
                </CtaWrapper>
                <Link position="center" onClick={() => setStep(Steps.Login)}>{t('auth_modal.forgot_password.back')}</Link>
            </Modal>}
            {step === Steps.ForgotPasswordMsg && <Modal>
                <Title>{t('auth_modal.forgot_password.message.title')}</Title>
                <Description>{t('auth_modal.forgot_password.message.subtitle')}</Description>
                <CtaWrapper>
                    <Cta filled={true} action={closeModal} text={t('auth_modal.forgot_password.message.button')} />
                </CtaWrapper>
                <Disclaimer>
                    <span>{t('auth_modal.forgot_password.message.disclaimer.no_message')}</span>
                    <Link onClick={recoverPassword}>{t('auth_modal.forgot_password.message.disclaimer.retry')}</Link>
                </Disclaimer>
            </Modal>}
            {step === Steps.ResetPassword && <Modal>
                <Title>{t('auth_modal.reset_password.title')}</Title>
                <Description>{t('auth_modal.reset_password.subtitle')}</Description>
                <input type="email" onChange={$evt => setForm({ ...form, email: $evt.target.value })} placeholder={t('auth_modal.reset_password.email')} />
                <input type="password" onChange={$evt => setForm({ ...form, password: $evt.target.value })} placeholder={t('auth_modal.reset_password.password')} />
                <input type="password" onChange={$evt => setForm({ ...form, rpassword: $evt.target.value })} placeholder={t('auth_modal.reset_password.r_password')} />
                <CtaWrapper>
                    <Cta filled={true} action={resetPassword} text={t('auth_modal.reset_password.button')} />
                </CtaWrapper>
            </Modal>}
        </ModalCourtain>
    </Suspense>
}

export default AuthModal;