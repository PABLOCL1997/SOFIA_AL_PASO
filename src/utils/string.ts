import { CategoryType } from "../graphql/categories/type";

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
          word => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`
        )
        .join(" ")
    : "";
};

export type KeyValue = {
  key: string;
  value: string;
};

export const cities: Array<KeyValue> = [
  { key: "CO", value: "Cochabamba" },
  { key: "LP", value: "La Paz" },
  { key: "SC", value: "Santa Cruz" },
  { key: "EA", value: "El Alto" }
];

export const titleCase = (str: string): string => {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' ');
}

export const capitalizeFirstLetter = (string: string) => {
  var splitStr = string.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
};

export const search = (
  nameKey: string,
  nameValue: string,
  myArray: Array<any>
) => {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i][nameKey] === nameValue) {
      return myArray[i];
    }
  }
};

export const searchMultiple = (
  nameKey: string,
  nameValue: string,
  myArray: Array<any>
) => {
  const res = [];
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i][nameKey] === nameValue) {
      res.push(myArray[i]);
    }
  }
  return res;
};

export const escapeSingleQuote = (text: string): string => {
  return text ? text.replace(/'/g, "") : "";
};

export const toCatLink = (categories: CategoryType[], str: string | null, level: number) => {
  let lvl2Cat: CategoryType | undefined = undefined;
  let lvl2CatStr = "";
  let lvl3Cat: CategoryType | undefined = undefined;
  let lvl3CatStr = "";
  if (level >= 4) {
    lvl3Cat = categories.find((c: CategoryType) => c.level === 3);
    if (lvl3Cat) lvl3CatStr = `${toLink(lvl3Cat.name)}/`;
  }
  if (level >= 3) {
    lvl2Cat = categories.find((c: CategoryType) => c.level === 2);
    if (lvl2Cat) lvl2CatStr = `${toLink(lvl2Cat.name)}/`;
  }
  return lvl2CatStr + lvl3CatStr + toLink(str);
};

export const findCity = (key: string): string => cities.find(({ key: _key })=> _key === key) ? cities.find(({ key: _key })=> _key === key)?.value || "Santa Cruz" : "Santa Cruz" 

export const findKeyByCity = (city: string): string | null => {
  return cities.find(({ value: _city }) => _city === city)?.key || null;
};