import React, { Suspense, FC, Fragment, useState, useEffect } from "react";
import * as SC from "./style";
import ArrowLeft from "../../../assets/images/arrow.svg";
import { customStyles } from "../../../utils/constants";
import { DesktopAndTablet, MobileAndTablet } from "../../ResponsiveContainers";
import { useLazyQuery, useMutation, useQuery } from "react-apollo";
import { ADD_ITEM } from "../../../graphql/cart/mutations";
import { SET_USER } from "../../../graphql/user/mutations";
import { ORDER } from "../../../graphql/user/queries";
import { GET_PRODUCTS } from "../../../graphql/products/queries";
import { cities, KeyValue, search } from "../../../utils/string";
import styled from "styled-components";
import OrderStatus from "../OrderStatus";

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

export const GridHeader = styled.div`
  display: grid;
  grid-template-columns: 5fr 1fr;
  margin-bottom: 25px;
  align-items: center;
`;

export const OrderTitleDesktop = styled.h3`
  font-family: 'MontserratMedium';
  font-size: 24px;
  line-height: 32px;
  color: ${customStyles.red};
`;

const centerLoader = { gridColumn: "3 / 4" } as React.CSSProperties;
const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../../Cta"));

type Props = {
  data: any;
  setOpenDetalle: any;
  userData: any;
  repeatOrder?: any;
};
const OrderDetails: FC<Props> = ({ data, setOpenDetalle, userData, repeatOrder }) => {
  const [repeatList, setRepeatList] = useState<any>([]);
  const [showList, setShowList] = useState<any>([]);
  const [finishLoading, setFinishLoading] = useState<boolean>(false);

  const [addItem] = useMutation(ADD_ITEM, {
    onCompleted: (d) => {
      toggleCartModal({
        variables: {
          user: { openCartModal: true },
        },
      });
    },
    onError: (e) => {
      console.log("error", e);
    },
  });

  const { data: orderData } = useQuery(ORDER, {
    fetchPolicy: "no-cache",
    variables: { orderId: data.orderId },
    onCompleted: () => getProducts(),
    onError: (e) => console.log(e),
  });

  const [getProducts, { data: productsData, loading: productsLoading }] = useLazyQuery(GET_PRODUCTS, {
    fetchPolicy: "no-cache",
    variables: {
      category_id: 0,
      limit: 1000,
      offset: 0,
      city: userData.details ? cities.find((c: KeyValue) => c.value === userData.details?.addresses.at(-1)) || "SC" : "SC",
    },
    onError: (e) => console.log("error", e),
    onCompleted: (c) => {
      const repeat: any[] = [];

      c.products.rows.forEach((row: any) => {
        const found = search("sku", row.sku, orderData.order.items);
        if (found) {
          repeat.push({ ...row, qty: found.cantidad > 0 ? found.cantidad : 1 });
        }
      });

      const showList = orderData.order.items.map((item: any) => {
        const found = search("sku", item.sku, c.products.rows);
        if (found) {
          return {
            ...item,
            sku: item.sku,
            precioUnitario: String(Number(item.price).toFixed(2)).replace(".", ","),
            cantidad: item.qty,
            unidad: item.useKGS ? "KGS" : item.unit,
            kilos: Number(item.weight).toFixed(2).replace(".", ","),
            total: String(Number(item.rowTotal).toFixed(2)).replace(".", ","),
            producto: found.useKGS ? `${found.name} DE ${Number(found.weight).toFixed(2).replace(".", ",")} KGS APROX.` : found.name,
          };
        }
        return item;
      });
      setShowList(showList);
      setRepeatList(repeat);
      setFinishLoading(true);
    },
  });

  const [toggleCartModal] = useMutation(SET_USER, {});

  const repetirCompraAction = () => {
    repeatList.forEach((row: any) => {
      addItem({
        variables: {
          product: { ...row },
        },
      });
    });
  };

  useEffect(() => {
    if (finishLoading && repeatOrder) {
      repetirCompraAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishLoading]);

  return (
    <Suspense fallback={<div></div>}>
      <SC.Wrapper>
        <SC.Headline>
          <SC.BackButton onClick={() => setOpenDetalle(false)}>
            <img src={ArrowLeft} alt={"<"} />
            <span>Historial de órdenes</span>
          </SC.BackButton>
          <DesktopAndTablet>
            <GridHeader>
              <OrderTitleDesktop>
                Orden #{data.orden} • {data.fecha}
              </OrderTitleDesktop>
              <SC.CtaWrap>
                <Cta hover={true} filled={true} text={"REPETIR COMPRA"} action={() => repetirCompraAction()} />
              </SC.CtaWrap>
            </GridHeader>
          </DesktopAndTablet>
        </SC.Headline>
        <DesktopAndTablet>
          <SC.Grid>
            <SC.Card>
              <SC.CardHead>
                <div>
                  <h5>Estado</h5>
                  <OrderStatus item={data} nit={userData?.details?.nit || 0} />
                </div>
                <div>
                  <h5>Canal</h5>
                  <SC.Canal>
                    <img src={data.canalImage} alt="" />
                    <span>{data.canal === "CALL CENTER" ? "Telemarketing" : data.canal === "WEB" ? "Ecommerce" : "Sucursal"}</span>
                  </SC.Canal>
                </div>
              </SC.CardHead>
              <SC.EnvioYFacturacion>
                <h5>Datos de facturación</h5>
                <ul>
                  <li>Nombre: {data.detalle.datosDeFacturacion.nombre}</li>
                  <li>NIT: {data.detalle.datosDeFacturacion.nit}</li>
                  <li>
                    Email: <a href={`mailto:${data.detalle.datosDeFacturacion.mail}`}>{data.detalle.datosDeFacturacion.mail}</a>{" "}
                  </li>
                  <li>
                    Celular: <a href={`tel:+${data.detalle.datosDeFacturacion.celular}`}>{data.detalle.datosDeFacturacion.celular}</a>{" "}
                  </li>
                </ul>
              </SC.EnvioYFacturacion>
              <SC.EnvioYFacturacion>
                <h5>Datos de Envío</h5>
                <ul>
                  <li>Dirección: {data.detalle.datosDeEnvio.street}</li>
                  <li>Ciudad: {data.detalle.datosDeEnvio.city}</li>
                  <li>Referencia: {data.detalle.datosDeEnvio.reference} </li>
                </ul>
              </SC.EnvioYFacturacion>
              <SC.CtaWrap>
                <Cta hover={true} filled={true} text={"REPETIR COMPRA"} action={() => repetirCompraAction()} />
              </SC.CtaWrap>
            </SC.Card>
            <SC.TablaWrap>
              <SC.TablaHead>
                <span>Producto</span>
                <span>SKU</span>
                <span>Precio unitario</span>
                <span>Cantidad</span>
                <span>Total</span>
              </SC.TablaHead>
              <SC.TablaContent>
                {productsLoading && (
                  <LoaderWrapper>
                    <img style={centerLoader} src="/images/loader.svg" alt="loader" />
                  </LoaderWrapper>
                )}
                {!productsLoading &&
                  productsData &&
                  showList.map((singleCompra: any, i: number) => {
                    return (
                      <Fragment key={`CompraRow-${i}`}>
                        <div>
                          <span>{singleCompra.producto}</span>
                          <span>{singleCompra.sku}</span>
                          <span>
                            Bs. {singleCompra.precioUnitario}/{String(singleCompra.unidad).toLowerCase().replaceAll("s", "")}
                          </span>
                          <span>
                            {singleCompra.unidad === "KGS"
                              ? `${singleCompra.kilos} ${String(singleCompra.unidad).toLowerCase()} (${singleCompra.cantidad} uni)`
                              : `${singleCompra.cantidad} ${String(singleCompra.unidad).toLowerCase()}`}
                          </span>
                          <span>Bs. {singleCompra.total}</span>
                        </div>
                      </Fragment>
                    );
                  })}
              </SC.TablaContent>
              <SC.SubtotalWrap>
                <div>
                  <h6>Subtotal</h6>
                  <h6>Bs. {data.subtotal}</h6>
                </div>
                <div>
                  <span>Envío</span>
                  <span>{data.envio}</span>
                </div>
                <SC.Divider />
                <div>
                  <h5>Total</h5>
                  <h5>Bs. {data.precio}</h5>
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
                  <OrderStatus item={data} nit={userData?.details?.nit || 0} />
                  <SC.FechaMobile> {data.fecha}</SC.FechaMobile>
                </div>
                <SC.OrderTitle>Orden #{data.orden}</SC.OrderTitle>
                <div>
                  <SC.Canal>
                    <img src={data.canalImage} alt="" />
                    <span>{data.canal === "CALL CENTER" ? "Telemarketing" : data.canal === "WEB" ? "Ecommerce" : "Sucursal"}</span>
                  </SC.Canal>
                </div>
              </SC.ProductsHeadline>

              <SC.ProductsTable>
                {showList.map((singleCompra: any, i: number) => {
                  return (
                    <SC.ProductItem key={i}>
                      <span>{singleCompra.sku}</span>
                      <h5>{singleCompra.producto}</h5>
                      <div>
                        <h6>
                          {singleCompra.unidad === "KGS"
                            ? `${singleCompra.kilos} ${String(singleCompra.unidad).toLowerCase()} (${singleCompra.cantidad} uni)`
                            : `${singleCompra.cantidad} ${String(singleCompra.unidad).toLowerCase()}`}{" "}
                          x{" Bs. "}
                          {singleCompra.precioUnitario} /{String(singleCompra.unidad).toLowerCase().replaceAll("s", "")}
                        </h6>
                        <h6>Bs. {singleCompra.total}</h6>
                      </div>
                    </SC.ProductItem>
                  );
                })}
              </SC.ProductsTable>
              <SC.SubtotalWrap>
                <div>
                  <h6>Bs. Subtotal</h6>
                  <h6>Bs. {data.subtotal}</h6>
                </div>
                <div>
                  <span>Bs. Envío</span>
                  <span>{data.envio}</span>
                </div>
                <SC.Divider />
                <div>
                  <h5>Total</h5>
                  <h5>Bs. {data.precio}</h5>
                </div>
              </SC.SubtotalWrap>
            </SC.ProductsCardMobile>
            <SC.DatosTablaMobile>
              <SC.EnvioYFacturacion>
                <h5>Datos de facturación</h5>
                <ul>
                  <li>Nombre: {data.detalle.datosDeFacturacion.nombre}</li>
                  <li>NIT: {data.detalle.datosDeFacturacion.nit}</li>
                  <li>
                    Email: <a href={`mailto:${data.detalle.datosDeFacturacion.mail}`}>{data.detalle.datosDeFacturacion.mail}</a>{" "}
                  </li>
                  <li>
                    Celular: <a href={`tel:+${data.detalle.datosDeFacturacion.celular}`}>{data.detalle.datosDeFacturacion.celular}</a>{" "}
                  </li>
                </ul>
              </SC.EnvioYFacturacion>
              <SC.EnvioYFacturacion>
                <h5>Datos de Envío</h5>
                <ul>
                  <li>Dirección: {data.detalle.datosDeEnvio.street}</li>
                  <li>Ciudad: {data.detalle.datosDeEnvio.city}</li>
                  <li>Referencia: {data.detalle.datosDeEnvio.reference} </li>
                </ul>
              </SC.EnvioYFacturacion>
            </SC.DatosTablaMobile>
            <SC.CtaWrap>
              <Cta hover={true} filled={true} text={"REPETIR COMPRA"} action={() => repetirCompraAction()} />
            </SC.CtaWrap>
          </SC.GridMobile>
        </MobileAndTablet>
      </SC.Wrapper>
    </Suspense>
  );
};

export default OrderDetails;
