import React, {
  FC,
  useState,
  SetStateAction,
  Fragment,
  useEffect
} from "react";
import {
  Wrapper,
  Modal,
  LoaderWrapper,
  CloseWrapper,
  Title,
  CtaWrapper,
  Line,
  Disclaimer,
  ModalCourtain,
  SmallTextBtn,
  SmallText,
  QuestionIconWrap,
  Lista,
  InputCode,
  FourCodeInputs,
  Counter,
  InputLabel,
  EmpresaTitle,
  SuccessIcon,
  ListaItems,
  ErrorInputMsg,
  QuestionIconWrapCentered
} from "./style";
import Cta from "../Cta";
import { useTranslation } from "react-i18next";
import axios from "axios"
import Close from "../Images/Close";
import QuestionIcon from "../../assets/images/question.svg";
import SucessImage from "../../assets/images/sucess-icon.svg";
import CatalogIcon from "../../assets/images/Catalogue.svg";
import ShippingIcon from "../../assets/images/Delivery.svg";
import CartIcon from "../../assets/images/Compra.svg";
import WarningIcon from "../../assets/images/warning-input.svg";
import {
  SET_USER, SET_EMPLOYEE
} from "../../graphql/user/mutations";
import { GET_USER2E_DETAILS } from "../../graphql/b2e/queries"
import { token as StoreToken } from "../../utils/store";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";

type User = {
  id?: Number;
  isLoggedIn?: Boolean;
  openLoginModal?: Boolean
}

type Props = {
  inputs: any;
  loginB2bOpen: boolean;
  setLoginB2bOpen: React.Dispatch<SetStateAction<boolean>>;
};

const LoginModal: FC<Props> = ({ loginB2bOpen, setLoginB2bOpen, inputs }) => {
  const authyUrl = "http://54.213.169.179:4000/authy"
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [steps, setSteps] = useState(1);
  const [knowCode, setKnowCode] = useState(true);
  const [clientCode, setClientCode] = useState("");
  const [clientCodeError, setClientCodeError] = useState(false)
  const [passSteps, setPassSteps] = useState(0);
  const [pinValue, setPinValue] = useState<string>("")

  const [empresa, setEmpresa] = useState<any>();

  const [pin1, setPin1] = useState<any>("");
  const [pin2, setPin2] = useState<any>("");
  const [pin3, setPin3] = useState<any>("");
  const [pin4, setPin4] = useState<any>("");
  const [pin5, setPin5] = useState<any>("");
  const [pin6, setPin6] = useState<any>("");
  const [pinError, setPinError] = useState(false);

  let [counter, setCounter] = useState(120);


  const activateBenefits = () => {
    updateEmployee({
      // value 1 significa es empleado
      variables: {
        customer_id: inputs.details.id || 0,
        value: 1
      }
    })
    updateUser({
      variables: {
        user:{
          employee:'1'
        }
      }
    })
  }

  const handleChange = (evt: {
    target: { validity: { valid: any }; value: any };
  }) => {
    const ClientGoal = evt.target.validity.valid
      ? evt.target.value
      : clientCode;

    setClientCode(ClientGoal);
  };

  const handleChangePin1 = (evt: {
    target: { validity: { valid: any }; value: any };
  }) => {
    const pin1Valid = evt.target.validity.valid ? evt.target.value : pin1;

    setPin1(pin1Valid);
  };
  const handleChangePin2 = (evt: {
    target: { validity: { valid: any }; value: any };
  }) => {
    const pin2Valid = evt.target.validity.valid ? evt.target.value : pin2;

    setPin2(pin2Valid);
  };
  const handleChangePin3 = (evt: {
    target: { validity: { valid: any }; value: any };
  }) => {
    const pin3Valid = evt.target.validity.valid ? evt.target.value : pin3;

    setPin3(pin3Valid);
  };
  const handleChangePin4 = (evt: {
    target: { validity: { valid: any }; value: any };
  }) => {
    const pin4Valid = evt.target.validity.valid ? evt.target.value : pin4;

    setPin4(pin4Valid);
  };
  const handleChangePin5 = (evt: {
    target: { validity: { valid: any }; value: any };
  }) => {
    const pin5Valid = evt.target.validity.valid ? evt.target.value : pin5;

    setPin5(pin5Valid);
  };
  const handleChangePin6 = (evt: {
    target: { validity: { valid: any }; value: any };
  }) => {
    const pin6Valid = evt.target.validity.valid ? evt.target.value : pin6;

    setPin6(pin6Valid);
  };
  
  const [updateUser] = useMutation(SET_USER, {})
  const [updateEmployee] = useMutation(SET_EMPLOYEE, {})
  const [getB2EUser, {data: userDetails}] = useLazyQuery(GET_USER2E_DETAILS, {
    // variables: {
    //   nit: inputs.details.nit
    // },
    onCompleted: d => {
      console.log('b2e details', d)
      if (d.getB2EUserDetails.id_Cliente) {
        console.log('found!', d.getB2EUserDetails)
        setEmpresa({ ...inputs.details, empresa: d.getB2EUserDetails.nombre, numero: d.getB2EUserDetails.celular })
        start()
        setLoader(false)
        return setSteps(3)
      }
      setLoader(false)
      setClientCodeError(true)
    }
  })

  const start = async () => {
    try {
      setLoader(true)
      const register = await axios.post(`${authyUrl}/register`,{
        // TODO descomentar 
        // country_code: "591",
        // cellphone: empresa.numero
        country_code: "54",
        cellphone: "2804617904"
      })
      if (register.data.user.id) {
        setEmpresa({ ...inputs.details, empresa: inputs.details.firstname, numero: inputs.details.phone, authyId: register.data.user.id })
      } else {
        throw new Error()
      }
      // start
      await axios.post(`${authyUrl}/start/${register.data.user.id}`)
      // setStep(Steps.Activate)
      setSteps(3);
    } catch (error) {
      // showError()
    }
    setLoader(false)
  }
  
  const verify = async () => {
    try {
      setLoader(true)
      const verifyCode = await axios.post(`${authyUrl}/verify`, {
        authyId: empresa.authyId,
        token: pinValue
      })
      setSteps(4);
    } catch (error) {
      setPinError(true)
    }
    setLoader(false)
  }

  useEffect(() => {
    if (loginB2bOpen && steps === 3) {
      if (counter > 0) {
        setTimeout(() => {
          setCounter(--counter);
        }, 1000);
      } else {
        setCounter(0);
      }
    } else {
      setCounter(59);
    }

    if (passSteps === 1) {
      setTimeout(() => {
        setPassSteps(2);
      }, 2000);
    }
  }, [counter, loginB2bOpen, steps, passSteps]);

  useEffect(()=> {
    if(pin1 && pin2 && pin3 && pin4 && pin5 && pin6){
      setPinValue(pin1 + pin2 + pin3 + pin4 + pin5 + pin6)
    }
  }, [pin1, pin2, pin3, pin4, pin5, pin6])


  return (
    <Wrapper>
      <ModalCourtain className={loginB2bOpen ? "visible" : ""}>
        {steps !== 0 && (
          <Modal padding={"36px 42px 20px"}>
            {loader && (
              <LoaderWrapper>
                <img src="/images/loader.svg" alt="loader" />
              </LoaderWrapper>
            )}
            <CloseWrapper
              onClick={() => {
                setLoginB2bOpen(false);
                setSteps(1);
                setKnowCode(true);
              }}
            >
              <Close />
            </CloseWrapper>

            {steps === 1 && knowCode && (
              <Fragment>
                <Title marginBottom={"30px"}>
                  {t("auth_modal.activate_account.title")}
                </Title>

                <InputLabel show={clientCode !== ""}>
                  {t("auth_modal.activate_account.client_code")}
                </InputLabel>

                <input
                  type="tel"
                  maxLength={100}
                  pattern="[0-9]*"
                  onChange={handleChange}
                  value={clientCode}
                  placeholder={t("auth_modal.activate_account.client_code")}
                  autoComplete="off"
                  className={
                    clientCode !== "" && clientCode.length <= 3 ? "error" : ""
                  }
                />

                {(clientCode !== "" || clientCodeError) && (
                  <>
                    {clientCode.length > 3 && !clientCodeError ? (
                      <></>
                    ) : (
                      <ErrorInputMsg margin={"0 auto 0 30px"}>
                        <img src={WarningIcon} alt="(!)" />
                        <span>
                          {" "}
                          {t("auth_modal.activate_account.wrong_code")}
                        </span>
                      </ErrorInputMsg>
                    )}
                  </>
                )}

                <CtaWrapper>
                  <Cta
                    filled={true}
                    action={() => {
                      // Codigo ingresado,
                      setLoader(true)
                      getB2EUser({
                        variables: {
                          nit: String(clientCode)
                        }
                      })
                      // start()
                      // setSteps(2)
                    }}
                    text={t("auth_modal.activate_account.next")}
                  />
                </CtaWrapper>

                <QuestionIconWrapCentered>
                  <img src={QuestionIcon} alt="?" />
                  <SmallTextBtn
                    margin={"10px 0 20px auto"}
                    onClick={() => setKnowCode(false)}
                  >
                    {t("auth_modal.activate_account.question")}
                  </SmallTextBtn>
                </QuestionIconWrapCentered>
              </Fragment>
            )}

            {steps === 1 && !knowCode && (
              <Fragment>
                <Title marginBottom={"30px"}>
                  {t("auth_modal.activate_account.title")}
                </Title>

                <SmallText>
                  {t("auth_modal.activate_account.know_code_text")}
                </SmallText>
                <SmallText marginBottom={"30px"}>
                  {t("auth_modal.activate_account.know_code_text2")}
                </SmallText>

                <CtaWrapper>
                  <Cta
                    filled={true}
                    action={() => {
                      setKnowCode(true);
                    }}
                    text={t("auth_modal.activate_account.back")}
                  />
                </CtaWrapper>
              </Fragment>
            )}

            {steps === 2 && (
              <Fragment>
                <Title marginBottom={"30px"}>
                  {t("auth_modal.activate_account.title")}
                </Title>

                <SmallText>
                  {t("auth_modal.activate_account.step2_text")}
                </SmallText>

                <Lista>
                  <li>
                    <h4> {t("auth_modal.activate_account.company")}</h4>
                    <h5>{empresa.empresa}</h5>
                  </li>
                  <li>
                    <h4> {t("auth_modal.activate_account.contact")}</h4>
                    <h5>
                      {empresa.numero.slice(0, 3)}
                      {"******"}{" "}
                      {empresa.numero.slice(empresa.numero.length - 3)}{" "}
                    </h5>
                  </li>
                </Lista>

                <CtaWrapper>
                  <Cta
                    filled={true}
                    action={() => {
                      start()
                      setKnowCode(true);
                    }}
                    text={t("auth_modal.activate_account.send_pin")}
                  />
                </CtaWrapper>

                <Disclaimer margin={"10px 0 10px"}>
                  <span>{t("auth_modal.activate_account.wrong_info")}</span>
                  <SmallTextBtn
                    margin={"0 0 0 auto"}
                    onClick={() => {
                      setSteps(1);
                      setKnowCode(true);
                    }}
                  >
                    {t("auth_modal.activate_account.re-enter_code")}
                  </SmallTextBtn>
                </Disclaimer>
              </Fragment>
            )}

            {steps === 3 && (
              <Fragment>
                <Title marginBottom={"30px"}>
                  {t("auth_modal.activate_account.title")}
                </Title>

                <SmallText>
                  Por favor, ingrese el código que enviamos al teléfono{" "}
                  {empresa.numero.slice(0, 3)}
                  {"******"} {empresa.numero.slice(empresa.numero.length - 3)}{" "}
                </SmallText>

                <Counter>
                  <h4>
                    00:
                    {counter < 10 ? (
                      <span>0{counter}</span>
                    ) : (
                      <span>{counter}</span>
                    )}
                  </h4>
                </Counter>

                <FourCodeInputs>
                  {pin2 === "" && pin1 !== "" ? (
                    <>
                      <InputCode
                        placeholder=""
                        type="tel"
                        maxLength={1}
                        pattern="[0-9]*"
                        name="first"
                        onChange={handleChangePin1}
                        value={pin1}
                        autoFocus
                        className={pin1 !== "" ? "filled" : ""}
                        autoComplete="off"
                        pinError={pinError}
                      />
                    </>
                  ) : (
                    <InputCode
                      placeholder=""
                      type="tel"
                      maxLength={1}
                      pattern="[0-9]*"
                      name="first"
                      onChange={handleChangePin1}
                      value={pin1}
                      className={pin1 !== "" ? "filled" : ""}
                      autoComplete="off"
                      pinError={pinError}
                    />
                  )}

                  {pin1 !== "" && pin3 === "" ? (
                    <>
                      <InputCode
                        placeholder=""
                        type="tel"
                        maxLength={1}
                        pattern="[0-9]*"
                        name="second"
                        onChange={handleChangePin2}
                        value={pin2}
                        autoFocus
                        className={pin2 !== "" ? "filled" : ""}
                        autoComplete="off"
                        pinError={pinError}
                      />
                    </>
                  ) : (
                    <InputCode
                      placeholder=""
                      type="tel"
                      maxLength={1}
                      pattern="[0-9]*"
                      name="second"
                      onChange={handleChangePin2}
                      value={pin2}
                      className={pin2 !== "" ? "filled" : ""}
                      autoComplete="off"
                      pinError={pinError}
                    />
                  )}

                  {pin1 !== "" && pin2 !== "" && pin4 === "" ? (
                    <>
                      <InputCode
                        placeholder=""
                        type="tel"
                        maxLength={1}
                        pattern="[0-9]*"
                        name="third"
                        onChange={handleChangePin3}
                        value={pin3}
                        className={pin3 !== "" ? "filled" : ""}
                        autoFocus
                        autoComplete="off"
                        pinError={pinError}
                      />
                    </>
                  ) : (
                    <InputCode
                      placeholder=""
                      type="tel"
                      maxLength={1}
                      pattern="[0-9]*"
                      name="third"
                      onChange={handleChangePin3}
                      className={pin3 !== "" ? "filled" : ""}
                      value={pin3}
                      autoComplete="off"
                      pinError={pinError}
                    />
                  )}

                  {pin1 !== "" && pin2 !== "" && pin3 !== "" && pin5 === "" ? (
                    <>
                      <InputCode
                        placeholder=""
                        type="tel"
                        maxLength={1}
                        pattern="[0-9]*"
                        name="four"
                        onChange={handleChangePin4}
                        value={pin4}
                        className={pin4 !== "" ? "filled" : ""}
                        autoFocus
                        autoComplete="off"
                        pinError={pinError}
                      />
                    </>
                  ) : (
                    <InputCode
                      placeholder=""
                      type="tel"
                      maxLength={1}
                      pattern="[0-9]*"
                      name="four"
                      onChange={handleChangePin4}
                      className={pin4 !== "" ? "filled" : ""}
                      value={pin4}
                      autoComplete="off"
                      pinError={pinError}
                    />
                  )}

                  {pin1 !== "" &&
                  pin2 !== "" &&
                  pin3 !== "" &&
                  pin4 !== "" &&
                  pin6 === "" ? (
                    <>
                      <InputCode
                        placeholder=""
                        type="tel"
                        maxLength={1}
                        pattern="[0-9]*"
                        name="five"
                        onChange={handleChangePin5}
                        value={pin5}
                        className={pin5 !== "" ? "filled" : ""}
                        autoFocus
                        autoComplete="off"
                        pinError={pinError}
                      />
                    </>
                  ) : (
                    <InputCode
                      placeholder=""
                      type="tel"
                      maxLength={1}
                      pattern="[0-9]*"
                      name="five"
                      onChange={handleChangePin5}
                      className={pin5 !== "" ? "filled" : ""}
                      value={pin5}
                      autoComplete="off"
                      pinError={pinError}
                    />
                  )}

                  {pin1 !== "" &&
                  pin2 !== "" &&
                  pin3 !== "" &&
                  pin4 !== "" &&
                  pin5 !== "" ? (
                    <>
                      <InputCode
                        placeholder=""
                        type="tel"
                        maxLength={1}
                        pattern="[0-9]*"
                        name="six"
                        onChange={handleChangePin6}
                        value={pin6}
                        className={pin6 !== "" ? "filled" : ""}
                        autoFocus
                        autoComplete="off"
                        pinError={pinError}
                      />
                    </>
                  ) : (
                    <InputCode
                      placeholder=""
                      type="tel"
                      maxLength={1}
                      pattern="[0-9]*"
                      name="six"
                      onChange={handleChangePin6}
                      className={pin6 !== "" ? "filled" : ""}
                      value={pin6}
                      autoComplete="off"
                      pinError={pinError}
                    />
                  )}
                </FourCodeInputs>

                {pinError && (
                  <ErrorInputMsg margin={"0 auto 0 20px"}>
                    <img src={WarningIcon} alt="(!)" />
                    <span> {t("auth_modal.activate_account.wrong_code")}</span>
                  </ErrorInputMsg>
                )}

                <CtaWrapper>
                  <Cta
                    filled={true}
                    action={() => {
                      verify()
                      setKnowCode(true);
                    }}
                    text={t("auth_modal.activate_account.next")}
                  />
                </CtaWrapper>

                <Disclaimer margin={"10px 0 10px"}>
                  <span>{t("auth_modal.activate_account.pin_question")}</span>
                  <SmallTextBtn
                    margin={"0 0 0 auto"}
                    onClick={() => {
                      setKnowCode(true);
                    }}
                  >
                    {t("auth_modal.activate_account.send-again")}
                  </SmallTextBtn>
                </Disclaimer>
              </Fragment>
            )}

            {steps === 4 && (
              /** @TODO poner acciones para isEmployee 0  */
              <Fragment>
                <Title color={"#E30613"} marginBottom={"30px"}>
                  {t("auth_modal.activate_account.ready")}
                </Title>

                <SmallText>
                  {t("auth_modal.activate_account.ready_text")}
                </SmallText>

                <ListaItems>
                  <li>
                    <img src={CatalogIcon} alt="Catálogo" />
                    <p> {t("auth_modal.activate_account.ready_item_1")}</p>
                  </li>
                  <li>
                    <img src={ShippingIcon} alt="Envío" />
                    <p> {t("auth_modal.activate_account.ready_item_2")}</p>
                  </li>
                  <li>
                    <img src={CartIcon} alt="Carrito" />
                    <p> {t("auth_modal.activate_account.ready_item_3")}</p>
                  </li>
                </ListaItems>

                <CtaWrapper marginBottom={"15px"} marginTop={"15px"}>
                  <Cta
                    filled={true}
                    action={() => {
                      // guardar en la db que es un user especial
                      activateBenefits()
                      setSteps(0);
                      setLoginB2bOpen(false);
                      setKnowCode(true);
                    }}
                    text={t("auth_modal.activate_account.start_shopping")}
                  />
                </CtaWrapper>
              </Fragment>
            )}
          </Modal>
        )}
      </ModalCourtain>
    </Wrapper>
  );
};

export default LoginModal;
