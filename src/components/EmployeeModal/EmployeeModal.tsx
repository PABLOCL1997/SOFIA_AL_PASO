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
  QuestionIconWrapCentered,
  Anchor
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
  setShowOpen: Function;
  setCuentaActiva: Function;

  userData: any;
  userDetails: any;
};

enum Steps {
  AskNit,
  AskPin,
  InvalidAccount,
  AccountActivated,
}

const EmployeeModal: FC<Props> = ({
  show,
  setShowOpen,
  setCuentaActiva,
  userData,
  userDetails
}) => {
  const authyUrl = "https://tienda.sofia.com.bo/api/v1/authy"

  const { t } = useTranslation();
  const [loader, setLoader] = useState<Boolean>(false);
  const [steps, setSteps] = useState<Steps>(Steps.AskNit);
  const [unknownNit, setUnknownNit] = useState<Boolean>(false);
  const [knowCode, setKnowCode] = useState<Boolean>(true);
  const [clientPhone, setClientPhone] = useState<String>("");
  const [clientCode, setClientCode] = useState("");
  const [passSteps, setPassSteps] = useState(0);
  const [updateEmployee] = useMutation(SET_EMPLOYEE, {})
  const [addAddress] = useMutation(ADD_ADDRESS, {})
  const [getB2EUser, {data: userB2E}] = useLazyQuery(GET_USER2E_DETAILS, {
    fetchPolicy: "network-only",
    onError: d => {
      setSteps(Steps.AskNit);
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
    onCompleted: user => {  
      console.log(user)
      if (!user.getB2EUserDetails.nombre || !user.getB2EUserDetails.nit) {
        setUnknownNit(true)
        console.log('no name')
      }
      if (!user.getB2EUserDetails.celular || !(user.getB2EUserDetails?.direcciones) || !user.getB2EUserDetails?.direcciones.length){
        console.log('no celular or direcciones')
        setSteps(Steps.InvalidAccount)
      } else {
        console.log('ok')
        setClientPhone(user.getB2EUserDetails.celular)
        setEmpresa({ empresa: user.getB2EUserDetails.nombre, numero: user.getB2EUserDetails.celular })
        start(user.getB2EUserDetails.celular)
        setSteps(Steps.AskPin)
        setUnknownNit(false)
      }
      setLoader(false)
    }
  })

  const [empresa, setEmpresa] = useState<any>();

  const [pin1, setPin1] = useState<any>("");
  const [pin2, setPin2] = useState<any>("");
  const [pin3, setPin3] = useState<any>("");
  const [pin4, setPin4] = useState<any>("");
  const [pin5, setPin5] = useState<any>("");
  const [pin6, setPin6] = useState<any>("");
  const [pinError, setPinError] = useState(false);
  const [pinValue, setPinValue] = useState<string>("")

  const pinConfig = {
    placeholder:"",
    type:"tel",
    maxLength:1,
    pattern:"[0-9]*",
    autoComplete:"off",
    pinError:pinError
  }
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

  const start = async (cellphone: any) => {
    try {
      setLoader(true)
      const register = await axios.post(`${authyUrl}/register`,{
        country_code: "591",
        cellphone,
        email: userDetails.details.email,
      })
      if (register.data.user.id) {
        setEmpresa({ ...empresa, authyId: register.data.user.id })
      } else {
        throw new Error()
      }

      await axios.post(`${authyUrl}/start/${register.data.user.id}`)
    } catch (error) {
      // showError()
    }
    setLoader(false)
  }
  
  const verify = async () => {
    try {
      setLoader(true)

      if(!empresa && !empresa.authyId) return false

      await axios.post(`${authyUrl}/verify`, {
        authyId: empresa.authyId,
        token: pinValue
      })
      setLoader(false)
      return true
    } catch (error) {
      setLoader(false)
      setPinError(true)
      return false
    }
  }
  useEffect(() => {
    if (show && steps === Steps.AskPin) {
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

  useEffect(() => {
    if(empresa && empresa.authyId) {
      setSteps(Steps.AskPin);
    }

  },[empresa])

  return (
    <Wrapper>
      <ModalCourtain className={show ? "visible" : ""}>
          <Modal padding={"36px 42px 20px"}>
            {loader && (
              <LoaderWrapper>
                <img src="/images/loader.svg" alt="loader" />
              </LoaderWrapper>
            )}
            <CloseWrapper
              onClick={() => {
                setShowOpen(false);
                setSteps(Steps.AskNit);
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

            {steps === Steps.AskNit && knowCode ? (
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

                {clientCode !== "" ? (
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
                ): null}

                {unknownNit ? 
                  <ErrorInputMsg margin={"15px 0 0 0"}>
                    <img src={WarningIcon} alt="(!)" />
                    <span>Este Carnet de Identidad no se encuentra registrado como colaborador.</span>
                  </ErrorInputMsg>
                : null}


                <CtaWrapper>
                  <Cta
                    filled={true}
                    action={() => {
                      if (clientCode === "" || clientCode.length <= 3) {
                        setSteps(Steps.AskNit)
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
            ): null}

            {steps === Steps.AskNit && !knowCode ? (
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
            ): null}

            {steps === Steps.AskPin ? (
              <Fragment>
                <Title marginBottom={"30px"}>
                  {t("employeeModal.activar_cuenta")}
                </Title>

                <SmallText>
                  Por favor, ingrese el código que enviamos al teléfono
                  {clientPhone ? <> {clientPhone.split('').map((c: String, index: number, arr: any[]) => arr.length > 5 && index >=3 && index <= 5 ? '*' : c ).join('')}</>: null }
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
                        {...pinConfig}
                        name="first"
                        onChange={handleChangePin1}
                        value={pin1}
                        autoFocus
                        className={pin1 !== "" ? "filled" : ""}
                      />
                    </>
                  ) : (
                    <InputCode
                      {...pinConfig}
                      name="first"
                      onChange={handleChangePin1}
                      value={pin1}
                      className={pin1 !== "" ? "filled" : ""}
                    />
                  )}

                  {pin1 !== "" && pin3 === "" ? (
                    <>
                      <InputCode
                        {...pinConfig}
                        name="second"
                        onChange={handleChangePin2}
                        value={pin2}
                        autoFocus
                        className={pin2 !== "" ? "filled" : ""}
                      />
                    </>
                  ) : (
                    <InputCode
                      {...pinConfig}
                      name="second"
                      onChange={handleChangePin2}
                      value={pin2}
                      className={pin2 !== "" ? "filled" : ""}
                    />
                  )}

                  {pin1 !== "" && pin2 !== "" && pin4 === "" ? (
                    <>
                      <InputCode
                        {...pinConfig}
                        name="third"
                        onChange={handleChangePin3}
                        value={pin3}
                        className={pin3 !== "" ? "filled" : ""}
                        autoFocus
                      />
                    </>
                  ) : (
                    <InputCode
                      {...pinConfig}
                      name="third"
                      onChange={handleChangePin3}
                      className={pin3 !== "" ? "filled" : ""}
                      value={pin3}
                    />
                  )}

                  {pin1 !== "" && pin2 !== "" && pin3 !== "" && pin5 === "" ? (
                    <>
                      <InputCode
                        {...pinConfig}
                        name="four"
                        onChange={handleChangePin4}
                        value={pin4}
                        className={pin4 !== "" ? "filled" : ""}
                        autoFocus
                      />
                    </>
                  ) : (
                    <InputCode
                      {...pinConfig}
                      name="four"
                      onChange={handleChangePin4}
                      className={pin4 !== "" ? "filled" : ""}
                      value={pin4}
                    />
                  )}

                  {pin1 !== "" &&
                  pin2 !== "" &&
                  pin3 !== "" &&
                  pin4 !== "" &&
                  pin6 === "" ? (
                    <>
                      <InputCode
                        {...pinConfig}
                        name="five"
                        onChange={handleChangePin5}
                        value={pin5}
                        className={pin5 !== "" ? "filled" : ""}
                        autoFocus
                      />
                    </>
                  ) : (
                    <InputCode
                      {...pinConfig}
                      name="five"
                      onChange={handleChangePin5}
                      className={pin5 !== "" ? "filled" : ""}
                      value={pin5}
                    />
                  )}

                  {pin1 !== "" &&
                  pin2 !== "" &&
                  pin3 !== "" &&
                  pin4 !== "" &&
                  pin5 !== "" ? (
                    <>
                      <InputCode
                        {...pinConfig}
                        name="six"
                        onChange={handleChangePin6}
                        value={pin6}
                        className={pin6 !== "" ? "filled" : ""}
                        autoFocus
                      />
                    </>
                  ) : (
                    <InputCode
                      {...pinConfig}
                      name="six"
                      onChange={handleChangePin6}
                      className={pin6 !== "" ? "filled" : ""}
                      value={pin6}
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
                                      addressId: 0, 
                                      firstname: String(userB2E.getB2EUserDetails.nombre), 
                                      lastname: " ", 
                                      email: userDetails.details.email,
                                      nit: userB2E.getB2EUserDetails.nit,
                                      telephone: userB2E.getB2EUserDetails.celular,
                                      street: address.direccion,
                                      reference: address.televendedor,
                                      city: titleCase(address.ciudad),
                                      latitude: address.latitud,
                                      longitude: address.longitud,
                                      billing: 0,
                                      id_price_list: address.id_listaPrecio,
                                      id_address_ebs: address.id_direccion

                                    }
                                  })
                                })
                              )
                          }
                          setLoader(false)
                          setSteps(Steps.AccountActivated)
                        }
                      } else {
                        setSteps(Steps.AskPin)
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
                      setSteps(Steps.AskNit)
                    }}
                  >
                    {t("employeeModal.reenviar")}
                  </SmallTextBtn>
                </Disclaimer>

                <Disclaimer>
                  <span>¿El teléfono es incorrecto?</span>
                  <Anchor href="mailto:etoledo@avicolasofia.com">
                    Ayuda
                  </Anchor>
                </Disclaimer>
              </Fragment>
            ): null}

            {steps === Steps.AccountActivated ? (
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
                      setSteps(Steps.AskNit);
                      setKnowCode(true);
                      setShowOpen(false); 
                      setTimeout(() => (window as any).location.reload(), 0);
                    }}
                    text={t("employeeModal.siguiente")}
                  />
                </CtaWrapper>
              </Fragment>
            ): null}

            {steps === Steps.InvalidAccount ? (
              <Fragment>
                <Title marginBottom={"30px"}>
                  {t("auth_modal.activate_account.title")}
                </Title>

                <SmallText marginBottom={"30px"}>
                Estimado colaborador, debes contactar a <Anchor href="mailto:etoledo@avicolasofia.com">Servicios Comerciales</Anchor> para revisar la información de tu cuenta.
                </SmallText>

                <CtaWrapper>
                  <Cta
                    filled={true}
                    action={() => {
                      setKnowCode(true);
                      setSteps(Steps.AskNit)
                    }}
                    text={t("auth_modal.activate_account.back")}
                  />
                </CtaWrapper>
              </Fragment>
            ): null}

      
          </Modal>
      </ModalCourtain>
    </Wrapper>
  );
};

export default EmployeeModal;
