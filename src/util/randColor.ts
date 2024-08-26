import { randInt } from "./randInt";

const colorBits = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
];

export const randColor = () => {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += colorBits[randInt(0, colorBits.length - 1)];
  }
  return color;
};
