import React, { FC, Suspense, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLazyQuery, useMutation, useQuery } from "react-apollo";
import { SET_USER, SIGN_UP, LOGIN, RECOVER, RESET } from "../../../graphql/user/mutations";
import { DETAILS, GET_USER } from "../../../graphql/user/queries";
import { googleLogin, facebookLogin } from "../../../utils/social";
import { loginInfoForm, token as StoreToken } from "../../../utils/store";
import { useParams, useHistory } from "react-router-dom";
import { 
  CloseWrapper, 
  CtaWrapper, 
  Description, 
  Disclaimer, 
  Line, 
  Link, 
  LoaderWrapper, 
  LoginError, 
  Modal, 
  ModalCourtain, 
  PasswordWrapper, 
  SignUpError, 
  SocialButton, 
  Title,
  SaveLogin,
  WrapperButtons
 } from "./style";
import { findKeyByCity } from "../../../utils/string";
import useUser from "../../../hooks/useUser";
import { ApolloError } from "apollo-client";
import useCheckout from "../../../hooks/useCheckout";
import useModals from "../../../hooks/useModals";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../Loader"));
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../Cta"));

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
  ResetPassword: 4,
};

const AuthModal: FC<Props> = () => {
  let { token } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const { toggleCityModal } = useUser();
  const { data } = useQuery(GET_USER, {});
  const [step, setStep] = useState(Steps.Login);
  const [user, setUser] = useState<User>({});
  const [form, setForm] = useState<FormData>({ email: "" });
  const [loader, setLoader] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);
  const togglePassword = useRef<HTMLInputElement>(null);
  const [signUpErrorText, setSignUpErrorText] = useState("");
  const [saveLogin, setSaveLogin] = useState(false);
  const { checkout: { redirectToCheckout }, handleIsGuestOrder, handleRedirectToCheckout } = useCheckout();
  const { modals: { showRegisterModal }, handleRegisterModal } = useModals();

  const [getDetails] = useLazyQuery(DETAILS, {
    fetchPolicy: "no-cache",
    onCompleted: (d) => {
      // if user is logged in and has addresses
      if (d.details && d.details.addresses && d.details.addresses.length > 0) {
        const defaultAddress = d.details.addresses[0];
        // find the first b2e address
        const b2eAddress = d.details.addresses.find((address: any) => address.id_price_list);
        let fields;

        // if user has a b2e address
        if (b2eAddress) {
          // set the default address to b2e address
          fields = {
            defaultAddressId: b2eAddress?.id,
            defaultAddressLabel: b2eAddress?.street,
            cityKey: findKeyByCity(b2eAddress?.city) || "SC",
            cityName: b2eAddress?.city,
            agency: null,
            idPriceList: b2eAddress?.id_price_list || 0,
            store: "B2E",
          };
        } else {
          // set the default address to the first address
          fields = {
            defaultAddressId: defaultAddress?.id,
            defaultAddressLabel: defaultAddress?.street,
            cityKey: findKeyByCity(defaultAddress?.city) || "SC",
            cityName: defaultAddress?.city,
            agency: null,
            idPriceList: 0,
          };
        }

        updateMainAddress({
          variables: {
            user: {
              ...fields,
            },
          },
        });
      }
    },
  });

  const [doSignUp] = useMutation(SIGN_UP, {
    onError: (error: ApolloError) => {
      const GraphQlError = "GraphQL error: Invalid login or password."
      const ErrorAlreadyExist = "account_already_exists"
      const ErrorMinimumLength = "minimum_length_password"

      if (error.message === GraphQlError) {
        setSignUpErrorText(t(`auth_modal.sign_up.${ErrorAlreadyExist}`));
      } else {
        setSignUpErrorText(t(`auth_modal.sign_up.${ErrorMinimumLength}`));
      }
    },
    onCompleted: () => {
      // when user is created successfully pop city modal
      toggleCityModal();
    },
  });

  const [doLogin] = useMutation(LOGIN, {
    variables: { email: form.email, password: form.password },
    onCompleted: () => {
      const url = "/activacion";
      // when user logged-in and url is not /activate pop city modal
      if (history.location.pathname !== url) {
        toggleCityModal();
      }
    },
  });
  const [doRecover] = useMutation(RECOVER, {
    variables: { email: form.email, url: process.env.REACT_APP_SITE_URL + "/password-reset", bompras: false },
  });
  const [doReset] = useMutation(RESET, {
    variables: { email: form.email, token, password: form.password, bompras: false },
  });
  const [updateUser] = useMutation(SET_USER, { variables: { user } });
  const [closeLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: false } },
  });
  const [openLoginModal] = useMutation(SET_USER, {
    variables: { user: { openLoginModal: true } },
  });
  const [showError] = useMutation(SET_USER, {
    variables: { user: { showError: t("auth_modal.error") } },
  });
  const [showSuccess] = useMutation(SET_USER, {
    variables: { user: { showSuccess: t("auth_modal.success") } },
  });
  const [updateMainAddress] = useMutation(SET_USER, {});

  useEffect(() => {
    if (showRegisterModal) {
      setStep(Steps.SignUp);
    }
  },[showRegisterModal]);

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
    if (user.isLoggedIn) {
      updateUser();
      getDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const infoLogin = JSON.parse(loginInfoForm.get());
    const openLogin = data.userInfo[0].openLoginModal;
    if (openLogin) {
      if (infoLogin) {
        setForm(infoLogin);
        setSaveLogin(true);
      } else {
        setForm({ email: "", password: "" });
      }
    }    
  },[data?.userInfo[0]?.openLoginModal]);

  const login = async () => {
    try {
      setLoader(true);
      setLoginError(false);
      const response: any = await doLogin();
      handleIsGuestOrder(false);
      if (saveLogin) {
        const loginDataJSON = JSON.stringify({
          email: form.email,
          password: form.password
        });
        loginInfoForm.set(loginDataJSON);
      } else {
        loginInfoForm.delete();
      }

      StoreToken.set(response.data.login.token);
      setUser({
        openLoginModal: false,
        isLoggedIn: true,
        id: response.data.login.id,
        idPriceList: 0,
      });
      if (redirectToCheckout) {
        history.push("/checkout");
        handleRedirectToCheckout(false);
      }

    } catch (e) {
      setLoginError(true);
    }
    setLoader(false);
  };

  const networkCallback = async ({ email, firstname, lastname, password }: FormData) => {
    try {
      setLoader(true);
      const response = await doSignUp({
        variables: {
          ...form,
          email,
          firstname,
          lastname,
          password,
          network: true,
        },
      });
      setUser({
        openLoginModal: false,
        isLoggedIn: true,
        id: response.data.signup.id,
        idPriceList: 0,
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
    try {
      googleLogin(networkCallback);
    } catch (e) {}
  };

  const loginWithFacebook = async () => {
    try {
      checkUserAgent();
      facebookLogin(networkCallback);
    } catch (e) {}
  };

  const signUp = async () => {
    setSignUpErrorText("");
    try {
      if (form.password === "" || form.password !== form.rpassword) throw new Error("error");
      setLoader(true);
      const response = await doSignUp({
        variables: {
          email: form.email,
          password: form.password,
          firstname: form.firstname,
          lastname: form.lastname,
          network: false,
        },
      });
      setUser({
        openLoginModal: false,
        isLoggedIn: true,
        id: response.data.signup.id,
        idPriceList: 0,
      });
      StoreToken.set(response.data.signup.token);
      showSuccess();
      if (redirectToCheckout) {
        history.push("/checkout");
        handleRedirectToCheckout(false);
        handleRegisterModal(false);
      }
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
    handleRedirectToCheckout(false);
    handleRegisterModal(false);
  };

  const checkUserAgent = () => {
    const isFacebook = (navigator.userAgent.indexOf("FBAN") > -1) || (navigator.userAgent.indexOf("FBAV") > -1); 

    if (isFacebook) {
      window.location.href = `${process.env.REACT_APP_BACKEND}/checkUserAgent`;
    }
  };

  const handleTogglePasswordVisibility = () => {
    const hide = "text";
    const shown = "password";

    if (togglePassword && togglePassword.current && togglePassword?.current.type) {
      if (togglePassword.current.type === shown) {
        setPasswordVisible(true);
        togglePassword.current.type = hide;
      } else {
        setPasswordVisible(false);
        togglePassword.current.type = shown;
      }
    }
  };

  return (
    <Suspense fallback={<Loader />}>
      <ModalCourtain className={
        (!data.userInfo.length || data.userInfo[0].openLoginModal) &&
        "visible"}>
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

            {loginError ? <LoginError>{t("auth_modal.login.error")}</LoginError> : ""}
            <input
              value={form.email as string}
              type="email"
              name="email"
              onKeyUp={(evt) => {
                if (evt.keyCode === 13) login();
              }}
              onChange={($evt) => setForm({ ...form, email: $evt.target.value })}
              placeholder={t("auth_modal.login.email")}
            />
            <PasswordWrapper>
              <input
                value={form.password as string}
                type="password"
                name="password"
                ref={togglePassword}
                onKeyUp={(evt) => {
                  if (evt.keyCode === 13) login();
                }}
                onChange={($evt) => setForm({ ...form, password: $evt.target.value })}
                placeholder={t("auth_modal.login.password")}
              />
              {passwordVisible ? (
                // ICON VISIBLE
                <svg onClick={handleTogglePasswordVisibility} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
                </svg>
              ) : (
                // ICON NOT VISIBLE
                <svg onClick={handleTogglePasswordVisibility} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                  <path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
                  <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z" />
                </svg>
              )}
            </PasswordWrapper>

            <WrapperButtons>
              <SaveLogin>
                <input type="radio" checked={saveLogin} onClick={() => setSaveLogin((prev) => !prev)} />
                <label>Recuerda mis datos</label>
              </SaveLogin>
              <Link position="right" onClick={() => setStep(Steps.ForgotPassword)}>
                {t("auth_modal.login.forget_password")}
              </Link>
            </WrapperButtons>
            
            <CtaWrapper>
              <Cta filled={true} action={login} text={t("auth_modal.login.button")} />
            </CtaWrapper>
            <Line />
            <SocialButton className={"googleBtn"} network="google" onClick={() => checkUserAgent()}>
              {/* google */}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.7385 5.31781H6.53428V7.97712H10.0508C9.48853 9.75 8.09997 10.3407 6.50585 10.3407C5.8881 10.3415 5.27928 10.1932 4.73104 9.90853C4.1828 9.62384 3.71133 9.21111 3.35661 8.70535C3.00189 8.1996 2.77441 7.61574 2.69345 7.00332C2.6125 6.3909 2.68046 5.76799 2.89158 5.18744C3.10269 4.60688 3.45073 4.08582 3.90617 3.66846C4.3616 3.25109 4.91099 2.94975 5.50772 2.78998C6.10445 2.63022 6.73091 2.61675 7.33396 2.75072C7.937 2.88469 8.49883 3.16215 8.97178 3.55956L10.9039 1.71925C10.1258 1.00249 9.18454 0.486482 8.1618 0.216017C7.13905 -0.0544476 6.06574 -0.0711933 5.03505 0.167234C4.00437 0.405661 3.04745 0.892054 2.24738 1.58419C1.44731 2.27632 0.828263 3.15328 0.443987 4.13892C0.0597106 5.12457 -0.078183 6.18911 0.0422774 7.24014C0.162738 8.29116 0.537911 9.2969 1.13523 10.17C1.73254 11.0432 2.53395 11.7573 3.46987 12.2505C4.40579 12.7437 5.44794 13.0009 6.50585 13C10.0898 13 13.3308 10.6364 12.7385 5.31781Z"
                  fill="#E02D37"
                />
              </svg>
              <span>{t("auth_modal.login.google.text")}</span>
              <b>{t("auth_modal.login.google.network")}</b>
            </SocialButton>
            <SocialButton onClick={loginWithFacebook} network="facebook">
              {/* facebook */}
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.2672 12L2.25 6.75H0V4.5H2.25V3C2.25 0.9756 3.50363 0 5.30954 0C6.17458 0 6.91805 0.0644025 7.13471 0.0931875V2.2088L5.88222 2.20937C4.90007 2.20937 4.7099 2.67607 4.7099 3.36093V4.5H7.5L6.75 6.75H4.70989V12H2.2672Z"
                  fill="#2A5CDC"
                />
              </svg>
              <span>{t("auth_modal.login.facebook.text")}</span>
              <b>{t("auth_modal.login.facebook.network")}</b>
            </SocialButton>
            <Disclaimer>
              <span>{t("auth_modal.login.disclaimer.no_account")}</span>
              <Link onClick={() => setStep(Steps.SignUp)}>{t("auth_modal.login.disclaimer.sign_up")}</Link>
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
            {signUpErrorText.length > 0 ? <SignUpError>{signUpErrorText}</SignUpError> : null}
            <input
              type="email"
              name="email"
              onKeyUp={(evt) => {
                if (evt.keyCode === 13) signUp();
              }}
              onChange={($evt) => setForm({ ...form, email: $evt.target.value })}
              placeholder={t("auth_modal.sign_up.email")}
            />
            <input
              type="password"
              name="password"
              onKeyUp={(evt) => {
                if (evt.keyCode === 13) signUp();
              }}
              onChange={($evt) => setForm({ ...form, password: $evt.target.value })}
              placeholder={t("auth_modal.sign_up.password")}
            />
            <input
              type="password"
              name="password"
              onKeyUp={(evt) => {
                if (evt.keyCode === 13) signUp();
              }}
              onChange={($evt) => setForm({ ...form, rpassword: $evt.target.value })}
              placeholder={t("auth_modal.sign_up.r_password")}
            />
            <CtaWrapper>
              <Cta filled={true} action={signUp} text={t("auth_modal.sign_up.button")} />
            </CtaWrapper>
            <Line />
            <SocialButton className={"googleBtn"} network="google" onClick={() => checkUserAgent()}>
              {/* google */}
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.7385 5.31781H6.53428V7.97712H10.0508C9.48853 9.75 8.09997 10.3407 6.50585 10.3407C5.8881 10.3415 5.27928 10.1932 4.73104 9.90853C4.1828 9.62384 3.71133 9.21111 3.35661 8.70535C3.00189 8.1996 2.77441 7.61574 2.69345 7.00332C2.6125 6.3909 2.68046 5.76799 2.89158 5.18744C3.10269 4.60688 3.45073 4.08582 3.90617 3.66846C4.3616 3.25109 4.91099 2.94975 5.50772 2.78998C6.10445 2.63022 6.73091 2.61675 7.33396 2.75072C7.937 2.88469 8.49883 3.16215 8.97178 3.55956L10.9039 1.71925C10.1258 1.00249 9.18454 0.486482 8.1618 0.216017C7.13905 -0.0544476 6.06574 -0.0711933 5.03505 0.167234C4.00437 0.405661 3.04745 0.892054 2.24738 1.58419C1.44731 2.27632 0.828263 3.15328 0.443987 4.13892C0.0597106 5.12457 -0.078183 6.18911 0.0422774 7.24014C0.162738 8.29116 0.537911 9.2969 1.13523 10.17C1.73254 11.0432 2.53395 11.7573 3.46987 12.2505C4.40579 12.7437 5.44794 13.0009 6.50585 13C10.0898 13 13.3308 10.6364 12.7385 5.31781Z"
                  fill="#E02D37"
                />
              </svg>
              <span>{t("auth_modal.sign_up.google.text")}</span>
              <b>{t("auth_modal.sign_up.google.network")}</b>
            </SocialButton>
            <SocialButton onClick={loginWithFacebook} network="facebook">
              {/* facebook */}
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.2672 12L2.25 6.75H0V4.5H2.25V3C2.25 0.9756 3.50363 0 5.30954 0C6.17458 0 6.91805 0.0644025 7.13471 0.0931875V2.2088L5.88222 2.20937C4.90007 2.20937 4.7099 2.67607 4.7099 3.36093V4.5H7.5L6.75 6.75H4.70989V12H2.2672Z"
                  fill="#2A5CDC"
                />
              </svg>
              <span>{t("auth_modal.sign_up.facebook.text")}</span>
              <b>{t("auth_modal.sign_up.facebook.network")}</b>
            </SocialButton>
            <Disclaimer>
              <span>{t("auth_modal.sign_up.disclaimer.account")}</span>
              <Link onClick={() => setStep(Steps.Login)}>{t("auth_modal.sign_up.disclaimer.login")}</Link>
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
            <Description>{t("auth_modal.forgot_password.subtitle")}</Description>
            <input type="email" name="password" onChange={($evt) => setForm({ ...form, email: $evt.target.value })} placeholder={t("auth_modal.forgot_password.email")} />
            <CtaWrapper>
              <Cta filled={true} action={recoverPassword} text={t("auth_modal.forgot_password.button")} />
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
            <Description>{t("auth_modal.forgot_password.message.subtitle")}</Description>
            <CtaWrapper>
              <Cta filled={true} action={closeModal} text={t("auth_modal.forgot_password.message.button")} />
            </CtaWrapper>
            <Disclaimer>
              <span>{t("auth_modal.forgot_password.message.disclaimer.no_message")}</span>
              <Link onClick={recoverPassword}>{t("auth_modal.forgot_password.message.disclaimer.retry")}</Link>
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
            <input type="email" name="email" onChange={($evt) => setForm({ ...form, email: $evt.target.value })} placeholder={t("auth_modal.reset_password.email")} />
            <input type="password" name="password" onChange={($evt) => setForm({ ...form, password: $evt.target.value })} placeholder={t("auth_modal.reset_password.password")} />
            <input type="password" name="password" onChange={($evt) => setForm({ ...form, rpassword: $evt.target.value })} placeholder={t("auth_modal.reset_password.r_password")} />
            <CtaWrapper>
              <Cta filled={true} action={resetPassword} text={t("auth_modal.reset_password.button")} />
            </CtaWrapper>
          </Modal>
        )}
      </ModalCourtain>
    </Suspense>
  );
};

export default AuthModal;
