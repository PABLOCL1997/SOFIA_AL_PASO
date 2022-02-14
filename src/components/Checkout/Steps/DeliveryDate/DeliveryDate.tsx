import React, { FC, Suspense, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TimeFrame } from "../../../../types/TimeFrame";
import { handleNext } from "../../../../types/Checkout";
import { Checkout, weekdays } from "../../../../utils/validations";
import arrow from "../../../../assets/images/arrow-back-checkout.svg";

import * as SC from "./style";
import dayjs from "dayjs";

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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

const nextStep = "payment"
const previousStep = "shipping"
const dateComparator: dayjs.OpUnitType = "day";
const settings = {
  dots: true,
  infinite: false,
  arrows: true,
  speed: 0,
  slidesToShow: 3,
  slidesToScroll: 1,
  initialSlide: 1,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }      
  ]
};

const DeliveryDate: FC<{
    daysAvailable: dayjs.Dayjs[];
    timeFrames: TimeFrame[];
    setSelectedTimeFrame: Function;
    selectedTimeFrame: TimeFrame | null;
    deliveryDate: dayjs.Dayjs | null;
    setDeliveryDate: Function;
  }> = ({
    timeFrames,
    setSelectedTimeFrame,
    selectedTimeFrame,
    deliveryDate,
    setDeliveryDate,
    daysAvailable
  }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [isValid, setIsValid] = useState(false)


  const handleSelectDay = (day: dayjs.Dayjs) => {
    setDeliveryDate(day);
  };

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
    }

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
          {timeFrames?.length ? (
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
          ) : (
            <>{t("checkout.delivery_datetime.no_time_frame")}</>
          )}
        </SC.TimeWrapper>
        <SC.Next.Wrapper>
          <CallToAction
            filled={true}
            text={t("general.next")}
            action={() => handleNext(history, nextStep)}
            active={isValid}
          />
        </SC.Next.Wrapper>
      </React.Fragment>
    </Suspense>
  );
};

export default DeliveryDate;
