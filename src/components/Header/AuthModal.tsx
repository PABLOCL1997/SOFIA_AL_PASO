import React, { FC, Suspense, useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-apollo";
import {
  SET_USER,
  SIGN_UP,
  LOGIN,
  RECOVER,
  RESET
} from "../../graphql/user/mutations";
import { GET_USER } from "../../graphql/user/queries";
import { googleLogin, facebookLogin } from "../../utils/social";
import { token as StoreToken } from "../../utils/store";
import { useParams, useHistory } from "react-router-dom";

const Loader = React.lazy(
  () => import(/* webpackChunkName: "Loader" */ "../Loader")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Cta"));

const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 400;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.visible {
    display: flex;
  }
`;

const Modal = styled.div`
  position: relative;
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
`;

const CloseWrapper = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  > svg {
    width: 12px;
    height: 12px;
  }
`;

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-family: MullerMedium;
  font-size: 12px;
  line-height: 137%;
  letter-spacing: 0.01em;
  color: var(--font);
  margin-bottom: 20px;
  max-width: 250px;
  text-align: center;
`;

const Link = styled.span<{ position?: string }>`
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.01em;
  text-decoration-line: underline;
  color: var(--red);
  cursor: pointer;
  display: ${props => (props.position ? "block" : "inline-block")};
  width: 100%;
  text-align: ${props => (props.position ? props.position : "left")};
  margin-bottom: 20px;
  &:hover {
    opacity: 0.8;
  }
`;

const CtaWrapper = styled.div`
  width: 100%;
  button {
    width: 100%;
    padding: 15px 30px;
    text-transform: uppercase;
  }
  margin-bottom: 20px;
`;

const Line = styled.div`
  border-bottom: 2px solid rgba(0, 0, 0, 0.11);
  width: 100%;
  margin-bottom: 20px;
`;

const SocialButton = styled.button<{ network: string }>`
  width: 190px;
  border: 1px solid var(--${props => props.network});
  background: white;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  margin-bottom: 20px;
  transition: all 0.3s linear;
  svg {
    margin-right: 10px;
  }
  span,
  b {
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
`;

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
`;

const LoaderWrapper = styled.div`
  position: absolute;
  background: white;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 20px;
  img {
    width: 50px;
  }
`;
const LoginError = styled.div`
font-size: 12px;
color: var(--red);
max-width: 250px;
margin-bottom: 15px;
margin-left:-15px; 
`;

type Props = {};

type User = {
  id?: Number;
  isLoggedIn?: Boolean;
  openLoginModal?: Boolean;
  idPriceList?: Number;
};

type FormData = {
  email: String;
  password?: String;
  rpassword?: String;
  firstname?: String;
  lastname?: String;
  network?: Boolean;
};

const Steps = {
  Login: 0,
  SignUp: 1,
  ForgotPassword: 2,
  ForgotPasswordMsg: 3,
  ResetPassword: 4
};

const AuthModal: FC<Props> = () => {
  let { token } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const { data } = useQuery(GET_USER, {});
  const [step, setStep] = useState(Steps.Login);
  const [user, setUser] = useState<User>({});
  const [form, setForm] = useState<FormData>({ email: "" });
  const [loader, setLoader] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const [doSignUp] = useMutation(SIGN_UP);
  const [doLogin] = useMutation(LOGIN, {
    variables: { email: form.email, password: form.password }
  });
  const [doRecover] = useMutation(RECOVER, {
    variables: { email: form.email }
  });
  const [doReset] = useMutation(RESET, {
    variables: { email: form.email, token, password: form.password }
  });
  const [updateUser] = useMutation(SET_USER, { variables: { user } });
  const [closeLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: false } }
  });
  const [openLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: true } }
  });
  const [showError] = useMutation(SET_USER, {
    variables: { user: { showError: t("auth_modal.error") } }
  });
  const [showSuccess] = useMutation(SET_USER, {
    variables: { user: { showSuccess: t("auth_modal.success") } }
  });

  useEffect(() => {
    closeLoginModal();
    if (token) {
      setStep(Steps.ResetPassword);
      openLoginModal();
    }
    loginWithGoogle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loginWithGoogle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (user.isLoggedIn) updateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const login = async () => {
    try {
      setLoader(true);
      setLoginError(false)
      const response: any = await doLogin();
      setUser({
        openLoginModal: false,
        isLoggedIn: true,
        id: response.data.login.id,
        // TODO Revisar 
        idPriceList: 0
      });
      StoreToken.set(response.data.login.token);
      if ((window as any).navigateToCheckout) history.push("/checkout");
    } catch (e) {
      setLoginError(true)
    }
    setLoader(false);
  };

  const networkCallback = async ({
    email,
    firstname,
    lastname,
    password
  }: FormData) => {
    try {
      setLoader(true);
      const response = await doSignUp({
        variables: {
          ...form,
          email,
          firstname,
          lastname,
          password,
          network: true
        }
      });
      setUser({
        openLoginModal: false,
        isLoggedIn: true,
        id: response.data.signup.id
      });
      StoreToken.set(response.data.signup.token);
      showSuccess();
      if ((window as any).navigateToCheckout) history.push("/checkout");
    } catch (e) {
      showError();
    }
    setLoader(false);
  };

  const loginWithGoogle = async () => {
    googleLogin(networkCallback);
  };

  const loginWithFacebook = async () => {
    facebookLogin(networkCallback);
  };

  const signUp = async () => {
    try {
      if (form.password === "" || form.password !== form.rpassword)
        throw new Error("error");
      setLoader(true);
      const response = await doSignUp({
        variables: {
          email: form.email,
          password: form.password,
          firstname: form.firstname,
          lastname: form.lastname,
          network: false
        }
      });
      setUser({
        openLoginModal: false,
        isLoggedIn: true,
        id: response.data.signup.id,
        idPriceList: 0
      });
      StoreToken.set(response.data.signup.token);
      showSuccess();
      if ((window as any).navigateToCheckout) history.push("/checkout");
    } catch (e) {
      showError();
    }
    setLoader(false);
  };

  const recoverPassword = async () => {
    try {
      setLoader(true);
      await doRecover();
      setStep(Steps.ForgotPasswordMsg);
      showSuccess();
    } catch (e) {
      showError();
    }
    setLoader(false);
  };

  const resetPassword = async () => {
    try {
      setLoader(true);
      await doReset();
      setStep(Steps.Login);
      history.push("/");
      showSuccess();
    } catch (e) {
      showError();
    }
    setLoader(false);
  };

  const closeModal = () => {
    setStep(Steps.Login);
    setLoginError(false);
    closeLoginModal();
    (window as any).navigateToCheckout = false;
  };

  return (
    <Suspense fallback={<Loader />}>
      <ModalCourtain
        className={
          (!data.userInfo.length || data.userInfo[0].openLoginModal) &&
          "visible"
        }
      >

        {step === Steps.Login && (
          <Modal>
            {loader && (
              <LoaderWrapper>
                <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
              </LoaderWrapper>
            )}
            <CloseWrapper onClick={closeModal}>
              {/* close */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </CloseWrapper>
            <Title>{t("auth_modal.login.title")}</Title>

            { loginError ?
            (<LoginError>
              {t("auth_modal.login.error")}
            </LoginError>)
            : "" }
            <input
              type="email"
              name="email"
              onKeyUp={evt => {
                if (evt.keyCode === 13) login();
              }}
              onChange={$evt => setForm({ ...form, email: $evt.target.value })}
              placeholder={t("auth_modal.login.email")}
            />
            <input
              type="password"
              name="password"
              onKeyUp={evt => {
                if (evt.keyCode === 13) login();
              }}
              onChange={$evt =>
                setForm({ ...form, password: $evt.target.value })
              }
              placeholder={t("auth_modal.login.password")}
            />
            <Link
              position="right"
              onClick={() => setStep(Steps.ForgotPassword)}
            >
              {t("auth_modal.login.forget_password")}
            </Link>
            <CtaWrapper>
              <Cta
                filled={true}
                action={login}
                text={t("auth_modal.login.button")}
              />
            </CtaWrapper>
            <Line />
            <SocialButton className={"googleBtn"} network="google">
              {/* google */}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.7385 5.31781H6.53428V7.97712H10.0508C9.48853 9.75 8.09997 10.3407 6.50585 10.3407C5.8881 10.3415 5.27928 10.1932 4.73104 9.90853C4.1828 9.62384 3.71133 9.21111 3.35661 8.70535C3.00189 8.1996 2.77441 7.61574 2.69345 7.00332C2.6125 6.3909 2.68046 5.76799 2.89158 5.18744C3.10269 4.60688 3.45073 4.08582 3.90617 3.66846C4.3616 3.25109 4.91099 2.94975 5.50772 2.78998C6.10445 2.63022 6.73091 2.61675 7.33396 2.75072C7.937 2.88469 8.49883 3.16215 8.97178 3.55956L10.9039 1.71925C10.1258 1.00249 9.18454 0.486482 8.1618 0.216017C7.13905 -0.0544476 6.06574 -0.0711933 5.03505 0.167234C4.00437 0.405661 3.04745 0.892054 2.24738 1.58419C1.44731 2.27632 0.828263 3.15328 0.443987 4.13892C0.0597106 5.12457 -0.078183 6.18911 0.0422774 7.24014C0.162738 8.29116 0.537911 9.2969 1.13523 10.17C1.73254 11.0432 2.53395 11.7573 3.46987 12.2505C4.40579 12.7437 5.44794 13.0009 6.50585 13C10.0898 13 13.3308 10.6364 12.7385 5.31781Z" fill="#E02D37" />
            </svg>
              <span>{t("auth_modal.login.google.text")}</span>
              <b>{t("auth_modal.login.google.network")}</b>
            </SocialButton>
            <SocialButton onClick={loginWithFacebook} network="facebook">
              {/* facebook */}
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.2672 12L2.25 6.75H0V4.5H2.25V3C2.25 0.9756 3.50363 0 5.30954 0C6.17458 0 6.91805 0.0644025 7.13471 0.0931875V2.2088L5.88222 2.20937C4.90007 2.20937 4.7099 2.67607 4.7099 3.36093V4.5H7.5L6.75 6.75H4.70989V12H2.2672Z" fill="#2A5CDC" />
              </svg>
              <span>{t("auth_modal.login.facebook.text")}</span>
              <b>{t("auth_modal.login.facebook.network")}</b>
            </SocialButton>
            <Disclaimer>
              <span>{t("auth_modal.login.disclaimer.no_account")}</span>
              <Link onClick={() => setStep(Steps.SignUp)}>
                {t("auth_modal.login.disclaimer.sign_up")}
              </Link>
            </Disclaimer>
          </Modal>
        )}
        {step === Steps.SignUp && (
          <Modal>
            {loader && (
              <LoaderWrapper>
                <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
              </LoaderWrapper>
            )}
            <CloseWrapper onClick={closeModal}>
              {/* close */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </CloseWrapper>
            <Title>{t("auth_modal.sign_up.title")}</Title>
            <input
              type="email"
              name="email"
              onKeyUp={evt => {
                if (evt.keyCode === 13) signUp();
              }}
              onChange={$evt => setForm({ ...form, email: $evt.target.value })}
              placeholder={t("auth_modal.sign_up.email")}
            />
            <input
              type="password"
              name="password"
              onKeyUp={evt => {
                if (evt.keyCode === 13) signUp();
              }}
              onChange={$evt =>
                setForm({ ...form, password: $evt.target.value })
              }
              placeholder={t("auth_modal.sign_up.password")}
            />
            <input
              type="password"
              name="password"
              onKeyUp={evt => {
                if (evt.keyCode === 13) signUp();
              }}
              onChange={$evt =>
                setForm({ ...form, rpassword: $evt.target.value })
              }
              placeholder={t("auth_modal.sign_up.r_password")}
            />
            <CtaWrapper>
              <Cta
                filled={true}
                action={signUp}
                text={t("auth_modal.sign_up.button")}
              />
            </CtaWrapper>
            <Line />
            <SocialButton className={"googleBtn"} network="google">
              {/* google */}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.7385 5.31781H6.53428V7.97712H10.0508C9.48853 9.75 8.09997 10.3407 6.50585 10.3407C5.8881 10.3415 5.27928 10.1932 4.73104 9.90853C4.1828 9.62384 3.71133 9.21111 3.35661 8.70535C3.00189 8.1996 2.77441 7.61574 2.69345 7.00332C2.6125 6.3909 2.68046 5.76799 2.89158 5.18744C3.10269 4.60688 3.45073 4.08582 3.90617 3.66846C4.3616 3.25109 4.91099 2.94975 5.50772 2.78998C6.10445 2.63022 6.73091 2.61675 7.33396 2.75072C7.937 2.88469 8.49883 3.16215 8.97178 3.55956L10.9039 1.71925C10.1258 1.00249 9.18454 0.486482 8.1618 0.216017C7.13905 -0.0544476 6.06574 -0.0711933 5.03505 0.167234C4.00437 0.405661 3.04745 0.892054 2.24738 1.58419C1.44731 2.27632 0.828263 3.15328 0.443987 4.13892C0.0597106 5.12457 -0.078183 6.18911 0.0422774 7.24014C0.162738 8.29116 0.537911 9.2969 1.13523 10.17C1.73254 11.0432 2.53395 11.7573 3.46987 12.2505C4.40579 12.7437 5.44794 13.0009 6.50585 13C10.0898 13 13.3308 10.6364 12.7385 5.31781Z" fill="#E02D37" />
              </svg>
              <span>{t("auth_modal.sign_up.google.text")}</span>
              <b>{t("auth_modal.sign_up.google.network")}</b>
            </SocialButton>
            <SocialButton onClick={loginWithFacebook} network="facebook">
              {/* facebook */}
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.2672 12L2.25 6.75H0V4.5H2.25V3C2.25 0.9756 3.50363 0 5.30954 0C6.17458 0 6.91805 0.0644025 7.13471 0.0931875V2.2088L5.88222 2.20937C4.90007 2.20937 4.7099 2.67607 4.7099 3.36093V4.5H7.5L6.75 6.75H4.70989V12H2.2672Z" fill="#2A5CDC" />
              </svg>
              <span>{t("auth_modal.sign_up.facebook.text")}</span>
              <b>{t("auth_modal.sign_up.facebook.network")}</b>
            </SocialButton>
            <Disclaimer>
              <span>{t("auth_modal.sign_up.disclaimer.account")}</span>
              <Link onClick={() => setStep(Steps.Login)}>
                {t("auth_modal.sign_up.disclaimer.login")}
              </Link>
            </Disclaimer>
          </Modal>
        )}
        {step === Steps.ForgotPassword && (
          <Modal>
            {loader && (
              <LoaderWrapper>
                <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
              </LoaderWrapper>
            )}
            <CloseWrapper onClick={closeModal}>
              {/* close */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </CloseWrapper>
            <Title>{t("auth_modal.forgot_password.title")}</Title>
            <Description>
              {t("auth_modal.forgot_password.subtitle")}
            </Description>
            <input
              type="email"
              name="password"
              onChange={$evt => setForm({ ...form, email: $evt.target.value })}
              placeholder={t("auth_modal.forgot_password.email")}
            />
            <CtaWrapper>
              <Cta
                filled={true}
                action={recoverPassword}
                text={t("auth_modal.forgot_password.button")}
              />
            </CtaWrapper>
            <Link position="center" onClick={() => setStep(Steps.Login)}>
              {t("auth_modal.forgot_password.back")}
            </Link>
          </Modal>
        )}
        {step === Steps.ForgotPasswordMsg && (
          <Modal>
            {loader && (
              <LoaderWrapper>
                <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
              </LoaderWrapper>
            )}
            <CloseWrapper onClick={closeModal}>
              {/* close */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </CloseWrapper>
            <Title>{t("auth_modal.forgot_password.message.title")}</Title>
            <Description>
              {t("auth_modal.forgot_password.message.subtitle")}
            </Description>
            <CtaWrapper>
              <Cta
                filled={true}
                action={closeModal}
                text={t("auth_modal.forgot_password.message.button")}
              />
            </CtaWrapper>
            <Disclaimer>
              <span>
                {t("auth_modal.forgot_password.message.disclaimer.no_message")}
              </span>
              <Link onClick={recoverPassword}>
                {t("auth_modal.forgot_password.message.disclaimer.retry")}
              </Link>
            </Disclaimer>
          </Modal>
        )}
        {step === Steps.ResetPassword && (
          <Modal>
            {loader && (
              <LoaderWrapper>
                <img src="/images/loader.svg" width="50px" height="50px" alt="loader" />
              </LoaderWrapper>
            )}
            <CloseWrapper onClick={closeModal}>
              {/* close */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L2 16" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
                <path d="M16 16L2 2" stroke="#808080" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </CloseWrapper>
            <Title>{t("auth_modal.reset_password.title")}</Title>
            <Description>{t("auth_modal.reset_password.subtitle")}</Description>
            <input
              type="email"
              name="email"
              onChange={$evt => setForm({ ...form, email: $evt.target.value })}
              placeholder={t("auth_modal.reset_password.email")}
            />
            <input
              type="password"
              name="password"
              onChange={$evt =>
                setForm({ ...form, password: $evt.target.value })
              }
              placeholder={t("auth_modal.reset_password.password")}
            />
            <input
              type="password"
              name="password"
              onChange={$evt =>
                setForm({ ...form, rpassword: $evt.target.value })
              }
              placeholder={t("auth_modal.reset_password.r_password")}
            />
            <CtaWrapper>
              <Cta
                filled={true}
                action={resetPassword}
                text={t("auth_modal.reset_password.button")}
              />
            </CtaWrapper>
          </Modal>
        )}
      </ModalCourtain>
    </Suspense>
  );
};

export default AuthModal;
