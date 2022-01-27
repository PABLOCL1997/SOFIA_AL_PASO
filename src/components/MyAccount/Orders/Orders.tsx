import React, { Suspense, FC, useState, useEffect, useRef } from "react";
import ECommerceIcon from "../../../assets/images/e-commerce.svg";
import TeleMarketingIcon from "../../../assets/images/telemarketing.svg";
import SucursalIcon from "../../../assets/images/sucursal.svg";

import * as SC from "./style";

import PlusIcon from "../../../assets/images/plus.svg";
import RepeatIcon from "../../../assets/images/repeat.svg";
import ArrowLeft from "../../../assets/images/arrow.svg";

import { DesktopAndTablet, MobileAndTablet } from "../../ResponsiveContainers";
import { useLazyQuery, useQuery, useApolloClient } from "react-apollo";
import { DETAILS } from "../../../graphql/user/queries";
import { ORDERS } from "../../../graphql/user/queries";
import { ORDER_STATUS } from "../../../graphql/user/queries";
import OrderStatus from "../OrderStatus";
import { toLocalDate } from "../../../utils/date";

import dayjs from "dayjs";

const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../Loader"));
const Detalle = React.lazy(() => import(/* webpackChunkName: "Detalle" */ "../OrderDetails"));
const DatePickerComponent = React.lazy(() => import(/* webpackChunkName: "DatePicker" */ "../../DatePickerComponent"));

type Props = {
  setMaskOn?: any;
  id?: any;
  repeatOrder?: any;
};
const Orders: FC<Props> = ({ setMaskOn, id, repeatOrder }) => {
  const client = useApolloClient();
  const [currentPage, setCurrentPage] = useState(0);
  const limitPerPage = 7;
  const [pages, setPages] = useState(0);
  const [detalleIndex, setDetalleIndex] = useState(0);
  const [openDetalle, setOpenDetalle] = useState(false);
  const [activeScroll, setActiveScroll] = useState(-1);
  const myRef = useRef(null);
  const [savedIndex, setSavedIndex] = useState(0);
  const cantidadDeElementos = 7;
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [hidePaginator, setHidePaginator] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [rawData, setRawData] = useState<any>([]);

  const channel = (name: string) => (name === "WEB" ? ECommerceIcon : name === "CALL CENTER" ? TeleMarketingIcon : SucursalIcon);
  const scrollToRef = (ref: any) => window.scrollTo({ top: ref.current.offsetTop, behavior: "smooth" });

  const { data: userData } = useQuery<any>(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: () => {
      setLoadingOrders(true);
      getOrders();
    },
  });

  const [getOrders] = useLazyQuery(ORDERS, {
    fetchPolicy: "cache-and-network",
    variables: {
      nit: userData?.details?.nit || 0,
      dateFrom: dayjs().subtract(30, "days").format("DD/MM/YYYY"),
      dateTo: dayjs().format("DD/MM/YYYY"),
    },
    onCompleted: async (d) => {
      const ordersData = d.orders.map((i: any) => {
        return {
          fecha: toLocalDate(i.createdAt),
          orderId: i.id,
          orden: i.incrementId,
          canal: "WEB",
          canalImage: channel("WEB"),
          precio: `${Number(i.total).toFixed(2).replace(".", ",")}`,
          estado: "Cargando",
          detalle: {
            datosDeFacturacion: {
              nombre: `${userData.details.firstname} ${userData.details.lastname}`,
              nit: userData.details.nit,
              mail: userData.details.email,
              celular: userData.details.phone,
            },
            datosDeEnvio: {
              street: i.shippingStreet,
              reference: i.shippingReference,
              city: i.shippingCity,
            },
          },
          subtotal: `${Number(i.subtotal).toFixed(2).replace(".", ",")}`,
          envio: `Bs. ${i.shippingPrice || "0,0"}`,
        };
      });

      let fData = ordersData
        .sort((a: { fecha: dayjs.Dayjs }, b: { fecha: dayjs.Dayjs }) => Number(dayjs(b.fecha, "DD/MM/YYYY").format("x")) - Number(dayjs(a.fecha, "DD/MM/YYYY").format("x")))
        .slice(currentPage, currentPage + 7);

      for (let i = 0; i < fData.length; i++) {
        const oStatus = await client.query({
          query: ORDER_STATUS,
          variables: {
            incrementId: fData[i].orden,
          },
        });
        fData[i].estado = oStatus.data.sofiawsOrderStatus;
      }

      setRawData(ordersData);
      setFilteredData(fData);
      setPages(Math.ceil(ordersData.length / limitPerPage));
      setLoadingOrders(false);
    },
  });

  useEffect(() => {
    if (activeScroll !== -1) {
      scrollToRef(myRef);
      setTimeout(() => setActiveScroll(-1), 300);
    }

    if (filteredData.length === 0 || rawData.length === 0) {
      setHidePaginator(true);
    } else {
      setHidePaginator(false);
    }
  }, [activeScroll, hidePaginator, filteredData]); // eslint-disable-line react-hooks/exhaustive-deps

  const filterDates = (firstDate: string, lastDate: string) => {
    if (userData?.details?.nit) {
      if (firstDate) {
        let leftDate = dayjs(firstDate).format("DD-MM-YYYY");
        let rightDate = leftDate;
        if (lastDate) {
          rightDate = dayjs(lastDate).format("DD-MM-YYYY");
        }
        getOrders({
          variables: {
            nit: userData?.details?.nit || 0,
            dateFrom: leftDate,
            dateTo: rightDate,
          },
        });
      } else {
        let today = dayjs();
        let leftDate = today.subtract(30, "days");
        setCurrentPage(0);
        getOrders({
          variables: {
            nit: userData?.details?.nit || 0,
            dateFrom: leftDate.format("DD-MM-YYYY"),
            dateTo: today.format("DD-MM-YYYY"),
          },
        });
      }
    }
  };

  useEffect(() => {
    if (id) {
      const index = rawData.findIndex((el: any) => el.orden === id);
      if (index !== -1) {
        setDetalleIndex(index);
        setOpenDetalle(true);
        setActiveScroll(0);
      }
    }
  }, [rawData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoadingOrders(true);

    async function getFDataPage() {
      let fData = rawData
        .sort((a: { fecha: dayjs.Dayjs }, b: { fecha: dayjs.Dayjs }) => Number(dayjs(b.fecha, "DD/MM/YYYY").format("x")) - Number(dayjs(a.fecha, "DD/MM/YYYY").format("x")))
        .slice(currentPage, currentPage + 7);

      for (let i = 0; i < fData.length; i++) {
        const oStatus = await client.query({
          query: ORDER_STATUS,
          variables: {
            incrementId: fData[i].orden,
          },
        });
        fData[i].estado = oStatus.data.sofiawsOrderStatus;
      }

      setFilteredData(fData);
      setLoadingOrders(false);
    }

    getFDataPage();
  }, [currentPage]);

  return (
    <Suspense fallback={<Loader />}>
      <SC.Anchor ref={myRef}></SC.Anchor>

      <SC.Wrapper>
        {!openDetalle ? (
          <>
            <DesktopAndTablet>
              {" "}
              <SC.Headline>
                <SC.Title>Historial de órdenes</SC.Title>
                <DatePickerComponent filterDates={filterDates} setMaskOn={() => setMaskOn(false)} />
              </SC.Headline>
              <SC.TablaWrap>
                <SC.TablaHead>
                  <h5>Fecha pedido</h5>
                  {/* <h5>Fecha entrega</h5> */}
                  <h5>Orden</h5>
                  <h5>Canal</h5>
                  <h5>Precio</h5>
                  <h5>Estado</h5>
                </SC.TablaHead>

                {loadingOrders && (
                  <SC.LoaderWrapper>
                    <img src="/images/loader.svg" alt="loader" />
                    <Loader />
                  </SC.LoaderWrapper>
                )}
                <SC.Tabla>
                  {!loadingOrders && !rawData.length && (
                    <SC.LoaderWrapper>
                      <div>No hay registros para ese rango de fechas</div>
                    </SC.LoaderWrapper>
                  )}
                  {!loadingOrders && filteredData.length > 0 ? (
                    <SC.TablaLista>
                      {filteredData.map((item: any, i: number) => {
                        return (
                          <SC.TablaItem key={`TableItem-${i}`}>
                            <SC.Fecha>{item.fecha}</SC.Fecha>
                            {/* <SC.Fecha>{item.fechaEntrega}</SC.Fecha> */}
                            <SC.Order>{item.orden}</SC.Order>
                            <SC.Canal>
                              <img src={item.canalImage} alt="" />
                              <span>{item.canal === "CALL CENTER" ? "Telemarketing" : item.canal === "WEB" ? "Ecommerce" : "Sucursal"}</span>
                            </SC.Canal>
                            <SC.Price>Bs. {item.precio}</SC.Price>
                            <OrderStatus item={item} nit={userData?.details?.nit || 0} />
                            <SC.VerDetalleBtn
                              onClick={() => {
                                setDetalleIndex(i);
                                setOpenDetalle(true);
                                setActiveScroll(0);
                              }}
                            >
                              <img src={PlusIcon} alt="+" />
                              <span>Ver detalle</span>
                            </SC.VerDetalleBtn>
                            <SC.RepetirCompraBtn
                              onClick={() => {
                                setDetalleIndex(i);
                                setOpenDetalle(true);
                                setActiveScroll(0);
                              }}
                            >
                              <img src={RepeatIcon} alt="" />
                              <span>Repetir compra</span>
                            </SC.RepetirCompraBtn>
                          </SC.TablaItem>
                        );
                      })}
                    </SC.TablaLista>
                  ) : (
                    <SC.TablaLista></SC.TablaLista>
                  )}
                </SC.Tabla>
              </SC.TablaWrap>
              {!loadingOrders && pages > 1 && (
                <SC.Paginator>
                  {!loadingOrders && !hidePaginator ? (
                    <ul>
                      {currentPage <= 1 ? (
                        <div>
                          <SC.ArrowPrev disable={currentPage <= 1} src={ArrowLeft} alt="prev" />
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setSavedIndex(savedIndex - 1);
                            setCurrentPage(currentPage - cantidadDeElementos);
                          }}
                        >
                          <SC.ArrowPrev disable={currentPage <= 1} src={ArrowLeft} alt="prev" />
                        </div>
                      )}

                      {[...Array(pages)].map((e, i) => {
                        return (
                          <SC.Li
                            onClick={() => {
                              setCurrentPage(i * cantidadDeElementos);
                              setSavedIndex(i + 1);

                              if (pages === i) {
                                setActiveScroll(1);
                              }
                            }}
                            key={i + 1}
                            index={i * cantidadDeElementos}
                            current={currentPage}
                          >
                            {i + 1}
                          </SC.Li>
                        );
                      })}

                      {savedIndex === pages ? (
                        <div>
                          <SC.ArrowNext disable={savedIndex === pages} src={ArrowLeft} alt="next" />
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setSavedIndex(savedIndex + 1);
                            setCurrentPage(currentPage + cantidadDeElementos);

                            if (pages === savedIndex) {
                              setActiveScroll(1);
                            }
                          }}
                        >
                          <SC.ArrowNext disable={savedIndex === pages} src={ArrowLeft} alt="next" />
                        </div>
                      )}
                    </ul>
                  ) : (
                    <div></div>
                  )}
                </SC.Paginator>
              )}
            </DesktopAndTablet>

            {true && (
              <MobileAndTablet>
                <SC.Headline>
                  <DatePickerComponent filterDates={filterDates} setMaskOn={setMaskOn} />
                </SC.Headline>
                <SC.TablaWrap>
                  <SC.Tabla>
                    {!loadingOrders && filteredData.length > 0 ? (
                      <SC.TablaLista>
                        {filteredData.map((item: any, i: any) => {
                          return (
                            <SC.TablaItem
                              key={i}
                              onClick={() => {
                                setDetalleIndex(i);
                                setOpenDetalle(true);
                                setActiveScroll(0);
                              }}
                            >
                              <SC.TablaItemMobile>
                                <OrderStatus item={item} nit={userData?.details?.nit || 0} />

                                <SC.OrderMobile>
                                  <SC.Order>Orden: {item.orden} •</SC.Order>

                                  <SC.Price>Bs. {item.precio}</SC.Price>
                                </SC.OrderMobile>

                                <SC.Fecha>Fecha pedido: {item.fecha}</SC.Fecha>
                                <SC.Fecha>Fecha entrega: {item.fechaEntrega}</SC.Fecha>
                              </SC.TablaItemMobile>
                              <img src={ArrowLeft} alt=">" />
                            </SC.TablaItem>
                          );
                        })}
                      </SC.TablaLista>
                    ) : (
                      <SC.TablaLista></SC.TablaLista>
                    )}
                  </SC.Tabla>
                </SC.TablaWrap>
                {!loadingOrders && pages > 1 && (
                  <SC.Paginator>
                    {!loadingOrders && !hidePaginator ? (
                      <ul>
                        {currentPage <= 1 ? (
                          <div>
                            <SC.ArrowPrev disable={currentPage <= 1} src={ArrowLeft} alt="prev" />
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setSavedIndex(savedIndex - 1);
                              setCurrentPage(currentPage - cantidadDeElementos);
                            }}
                          >
                            <SC.ArrowPrev disable={currentPage <= 1} src={ArrowLeft} alt="prev" />
                          </div>
                        )}

                        <>
                          {[...Array(pages)].map((e, i) => {
                            return (
                              <SC.Li
                                onClick={() => {
                                  setCurrentPage(i * cantidadDeElementos);
                                  setSavedIndex(i + 1);

                                  if (pages === i) {
                                    setActiveScroll(1);
                                  }
                                }}
                                key={i + 1}
                                index={i * cantidadDeElementos}
                                current={currentPage}
                              >
                                {i + 1}
                              </SC.Li>
                            );
                          })}
                        </>

                        {savedIndex === pages ? (
                          <div>
                            <SC.ArrowNext disable={savedIndex === pages} src={ArrowLeft} alt="next" />
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setSavedIndex(savedIndex + 1);
                              setCurrentPage(currentPage + cantidadDeElementos);

                              if (pages === savedIndex) {
                                setActiveScroll(1);
                              }
                            }}
                          >
                            <SC.ArrowNext disable={savedIndex === pages} src={ArrowLeft} alt="next" />
                          </div>
                        )}
                      </ul>
                    ) : (
                      <div></div>
                    )}
                  </SC.Paginator>
                )}
              </MobileAndTablet>
            )}
          </>
        ) : (
          <Detalle data={rawData[detalleIndex]} setOpenDetalle={setOpenDetalle} userData={userData} repeatOrder={repeatOrder} />
        )}
      </SC.Wrapper>
    </Suspense>
  );
};

export default Orders;
