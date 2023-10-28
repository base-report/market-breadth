import type { StockInfo } from "./types/StockInfo";

import { Database } from "bun:sqlite";
import { getBulkStockInfo } from "./fmp/profiles";

const seedStocks = async (): Promise<void> => {
  console.time("getBulkStockInfo");
  const stockInfoList = await getBulkStockInfo();
  console.timeEnd("getBulkStockInfo");

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

  const count = insertAll(stockInfoList);
  console.timeEnd("seedDB");
  console.log(`Inserted ${count} stocks`);
};

export { seedStocks };
