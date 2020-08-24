import React, { FC, useEffect, Suspense } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Loader = React.lazy(() =>
  import(/* webpackChunkName: "Loader" */ "../Loader")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../Cta"));

const ModalCourtain = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 4;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &.visible {
    display: flex;
  }
`;

const Modal = styled.div`
  position: relative;
  padding: 42px;
  background: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;
`;

const Title = styled.h2`
  font-family: MullerMedium;
  font-size: 24px;
  line-height: 24px;
  color: var(--black);
  margin: 20px 0;
`;

const Text = styled.p`
  font-size: 14px;
  line-height: 142%;
  text-align: center;
  letter-spacing: 0.02em;
  color: var(--font);
  max-width: 400px;
  margin-bottom: 30px;
`;

const CtaWrapper = styled.div`
  display: flex;
  > div:last-child {
    margin-left: 10px;
  }
  button {
    padding: 10px 20px;
    text-transform: uppercase;
    span {
      font-size: 14px;
    }
  }
`;

type Props = {
  visible: boolean;
  address: string;
  confirm: Function;
  cancel: Function;
};

const ConfirmAddress: FC<Props> = ({ visible, confirm, address, cancel }) => {
  const { t } = useTranslation();

  return (
    <Suspense fallback={<Loader />}>
      <ModalCourtain className={visible ? "visible" : ""}>
        {visible && (
          <Modal>
            <Title>{t("checkout.confirmaddress.title")}</Title>
            <Text>
              {t("checkout.confirmaddress.message", {
                address: address ? address : (window as any).formatted_address
              })}
            </Text>
            <CtaWrapper>
              <Cta
                hover={false}
                text={t("checkout.confirmaddress.close")}
                action={() => cancel()}
              />
              <Cta
                hover={false}
                filled={true}
                text={t("checkout.confirmaddress.confirm")}
                action={() => confirm()}
              />
            </CtaWrapper>
          </Modal>
        )}
      </ModalCourtain>
    </Suspense>
  );
};

export default ConfirmAddress;
