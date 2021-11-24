import React, { Suspense, FC, Fragment, useState } from "react";

import * as SC from "./style";
import ArrowLeft from "../../../assets/images/arrow.svg";
import { customStyles } from "../../../utils/constants";
import { DesktopAndTablet, MobileAndTablet } from "../../ResponsiveContainers";

import { useQuery } from "react-apollo";
import { GET_BILL_DETAILS } from "../../../graphql/bill/queries";
import styled from "styled-components";

const LoaderWrapper = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  min-height: 150px;

  flex-grow: 4;
  img {
    width: 40px;
  }
`;
const centerLoader = { gridColumn: "3 / 4" } as React.CSSProperties;

type Props = {
  baseBillData: any;
  setOpenDetalle: any;
};
const FacturaDetalle: FC<Props> = ({ baseBillData, setOpenDetalle }) => {
  const [billData, setBillData] = useState<any>({});
  const [productsData, setProductsData] = useState<any>([]);
  const { data, loading } = useQuery(GET_BILL_DETAILS, {
    fetchPolicy: "no-cache",
    variables: { nit: baseBillData.cod_cliente, billCode: baseBillData.numero_factura },
    onCompleted: (d) => {
      let pData = d.getBillDetail.rows;

      if (pData.length > 0) {
        setBillData({
          razon_social: pData[0].razon_social,
          fecha_factura: pData[0].fecha_factura,
          numero_factura: pData[0].numero_factura,
          cod_cliente: pData[0].cod_cliente,
        });

        pData = pData.map((e: any) => {
          return {
            cod_producto: e.cod_producto,
            des_producto: e.des_producto,
            precio_uni: e.precio_uni,
            cantidad: e.cantidad,
            unidad_med: e.unidad_med,
            monto: (parseFloat(e.precio_uni.replace(",", ".")) * parseFloat(e.cantidad.replace(",", "."))).toFixed(2).replace(".00", ""),
          };
        });
        setProductsData(pData);
      }
    },
  });
  return (
    <Suspense fallback={<div></div>}>
      {!loading && data && (
        <SC.Wrapper>
          <SC.Headline>
            <SC.BackButton onClick={() => setOpenDetalle(false)}>
              <img src={ArrowLeft} alt={"<"} />
              <span>Lista de facturas</span>
            </SC.BackButton>
            <DesktopAndTablet>
              <SC.OrderTitle>
                Factura #{billData.numero_factura} • {billData.cod_cliente}
              </SC.OrderTitle>
            </DesktopAndTablet>
          </SC.Headline>
          <DesktopAndTablet>
            <SC.Grid>
              <SC.Card>
                <SC.CardHead>
                  <div>
                    <h5>Estado</h5>
                    <SC.Estado>
                      <SC.EstadoCircle color={baseBillData.estado === "Cerrado" ? customStyles.green : customStyles.orange}></SC.EstadoCircle>
                      <span>{baseBillData.estado}</span>
                    </SC.Estado>
                  </div>
                </SC.CardHead>
                <SC.EnvioYFacturacion>
                  <h5>Datos de facturación</h5>
                  <ul>
                    <li>Codigo cliente: {billData.cod_cliente}</li>
                    <li>Razon social: {billData.razon_social}</li>
                  </ul>
                </SC.EnvioYFacturacion>
              </SC.Card>
              <SC.TablaWrap>
                <SC.TablaHead>
                  <span>Cod. Producto</span>
                  <span>Desc. Producto</span>
                  <span>Precio unitario</span>
                  <span>Cantidad</span>
                  <span>Total</span>
                </SC.TablaHead>
                <SC.TablaContent>
                  {loading && (
                    <LoaderWrapper>
                      <img style={centerLoader} src="/images/loader.svg" alt="loader" />
                    </LoaderWrapper>
                  )}
                  {!loading &&
                    productsData &&
                    productsData.map((e: any, i: number) => {
                      return (
                        <Fragment key={`Row-${i}`}>
                          <div>
                            <span>{e.cod_producto}</span>
                            <span>{e.des_producto}</span>
                            <span>Bs. {e.precio_uni}</span>
                            <span>
                              {e.cantidad} {e.unidad_med}
                            </span>
                            <span>Bs. {e.monto}</span>
                          </div>
                        </Fragment>
                      );
                    })}
                </SC.TablaContent>
                <SC.SubtotalWrap>
                  <SC.Divider />
                  <div>
                    <h5>Total</h5>
                    <h5>Bs. {baseBillData.saldo_total}</h5>
                  </div>
                </SC.SubtotalWrap>
              </SC.TablaWrap>
            </SC.Grid>
          </DesktopAndTablet>
          <MobileAndTablet>
            <SC.GridMobile>
              <SC.ProductsCardMobile>
                <SC.ProductsHeadline>
                  <div>
                    <h5>Estado</h5>
                    <SC.Estado>
                      <SC.EstadoCircle color={baseBillData.estado === "Cerrado" ? customStyles.green : customStyles.orange}></SC.EstadoCircle>
                      <span>{baseBillData.estado}</span>
                    </SC.Estado>
                  </div>
                  <SC.OrderTitle>Factura #{billData.numero_factura}</SC.OrderTitle>
                </SC.ProductsHeadline>

                <SC.ProductsTable>
                  {!loading &&
                    productsData &&
                    productsData.map((e: any, i: number) => {
                      return (
                        <SC.ProductItem key={i}>
                          <span>{e.cod_producto}</span>
                          <h5>{e.des_producto}</h5>
                          <div>
                            <h6>
                              {e.cantidad} {e.unidad_med}
                            </h6>
                            <h6>Bs. {e.monto}</h6>
                          </div>
                        </SC.ProductItem>
                      );
                    })}
                </SC.ProductsTable>
                <SC.SubtotalWrap>
                  <SC.Divider />
                  <div>
                    <h5>Total</h5>
                    <h5>Bs. {baseBillData.saldo_total}</h5>
                  </div>
                </SC.SubtotalWrap>
              </SC.ProductsCardMobile>
              <SC.DatosTablaMobile>
                <SC.EnvioYFacturacion>
                  <h5>Datos de facturación</h5>
                  <ul>
                    <li>Codigo cliente: {billData.cod_cliente}</li>
                    <li>Razon social: {billData.razon_social}</li>
                  </ul>
                </SC.EnvioYFacturacion>
              </SC.DatosTablaMobile>
            </SC.GridMobile>
          </MobileAndTablet>
        </SC.Wrapper>
      )}
    </Suspense>
  );
};

export default FacturaDetalle;
