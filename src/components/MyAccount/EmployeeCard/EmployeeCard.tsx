import React, {
  Suspense,
  FC,
  SetStateAction
} from "react";
import { Wrapper, TextWrap, ActivaTitle } from "./style";
import Icon from "../../../assets/images/empresa-seleccionado.svg";
import Checked from "../../../assets/images/checked.svg"

type Props = {
  setShowOpen?: React.Dispatch<SetStateAction<boolean>>;
  cuentaActiva: boolean;
};
const EmployeeCard: FC<Props> = ({ setShowOpen, cuentaActiva }) => {
  return (
    <Suspense fallback={<div />}>
      <Wrapper>
        <img src={Icon} alt="maleta" />
        <TextWrap onClick={() => setShowOpen && setShowOpen(true)}>
          {cuentaActiva ? (
            <ActivaTitle>
              <h4>Cuenta de colaborador activada</h4>
              <img src={Checked} alt="Listo"/>
            </ActivaTitle>
          ) : (
            <p>
              ¿Eres colaborador interno?
              <br /> <span>Activa tu cuenta</span> para obtener más beneficios.
            </p>
          )}
        </TextWrap>
      </Wrapper>
    </Suspense>
  );
};

export default EmployeeCard;
