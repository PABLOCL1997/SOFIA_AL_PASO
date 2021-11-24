import React, { Suspense, FC, useState, useEffect, useLayoutEffect } from "react";

import { Wrapper, ButtonFecha, CtaWrap, ButtonClose } from "./style";

import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import CalendarIcon from "../../assets/images/calendar.svg";
import CalendarIconWhite from "../../assets/images/calendar-white.svg";
import CloseIcon from "../../assets/images/close-red.svg";

registerLocale("es", es);

const Cta = React.lazy(() => import(/* webpackChunkName: "Cta" */ "../Cta"));

type Props = {
  setMaskOn?: any;
  filterDates: Function;
  title?: string;
};

const DatePickerComponent: FC<Props> = ({ setMaskOn, filterDates, title = "Filtrar por fecha" }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleCalendarClose = () => setCalendarOpen(false);
  const handleCalendarOpen = () => setCalendarOpen(true);

  const handleFilter = () => {
    filterDates(startDate, endDate);

    setRebootCalendar(0);
    setCalendarOpen(false);

    setTimeout(() => {
      setRebootCalendar(1);
    }, 100);
  };

  const [rebootCalendar, setRebootCalendar] = useState(1);

  useEffect(() => {
    setMaskOn(calendarOpen);
    setStartDate(new Date());
    setEndDate(null);
  }, [calendarOpen]);

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }

  const [width, height] = useWindowSize();

  return (
    <Suspense fallback={<div></div>}>
      <Wrapper>
        {rebootCalendar === 1 && (
          <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            locale="es"
            shouldCloseOnSelect={false}
            open={calendarOpen}
            customInput={
              <ButtonFecha calendarOpen={calendarOpen}>
                {calendarOpen ? <img src={CalendarIconWhite} alt="Fecha" /> : <img src={CalendarIcon} alt="Fecha" />}

                <span>{title}</span>
              </ButtonFecha>
            }
            className="custom-picker"
            onCalendarClose={handleCalendarClose}
            onCalendarOpen={handleCalendarOpen}
          >
            <CtaWrap>
              <Cta hover={true} filled={false} text={"FILTRAR"} action={handleFilter} />
            </CtaWrap>
            <ButtonClose
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                filterDates(null, null);

                setRebootCalendar(0);
                setCalendarOpen(false);

                setTimeout(() => {
                  setRebootCalendar(1);
                }, 100);
              }}
            >
              <img src={CloseIcon} alt="x" />
              <span>Cancelar</span>
            </ButtonClose>
          </DatePicker>
        )}
      </Wrapper>
    </Suspense>
  );
};

export default DatePickerComponent;
