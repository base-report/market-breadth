import type { StockInfo } from "./types/StockInfo";

import { Database } from "bun:sqlite";
import { getBulkStockInfo } from "./fmp/profiles";
import { getStockTimeseries } from "./fmp/historicalPriceFull";

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

const seedStockTimeseries = async (): Promise<void> => {
  const db = new Database(process.env.DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");

  const stockSymbolsQuery = db.query("SELECT symbol FROM Stocks");
  const stockSymbols = stockSymbolsQuery.all().map((row) => row.symbol);

  console.time("seedStockTimeseries");

  // Note: we tried to do this in parallel, but the API has its own queue system
  // so things get lined up in a single file anyway. So we're just going to do
  // this sequentially.
  for (let i = 0; i < stockSymbols.length; i++) {
    const symbol = stockSymbols[i];
    console.time(`Updated ${symbol}`);
    const timeseries = await getStockTimeseries(symbol);
    // update the Stock table and set the timeseries column to the timeseries
    const updateRowQuery = db.query(
      "UPDATE Stocks SET timeseries = $timeseries WHERE symbol = $symbol",
    );

    if (timeseries) {
      updateRowQuery.run({
        $timeseries: timeseries,
        $symbol: symbol,
      });
    }
    console.timeEnd(`Updated ${symbol}`);
  }

  console.timeEnd("seedStockTimeseries");
};

export { seedStocks, seedStockTimeseries };
