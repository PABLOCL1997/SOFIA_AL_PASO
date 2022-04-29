export const rangeArray = (start: number, end: number) => {
  const list:number[] = [];

  for (let i = start; i < end; i++) {
    list.push(i);
  };

  return list;
};
