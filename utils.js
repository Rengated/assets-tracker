import * as fs from "fs";

export const getSymbols = async () => {
  const symbols = fs.readFileSync("assets.json", "utf-8", (err, data) => {});
  return JSON.parse(symbols).coins;
};
