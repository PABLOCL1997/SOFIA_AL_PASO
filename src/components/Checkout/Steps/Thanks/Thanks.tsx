import React, { FC, Suspense, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as SC from "./style";
import CloseModalIcon from "../../../../assets/images/close-modal.svg";

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../../Loader"));
const ThankCheck = React.lazy(() => import(/* webpackChunkName: "ThankCheck" */ "../../../Images/ThankCheck"));
const ThankDelivery = React.lazy(() => import(/* webpackChunkName: "ThankDelivery" */ "../../../Images/ThankDelivery"));
const ThankMail = React.lazy(() => import(/* webpackChunkName: "ThankMail" */ "../../../Images/ThankMail"));
const ThankPhone = React.lazy(() => import(/* webpackChunkName: "ThankPhone" */ "../../../Images/ThankPhone"));
const CallToAction = React.lazy(() => import(/* webpackChunkName: "CallToAction" */ "../../../Cta"));


type Props = {
  orders: Array<{ increment_id: string }>;
  isPickup: boolean;
  guestOrder?: boolean;
};

const Thanks: FC<Props> = ({ orders, isPickup, guestOrder }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [showGuestModal, setShowGuestModal] = useState(Boolean(guestOrder));

  let subtitle =
    orders.length === 1
      ? t("thankyou.subtitle", { increment_id: orders[0].increment_id })
      : t("thankyou.mulitple_subtitle") +
        "<br />" +
        t("thankyou.multiple_subtitle_numbers", {
          increment_ids: orders.map((order: { increment_id: string }) => `#${order.increment_id}`).join(" y "),
        });
    
    useEffect(() => {
      const body = document.querySelector("body");
      if (body && window.innerWidth >= 768) body.style.overflow = "unset";
    }, []);

  return (
    <Suspense fallback={<Loader />}>
      <SC.Container>
        {showGuestModal ? <SC.ModalCourtain>
          <SC.Modal>
            <SC.Header>
              <h4>{t("thankyou.guest.title")}</h4>
              <SC.Icon src={CloseModalIcon} alt="CloseModalIcon" onClick={() => setShowGuestModal(false)}/>
            </SC.Header>
            <p>{t("thankyou.guest.description")}</p>
          </SC.Modal>
        </SC.ModalCourtain> : null}
        <SC.Title>
          <ThankCheck />
          <h2>{t("thankyou.title")}</h2>
          <p dangerouslySetInnerHTML={{ __html: subtitle }}></p>
        </SC.Title>
        <SC.Grid>
          <SC.Box>
            <ThankMail />
            <div>
              <SC.GridText>{t("thankyou.mail")}</SC.GridText>
            </div>
          </SC.Box>
          <SC.Box>
            <ThankDelivery />
            <div>
              {isPickup ? (
                <SC.GridText>
                  Tu pedido será preparado lo antes posible para retirar dentro de la próxima hora en la agencia Sofía al Paso seleccionada, de Lunes a Domingo (
                  <a href="http://sofiaalpaso.com/" target="_blank">
                    ver horarios
                  </a>
                  )
                </SC.GridText>
              ) : (
                <SC.GridText>{t("thankyou.time")}</SC.GridText>
              )}
            </div>
          </SC.Box>
          <SC.Box>
            <ThankPhone />
            <div>
              <SC.GridText>{t("thankyou.phone")}</SC.GridText>
            </div>
          </SC.Box>
        </SC.Grid>
        <SC.Disclaimer>
          <b>{t("thankyou.client.title")}</b>
          <p>{t("thankyou.client.text")}</p>
          <b>{t("thankyou.client.thanks")}</b>
        </SC.Disclaimer>

        <SC.Footer.Wrapper>
            <SC.Footer.Cta>
                <CallToAction
                    text={t("thankyou.go_home")}
                    action={() => history.push("/")}
                    filled
                />
            </SC.Footer.Cta>
        </SC.Footer.Wrapper>
      </SC.Container>
    </Suspense>
  );
};

export default Thanks;
