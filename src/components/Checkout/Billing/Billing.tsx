import React, { FC, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-apollo";
import { DETAILS } from "../../../graphql/user/queries";
import useCityPriceList from "../../../hooks/useCityPriceList";
import * as SC from "./style";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../Loader"));

type Props = {
  updateOrder: Function;
  localUserData: any;
};

const Billing: FC<Props> = ({ updateOrder, localUserData }) => {
  const { t } = useTranslation();
  const [other, setOther] = useState(false);
  const [inputs, setInputs] = useState({});
  const { data: userData } = useQuery(DETAILS);
  const specialAddress = localUserData.userInfo[0].idPriceList && localUserData.userInfo[0].idPriceList > 0;
  const { agency } = useCityPriceList();
  const [fields, setFields] = useState<string[]>([]);

  const onChange = (key: string, value: string) => {
    setInputs({
      ...inputs,
      [key]: value,
    });
  };

  const loadUser = () => {
    if (userData && userData.details) {
      setInputs({
        firstname: userData.details.firstname,
        lastname: userData.details.lastname,
        email: userData.details.email,
        nit: userData.details.nit,
        phone: userData.details.phone,
      });
    }
  };

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
    if ((inputs as any).email) updateOrder("billing", inputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  useEffect(() => {
    if (agency) {
      setFields(["firstname", "lastname", "email", "nit", "phone"]);
    } else {
      setFields(["firstname", "lastname", "email", "nit"]);
    }
  }, [agency]);

  return (
    <Suspense fallback={<Loader />}>
      <React.Fragment>
        <SC.Title>{t("checkout.billing.title")}</SC.Title>
        <SC.Form>
          {fields.map((key: string) => (
            <SC.InputGroup key={key}>
              <label>{t("checkout.billing." + key)}</label>
              <input
                readOnly={specialAddress}
                name={`billing-${key}`}
                value={(inputs as any)[key] || ""}
                onChange={(evt) => onChange(key, evt.target.value)}
                pattern={key === "nit" ? "[0-9]*" : ""}
                type={key === "nit" ? "number" : "text"}
                placeholder={t("checkout.billing." + key)}
              />
            </SC.InputGroup>
          ))}
        </SC.Form>
        {!specialAddress && <SC.Other onClick={() => setOther(!other)}>{t(!other ? "checkout.billing.other_person" : "checkout.billing.to_me")}</SC.Other>}
      </React.Fragment>
    </Suspense>
  );
};

export default Billing;
