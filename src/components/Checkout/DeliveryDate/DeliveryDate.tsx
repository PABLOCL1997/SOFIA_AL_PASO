import React, { FC, Suspense, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TimeFrame } from "../../../types/TimeFrame";
import * as SC from "./style";
import dayjs from "dayjs";

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

const Loader = React.lazy(() => import(/* webpackChunkName: "Loader" */ "../../Loader"));

const DeliveryDate: FC<{
  daysAvailable: dayjs.Dayjs[];
  timeFrames: TimeFrame[];
  setSelectedTimeFrame: Function;
  selectedTimeFrame: TimeFrame | null;
  deliveryDate: dayjs.Dayjs | null;
  setDeliveryDate: Function;
}> = ({ timeFrames, setSelectedTimeFrame, selectedTimeFrame, deliveryDate, setDeliveryDate, daysAvailable }) => {
  const { t } = useTranslation();
  const dateComparator: dayjs.OpUnitType = "day";

  const weekdays = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const handleSelectDay = (day: dayjs.Dayjs) => {
    setDeliveryDate(day);
  };

  return (
    <Suspense fallback={<Loader />}>
      <React.Fragment>
        <SC.Title>{t("checkout.delivery_datetime.title")}</SC.Title>
        <SC.DateWrapper>
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
        </SC.DateWrapper>
        <SC.TimeWrapper>
          {timeFrames?.length ? 
            timeFrames.map((timeFrame: TimeFrame, index: number) => (
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
            ))
            : <>{t("checkout.delivery_datetime.no_time_frame")}</>}
        </SC.TimeWrapper>
      </React.Fragment>
    </Suspense>
  );
};

export default DeliveryDate;
