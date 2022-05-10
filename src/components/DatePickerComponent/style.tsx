import styled from "styled-components";
import { customStyles } from "../../utils/constants";
import ArrowPrev from "../../assets/images/arrow-prev-red.svg";
import ArrowNext from "../../assets/images/arrow-next-red.svg";

import { LG } from "../../utils/constants";

export const Wrapper = styled.div`
  .react-datepicker {
    border: 0;

    @media (max-width: ${LG}) {
      width: 100%;
    }
  }

  .react-datepicker-popper {
    background: #ffffff;
    box-shadow: 6px 6px 64px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transform: none !important;
    right: 0px !important;
    top: 50px !important;
    left: unset !important;

    @media (max-width: ${LG}) {
      z-index: 3 !important;
      position: fixed !important;
      right: 21px;
      width: 90%;
      left: 50% !important;
      top: 50% !important;
      transform: translate(-50%, -30%) !important;
    }
  }

  .react-datepicker__triangle {
    display: none;
  }

  .react-datepicker__header {
    background-color: #ffffff;
    border: 0;

    @media (max-width: ${LG}) {
      background-color: transparent !important;
    }
  }

  .react-datepicker__day--in-selecting-day {
    background-color: transparent !important;
    display: none !important;
  }

  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    font-size: 15px;
  }

  .react-datepicker__day--outside-month {
    opacity: 0.3;
  }

  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    font-weight: 400;
    text-transform: capitalize;
    padding-top: 20px;
    font-size: 16px;
  }

  .react-datepicker__month {
    padding: 10px 18px;

    @media (max-width: ${LG}) {
      padding: 10px 10px;
    }
  }

  .react-datepicker__day-names {
    margin-top: 30px;
    margin-bottom: -5px;
    text-transform: uppercase;
  }

  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    border-radius: 50%;
    height: 40px;
    width: 40px;
    line-height: 2.8;
    font-weight: 500;
    margin: 0;
  }

  .react-datepicker__week {
    /* margin: 0 0 10px; */
    margin: 0 5px 5px;
  }

  .react-datepicker__navigation--previous {
    background: url(${ArrowPrev}) no-repeat center center / contain;
    width: 20px;
    height: 17px;
    border: 0;
    left: 25px;
    top: 27px;
  }

  .react-datepicker__navigation--next {
    background: url(${ArrowNext}) no-repeat center center / contain;
    width: 16px;
    height: 17px;
    border: 0;
    right: 26px;
    top: 27px;
  }

  .react-datepicker__navigation-icon--previous,
  .react-datepicker__navigation-icon--next {
    display: none;
  }

  .react-datepicker__day--in-range {
    border: 0;
  }

  .react-datepicker__day-name {
    color: ${customStyles.red};
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    background-color: ${customStyles.red};
    color: #ffffff;
    border-radius: 0;
  }

  .react-datepicker__day--in-selecting-range {
    color: ${customStyles.black} !important;
    border-radius: 0 !important ;
    border-top: 1px solid ${customStyles.red}!important;
    border-bottom: 1px solid ${customStyles.red}!important;
    background-color: transparent !important;
  }

  .react-datepicker__day--range-end {
    border-radius: 50% !important;
    background-color: ${customStyles.red} !important;
  }

  .react-datepicker__day--range-start {
    border-radius: 50% !important;
    background-color: ${customStyles.red} !important;
  }

  .react-datepicker__day--selecting-range-start,
  .react-datepicker__day--selecting-range-end {
    border-radius: 50% !important;
    background-color: ${customStyles.red} !important;
    border-top: 1px solid ${customStyles.red}!important;
    border-bottom: 1px solid ${customStyles.red}!important;
    color: #ffffff !important;
    position: relative;

    &:before {
      content: "";
      width: 20px;
      height: 1px;
      position: absolute;
      top: -1px;
      left: 20px;
      background-color: ${customStyles.red};
    }

    &:after {
      content: "";
      width: 20px;
      height: 1px;
      position: absolute;
      bottom: -1px;
      left: 20px;
      background-color: ${customStyles.red};
    }
  }

  .react-datepicker__day--selected {
    border-radius: 50% !important;
  }

  .react-datepicker__day--selected.react-datepicker__day--range-start {
    border-radius: 0 !important;
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }

  .react-datepicker__day--today.react-datepicker__day--selected {
    border-radius: 50% !important;
  }

  .react-datepicker__day--range-end {
    border-radius: 0 !important;
    border-top-right-radius: 50% !important;
    border-bottom-right-radius: 50% !important;
  }

  .react-datepicker__day.react-datepicker__day--selected.react-datepicker__day--range-start.react-datepicker__day--in-range.react-datepicker__day--today {
    border-radius: 0 !important;
    border-top-left-radius: 50% !important;
    border-bottom-left-radius: 50% !important;
  }

  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    background-color: ${customStyles.red};
  }

  @media (max-width: ${LG}) {
    .react-datepicker-wrapper {
      display: block;
    }
  }

  @media (max-width: ${LG}) {
    .react-datepicker__month-container {
      float: none;
    }
  }
`;

export const ButtonFecha = styled.button<{ calendarOpen: boolean }>`
  background-color: ${(props) => (props.calendarOpen ? customStyles.red : "#ffffff")};
  display: flex;
  align-items: center;

  border: 1px solid ${(props) => (props.calendarOpen ? customStyles.red : "#cbcbcb")};
  padding: 5px 10px;
  border-radius: 4px;

  span {
    font-size: 14px;
    line-height: 20px;

    color: ${(props) => (props.calendarOpen ? "#ffffff" : customStyles.black)};
  }

  img {
    margin-right: 8px;
  }

  &:hover {
    box-shadow: 0px 6px 74px rgba(0, 0, 0, 0.09);
  }
`;

export const CtaWrap = styled.div`
  button {
    display: flex;
    justify-content: center;
    width: 90% !important;
    margin-bottom: 24px;

    span {
      font-family: 'MontserratBold';
      font-size: 14px;
      line-height: 20px;
      padding: 7px 0;
    }
  }
`;

export const ButtonClose = styled.div`
  cursor: pointer;
  border: 0;
  background-color: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: -15px auto 0;
  width: 100%;

  padding: 15px 15px 20px;

  img {
    margin-right: 5px;
  }

  span {
    color: ${customStyles.red};
    font-size: 14px;
    line-height: 20px;
  }
`;
