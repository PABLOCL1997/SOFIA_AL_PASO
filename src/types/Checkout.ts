import { capitalizeFirstLetter } from "../utils/string";

export enum Steps {
    Billing,
    Shipping,
    Timeframe,
    Payment,
    Review,
    Cart
}

export type CouponType = "%" | "$";

export type ICoupon = {
  coupon: string | null;
  type: CouponType;
  discount: number;
}

export const handleNext = (history:any, step: string) => {
  history.push({
    pathname: "/checkout",
    search: `?step=${step}`,
  })
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export const getStep = (step: string): Steps => {
  const _step = capitalizeFirstLetter(step);
  try {
    const stepEnum: Steps = Steps[_step as keyof typeof Steps];
    if (!stepEnum) throw new Error("Step not valid");
    return stepEnum;
  } catch (error) {
    return Steps.Billing;
  }
}