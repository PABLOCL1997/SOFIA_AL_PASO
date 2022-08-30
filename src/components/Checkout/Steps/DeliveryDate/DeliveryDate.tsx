import React, { FC, Suspense, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HorarioCorte, TimeFrame } from "../../../../types/TimeFrame";
import { handleNext } from "../../../../types/Checkout";
import { Checkout, weekdays } from "../../../../utils/validations";
import arrow from "../../../../assets/images/arrow-back-checkout.svg";

import * as SC from "./style";
import dayjs from "dayjs";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "react-apollo";
import { GET_TIME_FRAMES } from "../../../../graphql/metadata/queries";
import useCityPriceList from "../../../../hooks/useCityPriceList";
import { OrderData } from "../../../../types/Order";
import { useUrlQuery } from "../../../../hooks/useUrlQuery";

const isoWeek = require("dayjs/plugin/isoWeek");
const utc = require("dayjs/plugin/utc"); // dependent on utc plugin
const timezone = require("dayjs/plugin/timezone");
const weekday = require("dayjs/plugin/weekday");
const es = require("dayjs/locale/es");

dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(es);

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../../Loader"));
const Slider = React.lazy(() => import(/* webpackChunkName: "Slider" */ "react-slick"));
const CallToAction = React.lazy(() => import(/* webpackChunkName: "CallToAction" */ "../../../Cta"));

const previousStep = "shipping";
const dateComparator: dayjs.OpUnitType = "day";
const settings = {
  dots: true,
  infinite: false,
  arrows: true,
  speed: 0,
  slidesToShow: 3,
  slidesToScroll: 1,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};

const DeliveryDate: FC<{
  updateOrder: (field: string, value: string) => void;
  setOrderData: (order: OrderData) => void;
  orderData: OrderData;
}> = ({ updateOrder, setOrderData, orderData }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const query = useUrlQuery();
  const nextStep = query.get("next") || "payment";
  const { city } = useCityPriceList();
  const [isValid, setIsValid] = useState(false);

  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<dayjs.Dayjs | null>(null);
  const [timeFrames, setTimeFrames] = useState<Array<TimeFrame>>([]);
  const [filteredTimeFrames, setFilteredTimeFrames] = useState<Array<TimeFrame>>([]);

  const daysAvailable = useMemo(() => {
    let counter = 0;
    const daysRequired = 5;
    const SundayKey = 7;

    // generate daysRequired days
    const daysAvailable = [];
    while (counter < daysRequired) {
      const newDay = dayjs().add(counter, "days");

      if (!(newDay.isoWeekday() === SundayKey) && daysAvailable.length < daysRequired - 1) {
        const nextDay = dayjs().add(counter, "days");
        daysAvailable.push(nextDay);
      }
      counter++;
    }
    return daysAvailable;
  }, []);

  const handleSelectDay = (day: dayjs.Dayjs) => {
    setDeliveryDate(day);
  };

  useQuery(GET_TIME_FRAMES, {
    fetchPolicy: "network-only",
    variables: {
      city,
    },
    onCompleted: (d) => {
      setTimeFrames(d.timeFrames);
    },
  });

  useEffect(() => {
    if (selectedTimeFrame?.turno?.inicio && selectedTimeFrame?.turno?.fin) {
      setOrderData({
        ...orderData,
        vh_inicio: selectedTimeFrame.turno.inicio,
        vh_fin: selectedTimeFrame.turno.fin,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeFrame]);

  useEffect(() => {
    if (deliveryDate) {
      updateOrder("delivery_date", dayjs(deliveryDate).toISOString());
      // calculate time frames for deliveryDate
      const dateComparator: dayjs.OpUnitType = "days";
      const hourComparator: dayjs.OpUnitType = "hours";

      const hoursUnitType: dayjs.UnitType = "hours";
      const minutesUnitType: dayjs.UnitType = "minutes";
      const today = dayjs();
      const tomorrow = dayjs().add(1, "day");

      if (dayjs(deliveryDate).isSame(today, dateComparator)) {
        // TODO: reducir codigo duplicado
        setFilteredTimeFrames(
          timeFrames.filter((timeFrame: TimeFrame) => {
            const hasSameDay = timeFrame.horario_corte.some(
              (horario: HorarioCorte) =>
                horario.mismo_dia &&
                dayjs().isBefore(
                  dayjs()
                    .set(hoursUnitType, parseInt(horario.horario.split(":")[0]))
                    .set(minutesUnitType, parseInt(horario.horario.split(":")[1])),
                  hourComparator
                )
            );
            return hasSameDay ? timeFrame : null;
          })
        );
      }

      if (dayjs(deliveryDate).isSame(tomorrow, dateComparator)) {
        // TODO: reducir codigo duplicado
        setFilteredTimeFrames(
          timeFrames.filter((timeFrame: TimeFrame) => {
            const hasBeforeDay = timeFrame.horario_corte.some(
              (horario: HorarioCorte) =>
                horario.dia_anterior &&
                dayjs().isBefore(
                  dayjs()
                    .set(hoursUnitType, parseInt(horario.horario.split(":")[0]))
                    .set(minutesUnitType, parseInt(horario.horario.split(":")[1])),
                  hourComparator
                )
            );
            return hasBeforeDay ? timeFrame : null;
          })
        );
      }

      // if it is after tomorrow
      if (dayjs(deliveryDate).isAfter(tomorrow, dateComparator)) {
        setFilteredTimeFrames(timeFrames);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryDate]);

  useEffect(() => {
    const checkTimeframe = async () => {
      try {
        await Checkout.Validations.Timeframe({
          deliveryDate,
          timeFrame: selectedTimeFrame?.turno?.inicio,
        });
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
      }
    };

    checkTimeframe();
  }, [deliveryDate, selectedTimeFrame]);

  return (
    <Suspense fallback={<Loader />}>
      <React.Fragment>
        <SC.Back.Wrapper onClick={() => handleNext(history, previousStep)}>
          <img src={arrow} alt={t("controls.back_arrow")} width={16} height={11} />
        </SC.Back.Wrapper>
        <SC.Title>
          <img onClick={() => handleNext(history, previousStep)} src={arrow} alt={t("controls.back_arrow")} width={16} height={11} />
          <h2>{t("checkout.delivery_datetime.title")}</h2>
        </SC.Title>
        <SC.DateWrapper>
          <Slider {...settings}>
            {daysAvailable?.length > 0
              ? daysAvailable.map((day: dayjs.Dayjs, index: number) => (
                  <SC.DateSquare selected={dayjs(day).isSame(deliveryDate, dateComparator)} onClick={() => handleSelectDay(day)}>
                    <SC.Date>
                      {index === 0 ? `Hoy ` : null}
                      {`${day.get("date") < 10 ? `0${day.get("date")}` : day.get("date")}/${day.get("month") + 1 < 10 ? `0${day.get("month") + 1}` : day.get("month") + 1}`}
                    </SC.Date>
                    <SC.Day>{weekdays[day.get("d")]}</SC.Day>
                  </SC.DateSquare>
                ))
              : null}
          </Slider>
        </SC.DateWrapper>
        <SC.TimeWrapper>
          {filteredTimeFrames?.map((timeFrame: TimeFrame, index: number) => (
            <SC.TimeRadio key={`timeFrame#${index}`} selected={JSON.stringify(timeFrame) === JSON.stringify(selectedTimeFrame)}>
              <SC.Time onClick={() => setSelectedTimeFrame(timeFrame)}>
                <SC.Radio
                  type="radio"
                  name="horario"
                  id=""
                  value={JSON.stringify(timeFrame)}
                  onChange={() => setSelectedTimeFrame(timeFrame)}
                  checked={JSON.stringify(timeFrame) === JSON.stringify(selectedTimeFrame)}
                />
                {`${timeFrame.turno.inicio} - ${timeFrame.turno.fin} hs`}
              </SC.Time>
            </SC.TimeRadio>
          ))}
          {!filteredTimeFrames.length && <>{t("checkout.delivery_datetime.no_time_frame")}</>}
        </SC.TimeWrapper>
        <SC.Next.Wrapper>
          <CallToAction filled={true} text={t("general.next")} action={() => handleNext(history, nextStep)} active={isValid} />
        </SC.Next.Wrapper>
      </React.Fragment>
    </Suspense>
  );
};

export default DeliveryDate;
