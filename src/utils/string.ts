export const toLink = (str: string | null) => {
  return str ? str.toLowerCase().replace(/ /g, "-") : "";
};

export const isValidEmail = (mail: string) => {
  // eslint-disable-next-line
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
};

export const fromLink = (str: string | null) => {
  return str
    ? str
        .split(/-/g)
        .map(
          (word) => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`
        )
        .join(" ")
    : "";
};

export type KeyValue = {
  key: string;
  value: string;
};

export const cities: Array<KeyValue> = [
  { key: "CB", value: "Cochabamba" },
  { key: "LP", value: "La Paz" },
  { key: "SC", value: "Santa Cruz" },
  { key: "EA", value: "El Alto" }
];
