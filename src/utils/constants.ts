export const BREAKPOINT = "768px";
export const BREAKPOINT_TOPNAV = "1020px";
export const XS = "374px";
export const LG = "992px";
export const XL = "1200px";
export const LargerScreens = "1441px";
export const XXL = "1440px";

export const customStyles = {
  darkGrey: "#767474",
  black: "#2F2F2F",
  yellow: "#FECD00",
  red: "#E30613",
  burgundy: "#7D0D4E",
  green: "#01834C",
  orange: "#F97903",
  ultraLight: "#FBFCFC",
};

export const transition = (animation = "ease-in-out", time = "0.4s", delay = "0s") => {
  return `all ${animation} ${time} ${delay}`;
};

export const statusTracking = {
  sent: "PEDIDO ENVIADO",
  ontheway: "PEDIDO EN CAMINO",
  onthewayDelivery: "PEDIDO EN CAMINO RE-ENTREGA",
  delivered: "PEDIDO ENTREGADO",
};
