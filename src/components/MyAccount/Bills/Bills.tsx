import React, { Suspense, FC, useState, useEffect, useRef } from "react";
import styled from "styled-components";

import * as SC from "./style";

import PlusIcon from "../../../assets/images/plus.svg";
import ArrowLeft from "../../../assets/images/arrow.svg";
import OrderStatus from "../OrderStatus";
import { DesktopAndTablet, MobileAndTablet } from "../../ResponsiveContainers";
import { useLazyQuery, useQuery } from "react-apollo";
import { DETAILS } from "../../../graphql/user/queries";
import { GET_BILLS_HISTORY } from "../../../graphql/bill/queries";
import { Link } from "react-router-dom";

import dayjs from "dayjs";
const isBetween = require("dayjs/plugin/isBetween");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../Loader"));

const BillDetails = React.lazy(() => import(/* webpackChunkName: "BillDetails" */ "../BillDetails"));

const DatePickerComponent = React.lazy(() => import(/* webpackChunkName: "DatePicker" */ "../../DatePickerComponent"));

const WordFinder = React.lazy(() => import(/* webpackChunkName: "WordFinder" */ "../WordFinder"));

const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../../Cta"));

const FlexWrapperAuto = styled.div`
  margin-left: auto;
  margin-right: 13px;
`;

const FlexWrapper = styled.div`
  margin-right: 13px;
`;

type Props = {
  setMaskOn?: any;
  page?: string;
};

const Facturas: FC<Props> = ({ setMaskOn, page }) => {
  const today = dayjs();
  const limitPerPage = 7;
  let pages: any = 0;

  const [currentPage, setCurrentPage] = useState(0);
  const [billNumber, setBillNumber] = useState("");
  const [openDetalle, setOpenDetalle] = useState(false);
  const [activeScroll, setActiveScroll] = useState(-1);
  const myRef = useRef(null);

  const [searchWord, setSearchWord] = useState<string>("");

  const [savedIndex, setSavedIndex] = useState(0);
  const cantidadDeElementos = 7;

  const [hidePaginator, setHidePaginator] = useState(false);
  const [filteredData, setFilteredData] = useState<any>([]);
  const [rawData, setRawData] = useState<any>([]);

  const { data: userData } = useQuery(DETAILS, {
    fetchPolicy: "network-only",
    onCompleted: (d) => {
      let firstDate = today.subtract(2, "year");
      console.log(userData);
      getBillsHistory({
        variables: {
          nit: userData?.details?.nit || 0,
          startDate: dayjs(firstDate).format("DD-MM-YYYY"),
          endDate: dayjs().format("DD-MM-YYYY"),
          limit: 100,
          offset: 0,
        },
      });
    },
  });
  const [getBillsHistory, { loading: loadingBills }] = useLazyQuery(GET_BILLS_HISTORY, {
    fetchPolicy: "no-cache",
    onCompleted: (d) => {
      let { rows } = d.getBillsHistory;

      pages = Math.ceil(d.getBillsHistory.count / limitPerPage);

      rows = rows.map((i: any) => {
        return {
          transaccion: dayjs(i.fecha_trans, "D/M/YYYY HH:mm:ss").format("DD/MM/YYYY"),
          numero_factura: i.numero_factura,
          saldo_debido: i.saldo_deb,
          vencimiento: dayjs(i.fecha_venci, "D/M/YYYY HH:mm:ss").format("DD/MM/YYYY"),
          entidad_legal: i.entidad_legal,
          clase: i.clase,
          estado: i.estado,
          cod_cliente: i.cod_cliente,
          monto: i.monto,
          saldo_total: i.monto,
          orden: i.orden,
        };
      });

      setRawData(rows);
      setFilteredData(rows);
    },
  });

  const scrollToRef = (ref: any) => window.scrollTo({ top: ref.current.offsetTop, behavior: "smooth" });

  if (rawData.length > 0 && filteredData.length === 0) {
    pages = Math.ceil(rawData.length / limitPerPage);
  } else {
    pages = Math.ceil(filteredData.length / limitPerPage);
  }

  useEffect(() => {
    if (page !== "home") {
      if (activeScroll !== -1) {
        scrollToRef(myRef);
        setTimeout(() => setActiveScroll(-1), 300);
      }
    }

    if (filteredData.length === 0 || rawData.length === 0) {
      setHidePaginator(true);
    } else {
      setHidePaginator(false);
    }
  }, [activeScroll, hidePaginator, filteredData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let data = JSON.parse(JSON.stringify(rawData));

    if (searchWord) {
      data = data.filter(
        (el: any) =>
          el.numero_factura.toLowerCase().includes(searchWord) || el.saldo_debido.includes(searchWord) || el.monto.includes(searchWord) || el.entidad_legal.toLowerCase().includes(searchWord)
      );
    }

    pages = Math.ceil(data.length / limitPerPage); // eslint-disable-line react-hooks/exhaustive-deps

    setCurrentPage(0);
    setFilteredData(data);
  }, [searchWord]);

  const filterDates = (firstDate: string, lastDate: string) => {
    if (userData?.details?.nit) {
      if (firstDate) {
        let leftDate = dayjs(firstDate).format("DD-MM-YYYY");
        let rightDate = leftDate;
        if (lastDate) rightDate = dayjs(lastDate).format("DD-MM-YYYY");

        getBillsHistory({
          variables: {
            nit: userData?.details?.nit || 0,
            startDate: leftDate,
            endDate: rightDate,
            limit: 100,
            offset: 0,
          },
        });
      } else {
        setCurrentPage(0);
        let leftDate = today.subtract(2, "year");
        getBillsHistory({
          variables: {
            nit: userData?.details?.nit || 0,
            startDate: leftDate.format("DD-MM-YYYY"),
            endDate: today.format("DD-MM-YYYY"),
            limit: 100,
            offset: 0,
          },
        });
      }
    }
  };

  const filterDatesDue = (firstDateDue: string, lastDateDue: string) => {
    let data = JSON.parse(JSON.stringify(rawData));

    if (searchWord) {
      data = data.filter(
        (el: any) =>
          el.numero_factura.toLowerCase().includes(searchWord) || el.saldo_debido.includes(searchWord) || el.monto.includes(searchWord) || el.entidad_legal.toLowerCase().includes(searchWord)
      );
    }

    if (firstDateDue) {
      let leftDate = dayjs(firstDateDue);
      if (lastDateDue) {
        let rightDate = dayjs(lastDateDue);
        data = data.filter((el: any) => {
          let d = dayjs(el.vencimiento, "DD/MM/YYYY");
          return (d as dayjs.Dayjs & { isBetween: any }).isBetween(leftDate, rightDate, "day", "[]");
        });
      } else {
        data = data.filter((el: any) => {
          let d = dayjs(el.vencimiento, "DD/MM/YYYY");
          return d.isSame(leftDate, "day");
        });
      }
    }

    pages = Math.ceil(data.length / limitPerPage);

    setCurrentPage(0);
    setFilteredData(data);
  };

  return (
    <Suspense fallback={<Loader />}>
      <SC.Anchor ref={myRef}></SC.Anchor>

      <SC.Wrapper>
        {!openDetalle ? (
          <>
            <DesktopAndTablet>
              {" "}
              <SC.Headline>
                <SC.Title>Listado de Facturas</SC.Title>
                <FlexWrapperAuto>
                  <WordFinder setWord={setSearchWord} />
                </FlexWrapperAuto>
                <FlexWrapper>
                  <DatePickerComponent filterDates={filterDates} setMaskOn={() => setMaskOn(false)} />
                </FlexWrapper>
                <DatePickerComponent filterDates={filterDatesDue} setMaskOn={() => setMaskOn(false)} title="Filtrar por vencimiento" />
              </SC.Headline>
              <SC.TablaWrap>
                <SC.TablaHead>
                  <h5>Fecha Emisión</h5>
                  <h5>Nº de factura</h5>
                  <h5>Monto</h5>
                  <h5>Fecha Vencimiento</h5>
                  <h5>Saldo debido</h5>
                  <h5>Entidad legal</h5>
                </SC.TablaHead>

                <SC.Tabla>
                  {loadingBills && (
                    <SC.LoaderWrapper>
                      <img src="/images/loader.svg" alt="loader" />
                      <Loader />
                    </SC.LoaderWrapper>
                  )}
                  {!loadingBills && !rawData.length && (
                    <SC.LoaderWrapper>
                      <div>No hay registros para ese rango de fechas</div>
                    </SC.LoaderWrapper>
                  )}
                  {!loadingBills && filteredData.length > 0 ? (
                    <SC.TablaLista>
                      {!loadingBills &&
                        filteredData
                          .sort(
                            (a: { transaccion: dayjs.Dayjs }, b: { transaccion: dayjs.Dayjs }) =>
                              Number(dayjs(b.transaccion, "DD/MM/YYYY").format("x")) - Number(dayjs(a.transaccion, "DD/MM/YYYY").format("x"))
                          )
                          .slice(currentPage, currentPage + 7)
                          .map((item: any, i: any) => {
                            return (
                              <SC.TablaItem key={i} filtered={true} index={`0.${i + 1}s`}>
                                <SC.Fecha>{item.transaccion}</SC.Fecha>
                                <SC.Order>{item.numero_factura}</SC.Order>
                                <SC.Order>Bs. {item.monto}</SC.Order>
                                <SC.Price>{item.vencimiento}</SC.Price>
                                <SC.Price>Bs. {item.saldo_debido}</SC.Price>
                                <SC.Order>{item.entidad_legal}</SC.Order>
                                <SC.VerDetalleBtn
                                  onClick={() => {
                                    setBillNumber(item.numero_factura);
                                    setOpenDetalle(true);
                                    setActiveScroll(0);
                                  }}
                                >
                                  <img src={PlusIcon} alt="+" />
                                  <span>Ver detalle</span>
                                </SC.VerDetalleBtn>
                              </SC.TablaItem>
                            );
                          })}
                    </SC.TablaLista>
                  ) : (
                    <SC.TablaLista></SC.TablaLista>
                  )}
                </SC.Tabla>
              </SC.TablaWrap>
              {!loadingBills && pages + 1 > 1 && (
                <SC.Paginator>
                  {!loadingBills && !hidePaginator ? (
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
            </DesktopAndTablet>

            {true && (
              <MobileAndTablet>
                <SC.Headline>
                  <WordFinder setWord={setSearchWord} />
                  <DatePickerComponent filterDates={filterDates} setMaskOn={setMaskOn} />
                  <DatePickerComponent filterDates={filterDatesDue} setMaskOn={setMaskOn} title="Filtrar por vencimiento" />
                </SC.Headline>
                <SC.TablaWrap>
                  <SC.Tabla>
                    {!loadingBills && filteredData.length > 0 ? (
                      <SC.TablaLista>
                        {filteredData
                          .sort(
                            (a: { transaccion: dayjs.Dayjs }, b: { transaccion: dayjs.Dayjs }) =>
                              Number(dayjs(b.transaccion, "DD/MM/YYYY").format("x")) - Number(dayjs(a.transaccion, "DD/MM/YYYY").format("x"))
                          )
                          .slice(currentPage, currentPage + 7)
                          .map((item: any, i: any) => {
                            return (
                              <SC.TablaItem
                                key={i}
                                onClick={() => {
                                  setBillNumber(item.numero_factura);
                                  setOpenDetalle(true);
                                  setActiveScroll(0);
                                }}
                              >
                                <SC.TablaItemMobile>
                                  <OrderStatus item={item} greenCondition={"Cerrado"} isBill={true} />
                                  <SC.InvoiceNumberMobile>
                                    Nº {item.numero_factura} <SC.Price>• Bs. {item.monto}</SC.Price>
                                  </SC.InvoiceNumberMobile>
                                  <SC.Fecha>{item.transaccion}</SC.Fecha>
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
                {!loadingBills && pages + 1 > 1 && (
                  <SC.Paginator>
                    {!loadingBills && !hidePaginator ? (
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

            {page === "home" && pages !== 0 && (
              <SC.CtaWrapper>
                <Link to="/mi-cuenta">
                  <Cta action={() => {}} text={"Ver todos"} filled={true} />
                </Link>
              </SC.CtaWrapper>
            )}
          </>
        ) : (
          <BillDetails baseBillData={rawData.find((e: any) => e.numero_factura === billNumber)} setOpenDetalle={setOpenDetalle} />
        )}
      </SC.Wrapper>
    </Suspense>
  );
};

export default Facturas;
