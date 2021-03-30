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
import axios from "axios";
import { useTranslation } from "react-i18next";
import Close from "../Images/Close";
import SucessImage from "../../assets/images/heart-empleados.svg";
import WarningIcon from "../../assets/employee/warning-input.svg";
import { useLazyQuery, useMutation } from "react-apollo";
import { SET_EMPLOYEE } from "../../graphql/user/mutations";
import { GET_USER2E_DETAILS } from "../../graphql/b2e/queries"
import { ADD_ADDRESS, REMOVE_ADDRESS, SET_USER } from "../../graphql/user/mutations";
import { titleCase } from "../../utils/string";


type Props = {

  show: boolean;
  setShowOpen: React.Dispatch<SetStateAction<boolean>>;
  setCuentaActiva?: React.Dispatch<SetStateAction<boolean>>;

  userData: any;
  userDetails: any;
};

const EmployeeModal: FC<Props> = ({
  show,
  setShowOpen,
  setCuentaActiva,
  userData,
  userDetails
}) => {
  const authyUrl = "https://tienda.sofia.com.bo/api/v1/authy"

  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [steps, setSteps] = useState(1);
  const [knowCode, setKnowCode] = useState(true);
  const [clientCode, setClientCode] = useState("");
  const [passSteps, setPassSteps] = useState(0);
  const [updateEmployee] = useMutation(SET_EMPLOYEE, {})
  const [addAddress] = useMutation(ADD_ADDRESS, {})
  const [getB2EUser, {data: userB2E}] = useLazyQuery(GET_USER2E_DETAILS, {
    fetchPolicy: "network-only",
    onError: d => {
      setSteps(1);
      setKnowCode(true);
      setClientCode("");
      setPin1("");
      setPin2("");
      setPin3("");
      setPin4("");
      setPin5("");
      setPin6("");
      setLoader(false)
    },
    onCompleted: d => {    
      setEmpresa({ empresa: userB2E.getB2EUserDetails.nombre, numero: userB2E.getB2EUserDetails.celular })
      start()
      setLoader(false)
    }
  })
  useEffect(()=>{
    if (userB2E && userB2E.getB2EUserDetails.id_Cliente && userB2E.getB2EUserDetails.nombre && userB2E.getB2EUserDetails.celular ) {
      
      setSteps(3);
      setLoader(false)
    }
  },[userB2E])
  const [empresa, setEmpresa] = useState<any>({
    empresa: "Pollos Kiky, SRL",
    numero: "78023322156"
  });

  const [pin1, setPin1] = useState<any>("");
  const [pin2, setPin2] = useState<any>("");
  const [pin3, setPin3] = useState<any>("");
  const [pin4, setPin4] = useState<any>("");
  const [pin5, setPin5] = useState<any>("");
  const [pin6, setPin6] = useState<any>("");
  const [pinError, setPinError] = useState(false);
  const [pinValue, setPinValue] = useState<string>("")

  let [counter, setCounter] = useState(59);

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

  const start = async () => {
    try {
      setLoader(true)
      const register = await axios.post(`${authyUrl}/register`,{
        country_code: "591",
        cellphone: empresa.numero,
        email: userDetails.details.email,
      })
      if (register.data.user.id) {
        setEmpresa({ ...empresa, authyId: register.data.user.id })
      } else {
        throw new Error()
      }

      await axios.post(`${authyUrl}/start/${register.data.user.id}`)
      setSteps(3);
    } catch (error) {
      // showError()
    }
    setLoader(false)
  }
  
  const verify = async () => {
    try {
      setLoader(true)

      if(!empresa && !empresa.authyId) return false

      const verifyCode = await axios.post(`${authyUrl}/verify`, {
        authyId: empresa.authyId,
        token: pinValue
      })
      setLoader(false)
      return true
      setSteps(4);
    } catch (error) {
      setLoader(false)
      setPinError(true)
      return false
    }
    setLoader(false)
  }
  useEffect(() => {
    if (show && steps === 3) {
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
  }, [counter, show, steps, passSteps]);

  useEffect(()=> {
    if(pin1 && pin2 && pin3 && pin4 && pin5 && pin6){
      setPinValue(pin1 + pin2 + pin3 + pin4 + pin5 + pin6)
    }
  }, [pin1, pin2, pin3, pin4, pin5, pin6])

  return (
    <Wrapper>
      <ModalCourtain className={show ? "visible" : ""}>
        {steps !== 0 && (
          <Modal padding={"36px 42px 20px"}>
            {loader && (
              <LoaderWrapper>
                <img src="/images/loader.svg" alt="loader" />
              </LoaderWrapper>
            )}
            <CloseWrapper
              onClick={() => {
                setShowOpen(false);
                setSteps(1);
                setKnowCode(true);
                setClientCode("");
                setPin1("");
                setPin2("");
                setPin3("");
                setPin4("");
                setPin5("");
                setPin6("");
              }}
            >
              <Close />
            </CloseWrapper>

            {steps === 1 && knowCode && (
              <Fragment>
                <Title marginBottom={"30px"}>
                  {t("employeeModal.activar_cuenta")}
                </Title>

                <InputLabel show={clientCode !== ""}>
                  {t("employeeModal.carnet_de_identidad")}
                </InputLabel>

                <input
                  type="tel"
                  maxLength={100}
                  pattern="[0-9]*"
                  onChange={handleChange}
                  value={clientCode}
                  placeholder={t("employeeModal.carnet_de_identidad")}
                  autoComplete="off"
                  className={
                    clientCode !== "" && clientCode.length <= 3 ? "error" : ""
                  }
                />

                {clientCode !== "" && (
                  <>
                    {clientCode.length > 3 ? (
                      <></>
                    ) : (
                      <ErrorInputMsg margin={"0 auto 0 30px"}>
                        <img src={WarningIcon} alt="(!)" />
                        <span> {t("employeeModal.carnet_incorrecto")}</span>
                      </ErrorInputMsg>
                    )}
                  </>
                )}

                <CtaWrapper>
                  <Cta
                    filled={true}
                    action={() => {
                      if (clientCode === "" || clientCode.length <= 3) {
                        setSteps(1)
                      } else {
                        setLoader(true)
                        getB2EUser({
                          variables: {
                            nit: clientCode
                          }
                        })
                      }
                    }}
                    text={t("employeeModal.enviar_pin")}
                  />
                </CtaWrapper>
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

            {steps === 3 && empresa && empresa.numero && (
              <Fragment>
                <Title marginBottom={"30px"}>
                  {t("employeeModal.activar_cuenta")}
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
                    <span> {t("employeeModal.pin_incorrecto")}</span>
                  </ErrorInputMsg>
                )}

                <CtaWrapper>
                  <Cta
                    filled={true}
                    action={async () => {
                      if (
                      pin1 !== "" &&
                      pin2 !== "" &&
                      pin3 !== "" &&
                      pin4 !== "" &&
                      pin5 !== "" &&
                      pin6 !== "" ) {

                        const isValid = await verify()
                        
                        if (isValid) {
                          setLoader(true)

                          if (userB2E &&
                            userB2E.getB2EUserDetails &&
                            userB2E.getB2EUserDetails.direcciones) {
                              await updateEmployee({
                                // value 1 significa es empleado
                                variables: {
                                  customer_id: userDetails?.details?.id || 0,
                                  value: userB2E?.getB2EUserDetails?.id_Cliente || 1
                                }
                              })
  
                              await Promise.all(
                                userB2E.getB2EUserDetails.direcciones.map(async (address:any)=> {
                                  await addAddress({
                                    variables: {
                                      addressId: address.id_direccion, 
                                      firstname: String(userB2E.getB2EUserDetails.nombre), 
                                      lastname: " ", 
                                      email: userDetails.details.email,
                                      nit: userB2E.getB2EUserDetails.nit,
                                      telephone: String(address.id_listaPrecio),
                                      street: address.direccion + " | " + address.id_direccion,
                                      reference: String(address.id_listaPrecio),
                                      city: titleCase(address.ciudad),
                                      latitude: address.latitud,
                                      longitude: address.longitud,
                                      billing: 0
                                    }
                                  })
                                })
                              )
                          }
                          setLoader(false)
                          setSteps(4)
                        }
                      } else {
                        setSteps(3)
                      }
                      setKnowCode(true);
                    }}
                    text={t("employeeModal.siguiente")}
                  />
                </CtaWrapper>

                <Disclaimer margin={"10px 0 10px"}>
                  <span>{t("employeeModal.no_recibiste_pin")}</span>
                  <SmallTextBtn
                    margin={"0 0 0 auto"}
                    onClick={() => {
                      setKnowCode(true);
                    }}
                  >
                    {t("employeeModal.reenviar")}
                  </SmallTextBtn>
                </Disclaimer>
              </Fragment>
            )}

            {steps === 4 && (
              <Fragment>
                <SuccessIcon src={SucessImage} alt="" />

                <Title marginBottom={"30px"}>
                  {t("employeeModal.cuenta_activada")}
                </Title>

                <SmallText>
                  {t("employeeModal.cuenta_activada_subtitulo")}
                </SmallText>

                <CtaWrapper marginBottom={"15px"} marginTop={"15px"}>
                  <Cta
                    filled={true}
                    action={() => {
                      setSteps(1);
                      setKnowCode(true);
                      setShowOpen(false);
                      setCuentaActiva && setCuentaActiva(true)
                      setTimeout(() => (window as any).location.reload(), 0);
                    }}
                    text={t("employeeModal.siguiente")}
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

export default EmployeeModal;
