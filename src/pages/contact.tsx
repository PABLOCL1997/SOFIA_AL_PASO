import React, { Suspense, FC, useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import { BREAKPOINT } from "../utils/constants";
import DelayedWrapper from "../components/DelayedWrapper";
import { useTranslation } from "react-i18next";
import { SET_USER } from "../graphql/user/mutations";
import { SEND_CONTACT_FORM } from "../graphql/user/mutations";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../components/Loader"));

const Switch = React.lazy(() => import(/* webpackChunkName: "Switch" */ "../components/Switch"));

const Chevron = React.lazy(() => import(/* webpackChunkName: "Chevron" */ "../components/Images/Chevron"));

const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../components/Cta"));

const Header = styled.div`
  position: relative;
  padding: 54px 0;
  text-align: center;
  box-shadow: 0px -1px 52px rgba(0, 0, 0, 0.08);

  h1 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 40px;
    line-height: 1.5em;
    color: var(--black);
  }

  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -4px;
    margin-left: -40px;
    width: 80px;
    height: 8px;
    border-radius: 15px;
    background: var(--red);
  }

  @media screen and (max-width: ${BREAKPOINT}) {
    padding: 40px 20px;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;

  h2 {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 2em;
    color: var(--black);
    text-align: center;
    margin: 20px auto;

    &.footer {
      margin: 50px auto;
    }
  }
`;

const InputGroup = styled.div<{ key: string }>`
  display: flex;
  flex-direction: column;
  label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 10px;
    line-height: 10px;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: var(--font);
    padding-left: 20px;
  }
  input,
  textarea {
    background: var(--whiter);
    border-radius: 44px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--font);
    padding: 12px 20px;
    border: 0;
    margin-top: 10px;
    &.error {
      border: 1px solid var(--red);
    }
  }
  textarea {
    resize: none;
  }
  &.extend {
    grid-column-start: 1;
    grid-column-end: 3;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  cursor: pointer;

  select {
    -webkit-appearance: none;
    width: 100%;
    background: var(--whiter);
    border-radius: 44px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: var(--font);
    padding: 10px 20px;
    border: 0;
    margin-top: 10px;
    cursor: pointer;
  }

  svg {
    pointer-events: none;
    position: absolute;
    top: 24px;
    right: 20px;
    path {
      stroke: var(--red);
    }
  }
`;

const Form = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 30px;
  width: 50%;
  margin: 0px auto 40px;
  padding-top: 20px;
  @media screen and (max-width: ${BREAKPOINT}) {
    grid-template-columns: 1fr;
    column-gap: 0;
    > div {
      grid-column-start: 1;
      grid-column-end: 3;
    }
  }
  > div.extend {
    grid-column-start: 1;
    grid-column-end: 3;

    &.center {
      margin: 0 auto;
    }
  }
`;

const options: { [key: string]: Array<string> } = {
  question: ["Productos", "Envíos", "Reclamo", "Prensa", "Otra"],
};

declare global {
  interface Window {
    grecaptcha: any;
  }
}

type Props = {};
const Faq: FC<Props> = () => {
  const { t } = useTranslation();
  const [inputs, setInputs] = useState<any>({
    question: "Productos",
  });
  const [sending, setSending] = useState<boolean>(false);
  const [showSuccess] = useMutation(SET_USER, {});
  const [sendContactForm] = useMutation(SEND_CONTACT_FORM, {
    onError: (e) => console.error("err", e),
    onCompleted: (d) => {
      if (d.sendcontactform) {
        return d.sendcontactform.status;
      } else {
        return null;
      }
    },
  });

  const onChange = (key: string, value: string | number | null, preventMap: boolean = false) => {
    if (key.indexOf("phone") >= 0 && String(value).length > 8) value = String(value).substring(0, 8);
    setInputs({
      ...inputs,
      [key]: value,
    });
  };

  const sendMail = async () => {
    let items = Object.fromEntries(Object.entries(inputs).filter(([key, value]) => value !== ""));
    let isValid = Object.keys(items).length == 7;

    if (!isValid) {
      showSuccess({
        variables: {
          user: {
            showModal: "Por favor completar todos los campos.",
          },
        },
      });
      return;
    }

    setSending(false);

    let result = await sendContactForm({
      variables: {
        name: inputs.name,
        email: inputs.email,
        question: inputs.question,
        phone: inputs.phone,
        city: inputs.city,
        country: inputs.country,
        message: inputs.message,
      },
    });

    if (result?.data?.sendcontactform?.status) {
      showSuccess({
        variables: {
          user: {
            showModal: "Email enviado con éxito",
          },
        },
      });
    } else {
      showSuccess({
        variables: {
          user: {
            showModal: "Hubo un error al enviar el mail",
          },
        },
      });
    }

    setSending(true);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=6LdJmMQfAAAAAARYZYvpujmHVI7Bs87EtSur241o";
    script.addEventListener("load", () => {
      window.grecaptcha.ready(function () {
        window.grecaptcha.execute("6LdJmMQfAAAAAARYZYvpujmHVI7Bs87EtSur241o", { action: "submit" }).then((token: any) => {
          var el = document.getElementsByClassName("grecaptcha-badge")[1] as HTMLElement;
          el.style.display = "none";
          if (token) {
            setSending(true);
          }
        });
      });
    });
    document.body.appendChild(script);
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <DelayedWrapper>
        <Header>
          <Container>
            <h1>Contactanos</h1>
          </Container>
        </Header>
        <Container>
          <h2>¿Dudas o sugerencias? Escríbenos</h2>
          <Form>
            {["name", "email", "question", "phone", "city", "country", "message"].map((key: string) => {
              return (
                <InputGroup className={key == "message" ? "extend" : ""} key={key}>
                  <label>{t("contact.form." + key)}</label>
                  {options[key] && (
                    <SelectWrapper>
                      <select name={`${key}`} onChange={(evt) => onChange(key, evt.target.value)} value={options[0]}>
                        {options[key].map((opt: string) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                      <Chevron />
                    </SelectWrapper>
                  )}
                  {key !== "question" && key !== "message" && (
                    <input
                      name={`${key}`}
                      value={inputs[key] || ""}
                      onChange={(evt) => onChange(key, evt.target.value)}
                      pattern={key.indexOf("phone") >= 0 ? "[0-9]*" : ""}
                      type={key.indexOf("phone") >= 0 ? "number" : "text"}
                      placeholder={t("contact.form." + key)}
                    />
                  )}
                  {key === "message" && <textarea name={`${key}`} value={inputs[key] || ""} onChange={(evt) => onChange(key, evt.target.value)} placeholder={t("contact.form." + key)} />}
                </InputGroup>
              );
            })}
            <div className="extend center">
              <div className="g-recaptcha" data-sitekey="6LdJmMQfAAAAAARYZYvpujmHVI7Bs87EtSur241o" data-size="invisible" data-badge="inline"></div>
            </div>
            <div className="extend center">
              <Cta active={sending} filled={true} text={t("contact.send")} action={sendMail} />
            </div>
          </Form>
          <h2 className="footer">¡Gracias por confiar!</h2>
        </Container>
      </DelayedWrapper>
    </Suspense>
  );
};

// prod
// 6LdJmMQfAAAAAARYZYvpujmHVI7Bs87EtSur241o

// test
// 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI

export default Faq;
