import type { StockInfo } from "./types/StockInfo";

import { Database } from "bun:sqlite";
import { parseCSVLine } from "./utils/csv";

const BASE_URL = "https://financialmodelingprep.com/api/";
const VALID_EXCHANGES = ["NASDAQ", "NYSE", "AMEX"];

const parseAndExtract = (data: string): StockInfo[] => {
  const lines = data.trim().split("\n");
  const headers = parseCSVLine(lines[0], 0);

  const result: StockInfo[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], headers.length);

    let record: any = {};

    for (let j = 0; j < headers.length; j++) {
      let value = values[j].replace(/"/g, "").trim();
      record[headers[j]] = value || undefined;
    }

    const isStock = record.isEtf === "false" && record.isFund === "false";
    const isInValidExchange = VALID_EXCHANGES.includes(
      record.exchangeShortName,
    );

    if (isStock && isInValidExchange) {
      result.push({
        symbol: record.Symbol,
        exchange: record.exchangeShortName,
        sector: record.sector,
        industry: record.industry,
        delisted: record.isActivelyTrading.toLowerCase() !== "true",
      });
    }
  }

  return result;
};

const fetchAllProfiles = async (): Promise<string> => {
  const url = `${BASE_URL}/v4/profile/all?apikey=${process.env.FMP_API_KEY}`;
  const response = await fetch(url);
  const data = await response.text();
  return data;
};

const seedDBStocks = async (): Promise<void> => {
  console.time("fetchAllProfiles");
  const data = await fetchAllProfiles();
  console.timeEnd("fetchAllProfiles");

  console.time("parseAndExtract");
  const stocks = parseAndExtract(data);
  console.timeEnd("parseAndExtract");

  console.time("seedDB");
  const db = new Database(process.env.DB_PATH);
  const insertRow = db.prepare(
    "INSERT INTO Stocks (symbol, exchange, sector, industry, delisted) VALUES ($symbol, $exchange, $sector, $industry, $delisted)",
  );
  const insertAll = db.transaction((stocks: StockInfo[]) => {
    for (const stock of stocks) {
      insertRow.run({
        $symbol: stock.symbol,
        $exchange: stock.exchange,
        $sector: stock.sector,
        $industry: stock.industry,
        $delisted: stock.delisted,
      });
    }
    return stocks.length;
  });

  const count = insertAll(stocks);
  console.timeEnd("seedDB");

  console.log(`Inserted ${count} stocks`);
};

export { parseAndExtract, seedDBStocks };
