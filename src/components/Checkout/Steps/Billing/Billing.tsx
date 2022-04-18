import React, { FC, Suspense, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-apollo";
import { DETAILS } from "../../../../graphql/user/queries";
import useCityPriceList from "../../../../hooks/useCityPriceList";
import * as SC from "./style";
import { handleNext } from "../../../../types/Checkout";
import { useHistory } from "react-router-dom";
import { Checkout, IBilling } from "../../../../utils/validations";
import { FormikProvider, useFormik } from "formik";
import Input from "../../../Formik/components/Input";
import { useUrlQuery } from "../../../../hooks/useUrlQuery";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../../Loader"));
const CallToAction = React.lazy(() => import(/* webpackChunkName: "CallToAction" */ "../../../Cta"));


const Billing: FC<{
    updateOrder: (field: string, values: IBilling) => void,
    orderData: IBilling
  }> = ({ updateOrder, orderData }) => {
  
  const { t } = useTranslation();
  const history = useHistory();
  const query = useUrlQuery();
  const nextStep = query.get("next") || "shipping";
  const { agency } = useCityPriceList();

  const [isValid, setIsValid] = useState(false);  
  const fields = ["firstname", "lastname", "email", "nit", "phone"];
  
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
  })

  const { loading } = useQuery(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      if (d.details) {
        const details = {
          firstname: orderData.firstname || d.details.firstname,
          lastname: orderData.lastname || d.details.lastname,
          email: orderData.email || d.details.email,
          nit: orderData.nit || d.details.nit,
          phone: orderData.phone || d.details.phone?.split(" | ")[0],
          facturacion_id: d.details.addressId || 0,
        }
        formik.setValues(details);
        updateOrder("billing", details);
      }
    }
  });  

  const onChange = (key: string, value: string) => {
    const validateNit = Checkout.ValidationsForm.Billing.nit(key, value);
    if(!validateNit) return;
    formik.setFieldValue(key, value);
    updateOrder("billing", {
      ...formik.values,
      [key]: value }
    );
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

  return (
    <Suspense fallback={<Loader />}>
        <SC.Title>{t("checkout.billing.title")}</SC.Title>
          <FormikProvider value={formik} >
            <SC.Form>
              {!loading && fields.map((field) => (                                  
                <Input
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
            action={() => handleNext(history, nextStep)}
            active={isValid}
          />
        </SC.Next.Wrapper>
    </Suspense>
  );
};

export default Billing;
