import React, { FC, useEffect, Suspense } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "react-apollo";
import { GET_USER } from "../graphql/user/queries";
import { SET_USER } from "../graphql/user/mutations";

const Loader = React.lazy(
  () => import(/* webpackChunkName: "Loader" */ "./Loader")
);
const Cta = React.lazy(() => import(/* webpackChunkName: "Loader" */ "./Cta"));

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
  button {
    padding: 10px 50px;
    text-transform: uppercase;
    span {
      font-size: 14px;
    }
  }
`;

type Props = {};

const ModalMessage: FC<Props> = () => {
  const { t } = useTranslation();
  const { data } = useQuery(GET_USER, {});
  const [hideModal] = useMutation(SET_USER, {
    variables: { user: { showModal: "" } }
  });
  const [toggleCartModal] = useMutation(SET_USER, {
    variables: { user: { openCartModal: true } }
  });

  useEffect(() => {
    hideModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <ModalCourtain
        className={
          data.userInfo.length && data.userInfo[0].showModal && "visible"
        }
      >
        {data.userInfo.length && data.userInfo[0].showModal && (
          <Modal>
            <Title>{data.userInfo[0].showModal.split("|")[0]}</Title>
            <Text>{data.userInfo[0].showModal.split("|")[1]}</Text>
            <CtaWrapper>
              <Cta
                filled={true}
                text={t("modal.close")}
                action={() => hideModal()}
              />
            </CtaWrapper>
            {data.userInfo[0].showModal.split("|")[0] ===
              "Producto agregado" && (
              <CtaWrapper>
                <br />
                <Cta
                  filled={false}
                  text={t("modal.cart")}
                  action={() => {
                    hideModal();
                    toggleCartModal();
                  }}
                />
              </CtaWrapper>
            )}
          </Modal>
        )}
      </ModalCourtain>
    </Suspense>
  );
};

export default ModalMessage;
