import React, { Suspense, FC } from "react";
import { Wrapper, Lista, Item, Image, Text, Line } from "./style";
import { useHistory } from "react-router-dom";

import ProfileTabIconGrey from "../../assets/images/profile-icon.svg";
import ProfileTabIconRed from "../../assets/images/profile-icon-red.svg";
import HistorialTabIconRed from "../../assets/images/historial-tab-icon.svg";
import HistorialTabIconGrey from "../../assets/images/historial-tab-icon-grey.svg";
import ListaFacturasGrey from "../../assets/images/lista-facturas-grey.svg";
import ListaFacturasRed from "../../assets/images/lista-facturas-red.svg";
import ColaboradoresTabIconGrey from "../../assets/images/empresa-tab-icon.svg";

type Props = {
  active: string;
  setActive?: any;
};
const Tabs: FC<Props> = ({ active, setActive }) => {
  const history = useHistory();

  const goToActivacion = () => history.push("/activacion");

  return (
    <Suspense fallback={<div></div>}>
      <Wrapper>
        <Lista active={active === "" || active === "historial" || active === "facturas"} className={"disable-scrollbars"}>
          <Item active={active === ""} onClick={() => setActive("")}>
            {active === "" ? <Image src={ProfileTabIconRed} alt="" /> : <Image src={ProfileTabIconGrey} alt="" />}
            <Text active={active === ""}>Datos personales</Text>
          </Item>
          <Item active={active === "historial"} onClick={() => setActive("historial")}>
            {active === "historial" ? <Image src={HistorialTabIconRed} alt="" /> : <Image src={HistorialTabIconGrey} alt="" />}
            <Text active={active === "historial"}>Historial de órdenes</Text>
          </Item>
          <Item active={active === "facturas"} onClick={() => setActive("facturas")}>
            {active === "facturas" ? <Image src={ListaFacturasRed} alt="" /> : <Image src={ListaFacturasGrey} alt="" />}
            <Text active={active === "facturas"}>Listado de facturas</Text>
          </Item>
          <Item onClick={goToActivacion}>
            <Image src={ColaboradoresTabIconGrey} alt="" />
            <Text>Colaboradores</Text>
          </Item>
        </Lista>
        <Line />
      </Wrapper>
    </Suspense>
  );
};

export default Tabs;
