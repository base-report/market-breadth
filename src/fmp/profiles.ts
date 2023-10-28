import type { StockInfo } from "../types/StockInfo";

import { parseCSVLine } from "../utils/csv";

const VALID_EXCHANGES = ["NASDAQ", "NYSE", "AMEX"];

const fetchAllProfiles = async (): Promise<string> => {
  const url = `${process.env.FMP_BASE_URL}/v4/profile/all?apikey=${process.env.FMP_API_KEY}`;
  const response = await fetch(url);
  const data = await response.text();
  return data;
};

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

const getBulkStockInfo = async (): Promise<StockInfo[]> => {
  const data = await fetchAllProfiles();
  const profiles = parseAndExtract(data);
  return profiles;
};

export { parseAndExtract, getBulkStockInfo };
