import React, { FC, Suspense } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { BREAKPOINT } from "../../utils/constants";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const DeliveryBag = React.lazy(() =>
  import(/* webpackChunkName: "DeliveryBag" */ "../Images/DeliveryBag")
);
const FreeShipping = React.lazy(() =>
  import(/* webpackChunkName: "FreeShipping" */ "../Images/FreeShipping")
);
const Wallet = React.lazy(() =>
  import(/* webpackChunkName: "Wallet" */ "../Images/Wallet")
);

const Container = styled.div``;

const Title = styled.div`
  font-family: MullerMedium;
  font-size: 40px;
  line-height: 40px;
  color: var(--black);
  text-align: center;
  padding: 10px 20px;
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 20px;
    line-height: 20px;
  }
`;

const Text = styled.div`
  font-size: 12px;
  line-height: 120%;
  text-align: center;
  padding: 0 20px;
  max-width: 380px;
  margin: 6px auto 72px;
  letter-spacing: 0.02em;
  color: var(--font);
  @media screen and (max-width: ${BREAKPOINT}) {
    font-size: 12px;
    line-height: 131%;
    max-width: 300px;
    margin-bottom: 0;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 800px;
  padding: 20px;
  margin: 0 auto;
  @media screen and (max-width: ${BREAKPOINT}) {
    flex-direction: column;
  }
`;

const Box = styled.div`
  text-align: center;
  @media screen and (max-width: ${BREAKPOINT}) {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    > div {
      text-align: left;
      margin-left: 20px;
    }
  }
  img {
    width: 118px;
    height: 118px;

     @media screen and (max-width: ${BREAKPOINT}) {
      width: 64px;
      height: 64px;
    }
  }
`;

const GridTitle = styled.div`
  font-family: MullerMedium;
  font-size: 18px;
  line-height: 110%;
  margin: 24px 0 16px;
  color: var(--black);
  max-width: 175px;
  @media screen and (max-width: ${BREAKPOINT}) {
    margin: 24px 0 8px;
  }
`;

const GridText = styled.div`
  font-size: 14px;
  line-height: 120%;
  letter-spacing: 0.02em;
  color: var(--font);
  max-width: 200px;
`;

type Props = {};

const Benefits: FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<Loader />}>
      <div className="main-container">
        <Container>
          <Title>{t("homepage.benefits.title")}</Title>
          <Text>{t("homepage.benefits.text")}</Text>
          <Grid>
            <Box>
              <DeliveryBag />
              <div>
                <GridTitle>{t("homepage.benefits.delivery.title")}</GridTitle>
                <GridText>{t("homepage.benefits.delivery.text")}</GridText>
              </div>
            </Box>
            <Box>
              <Wallet />
              <div>
                <GridTitle>{t("homepage.benefits.payment.title")}</GridTitle>
                <GridText>{t("homepage.benefits.payment.text")}</GridText>
              </div>
            </Box>
            <Box>
              <FreeShipping />
              <div>
                <GridTitle>{t("homepage.benefits.order.title")}</GridTitle>
                <GridText>{t("homepage.benefits.order.text")}</GridText>
              </div>
            </Box>
          </Grid>
        </Container>
      </div>
    </Suspense>
  );
};

export default Benefits;
