import type { Timeseries } from "./types/Timeseries";

import { Database } from "bun:sqlite";

const getStockTimeseries = (symbol: string): Timeseries | null => {
  const db = new Database(process.env.DB_PATH);
  const query = db.query(
    "SELECT timeseries FROM Stocks WHERE symbol = $symbol",
  );
  const row = query.get({ $symbol: symbol });
  const decoder = new TextDecoder();
  const decodedString = decoder.decode(row.timeseries);
  const timeseries: Timeseries = JSON.parse(decodedString);
  return timeseries;
};

export { getStockTimeseries };
