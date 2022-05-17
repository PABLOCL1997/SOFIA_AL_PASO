import React, { FC, Suspense, useState, useEffect, useMemo, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-apollo";
import { DETAILS, GET_USER } from "../../../../graphql/user/queries";
import useCityPriceList from "../../../../hooks/useCityPriceList";
import * as SC from "./style";
import { handleNext } from "../../../../types/Checkout";
import { useHistory } from "react-router-dom";
import { Checkout, IBilling, validateEbsCharacters } from "../../../../utils/validations";
import { FormikProvider, useFormik } from "formik";
import Input from "../../../Formik/components/Input";
import { useUrlQuery } from "../../../../hooks/useUrlQuery";
import EmojiHappy from "../../../../assets/images/happy-emoji.svg";
import { SET_USER } from "../../../../graphql/user/mutations";
import { token as StoreToken } from "../../../../utils/store";
import { Courtain } from "../../../../context/Courtain";
import useAuth from "../../../../auth";
import useCheckout from "../../../../hooks/useCheckout";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../../Loader"));
const CallToAction = React.lazy(() => import(/* webpackChunkName: "CallToAction" */ "../../../Cta"));


const Billing: FC<{
    updateOrder: (field: string, values: IBilling) => void,
    orderData: IBilling
  }> = ({ updateOrder, orderData }) => {
  const { t } = useTranslation();  
  const { setLoading } = useContext(Courtain.Context);
  const history = useHistory();
  const query = useUrlQuery();
  const nextStep = query.get("next") || "shipping";
  const { agency } = useCityPriceList();
  const { checkout: { isGuestOrder } } = useCheckout();
  const [isValid, setIsValid] = useState(false);  
  const fields = ["firstname", "lastname", "email", "nit", "phone"];
  const [errorRegister, setErrorRegister] = useState("");
  const { signUp, recoverPassword } = useAuth();
  
  const { data: localUserData } = useQuery(GET_USER, {});
  const [setUser] = useMutation(SET_USER);
  const [toggleLogin] = useMutation(SET_USER, {
    variables: { user: { isLoggedIn: true } },
  });
  const isLoggedIn = useMemo(() => localUserData.userInfo[0].isLoggedIn, [localUserData?.userInfo?.[0]?.isLoggedIn]);   
  
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      nit: "",
      phone: "",
    },
    validationSchema: Checkout.Validators.billingSchema,
    onSubmit: () => {},
  });

  useQuery(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      if (d.details) {
        const details = {
          firstname: orderData.firstname || d.details.firstname,
          lastname: orderData.lastname || d.details.lastname,
          email: orderData.email || d.details.email,
          nit: orderData.nit || d.details.nit,
          phone: orderData.phone || d.details.phone?.split(" | ")?.[0] || "",
          facturacion_id: d.details.addressId || 0,
        }
        formik.setValues(details);
        updateOrder("billing", details);
      }
    },
    onError: () => {
      const details = {
        firstname: orderData.firstname,
        lastname: orderData.lastname,
        email: orderData.email,
        nit: orderData.nit,
        phone: orderData.phone,
      }
      formik.setValues(details);
    }
  });  

  const onChange = (key: string, value: string) => {
    const validateNit = Checkout.ValidationsForm.Billing.nit(key, value);
    const validateEBSCharacters = validateEbsCharacters(value);
    const isWriting = formik.values[key as keyof typeof formik.values].length < value.length;
    if(!validateNit) return;    
    if(!validateEBSCharacters && isWriting) return;
    formik.setFieldValue(key, value);
    updateOrder("billing", {
      ...formik.values,
      [key]: value }
    );
  };  

  const handleGuestUser = () => {
    setLoading(true);
    setErrorRegister("");
    const values = {
      email: formik.values.email,
      firstname: formik.values.firstname,
      lastname: formik.values.lastname,
      password: String(Math.floor(100000 + Math.random() * 900000)),
      network: false,
    }
    signUp({ variables: values })
      .then((res) => {
        const token = res.data?.signup?.token;
        toggleLogin();
        StoreToken.set(token);
        recoverPassword({ 
          variables: { 
            email: values.email, 
            bompras: false,
            url: process.env.REACT_APP_SITE_URL + "/password-reset",
          }})
          .then(() => console.log("Email recover password sended"))
          .catch((e) => console.log("Error send recover password", e));
        setLoading(false);
        handleNext(history, nextStep);
      })
      .catch(() => {
        setErrorRegister(t("checkout.billing.error_guest"));
        setLoading(false);
      });    
  };
  
  const handleNextStep = () => {
    if (!isLoggedIn && isGuestOrder) {
      handleGuestUser();
      return;
    };
    handleNext(history, nextStep);
  };

  const handleLoginModal = () => {
    setUser({ variables: { user: { openLoginModal: true } } });
  };

  useEffect(() => {
    const checkBilling = async () => {
      try {
        await Checkout.Validations.Billing(formik.values as IBilling);
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
      }
    }

    checkBilling();      
  }, [formik, agency]);  

  useEffect(() => {
    if (!isGuestOrder) {
      setErrorRegister("");
    }
  }, [isGuestOrder]);

  return (
    <Suspense fallback={<Loader />}>
      {isGuestOrder ? <SC.GuestTitle>        
        <SC.Title>  
          {t("checkout.billing.title_guest")}
          <SC.Emoji loading="lazy" src={EmojiHappy} alt="emoji-happy"/>
        </SC.Title>
        <SC.Subtitle>{t("checkout.billing.subtitle_guest")}</SC.Subtitle>
      </SC.GuestTitle> :
      <SC.Title>{t("checkout.billing.title")}</SC.Title>} 
              
      <FormikProvider value={formik} >
        <SC.Form>
          {fields.map((field) => (                    
            <Input
              errorText={field === "email" && errorRegister ? errorRegister : ""}
              errorCallback={field === "email" && errorRegister ? handleLoginModal : null}
              variant={field === "email" && errorRegister ? "error" : "default"}
              name={field}
              onChange={(evt) => onChange(field, evt.target.value)}
              readOnly={false}
              label={t("checkout.billing." + field)}
              placeholder={t("checkout.billing." + field)}
              value={formik.values[field as keyof typeof formik.values]}
            />
          ))}
        </SC.Form>
      </FormikProvider>

      <SC.Next.Wrapper>
        <CallToAction
          filled={true}
          text={t("general.next")}
          action={handleNextStep}
          active={isValid}
        />         
      </SC.Next.Wrapper>
    </Suspense>
  );
};

export default Billing;
