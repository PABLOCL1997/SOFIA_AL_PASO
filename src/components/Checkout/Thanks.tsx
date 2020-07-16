import React, { FC, Suspense } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../../utils/constants";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const ThankCheck = React.lazy(() =>
  import(/* webpackChunkName: "ThankCheck" */ "../Images/ThankCheck")
);
const ThankDelivery = React.lazy(() =>
  import(/* webpackChunkName: "ThankDelivery" */ "../Images/ThankDelivery")
);
const ThankMail = React.lazy(() =>
  import(/* webpackChunkName: "ThankMail" */ "../Images/ThankMail")
);
const ThankPhone = React.lazy(() =>
  import(/* webpackChunkName: "ThankPhone" */ "../Images/ThankPhone")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));

const Container = styled.div``;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  text-align: center;

  h1 {
    font-family: MullerMedium;
    font-size: 48px;
    line-height: 48px;
    color: var(--black);
    margin-top: 40px;
  }

  p {
    font-size: 20px;
    line-height: 30px;
    color: var(--font);
    margin-top: 20px;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 800px;
  padding: 20px;
  margin: 60px auto;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
    margin: 0 auto 20px;
  }
`;

const Box = styled.div`
  text-align: left;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    > div {
      text-align: left;
      margin-left: 20px;
    }
  }
  svg {
    width: 40px;
    height: 40px;
  }
`;

const GridText = styled.div`
  font-size: 14px;
  line-height: 120%;
  letter-spacing: 0.02em;
  color: var(--font);
  max-width: 200px;
  margin-top: 20px;
`;

const Disclaimer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 360px;
  text-align: center;
  color: var(--black);
  font-size: 14px;
  line-height: 18px;
  margin: 0 auto;
  p {
    margin: 15px 0;
  }
  b {
    font-family: MullerBold;
  }
`;

const CtaWrapper = styled.div`
  button {
    padding: 12px 50px;
    margin: 40px auto;
    text-transform: uppercase;
  }
  span {
    font-size: 14px;
  }
`;

type Props = {
  orders: Array<{ entity_id: string; increment_id: string }>;
};

const Thanks: FC<Props> = ({ orders }) => {
  const { t } = useTranslation();
  const history = useHistory();

  let subtitle =
    orders.length === 1
      ? t("thankyou.subtitle", { increment_id: orders[0].increment_id })
      : t("thankyou.mulitple_subtitle") +
        "<br />" +
        t("thankyou.multiple_subtitle_numbers", {
          increment_ids: orders
            .map((order: { increment_id: string }) => `#${order.increment_id}`)
            .join(" y ")
        });

  return (
    <Suspense fallback={<Loader />}>
      <Container>
        <Title>
          <ThankCheck />
          <h1>{t("thankyou.title")}</h1>
          <p dangerouslySetInnerHTML={{ __html: subtitle }}></p>
        </Title>
        <Grid>
          <Box>
            <ThankMail />
            <div>
              <GridText>{t("thankyou.mail")}</GridText>
            </div>
          </Box>
          <Box>
            <ThankDelivery />
            <div>
              <GridText>{t("thankyou.time")}</GridText>
            </div>
          </Box>
          <Box>
            <ThankPhone />
            <div>
              <GridText>{t("thankyou.phone")}</GridText>
            </div>
          </Box>
        </Grid>
        <Disclaimer>
          <b>{t("thankyou.client.title")}</b>
          <p>{t("thankyou.client.text")}</p>
          <b>{t("thankyou.client.thanks")}</b>
        </Disclaimer>
        <CtaWrapper>
          <Cta
            action={() => history.push("/")}
            text={t("thankyou.go_home")}
            filled={true}
          />
        </CtaWrapper>
      </Container>
    </Suspense>
  );
};

export default Thanks;
