import { Database } from "bun:sqlite";

const createStocksDataTable = (db: Database) => {
  const query = db.query(`
    CREATE TABLE IF NOT EXISTS Stocks (
      id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL UNIQUE,
      exchange TEXT,
      sector TEXT,
      industry TEXT,
      delisted INTEGER,
      timeseries BLOB
    );
  `);
  query.run();
};

const createDailyDataTable = (db: Database) => {
  const query = db.query(`
    CREATE TABLE IF NOT EXISTS DailyData (
      stock_id INTEGER NOT NULL,
      date DATE NOT NULL,
      price REAL NOT NULL,
      volume REAL NOT NULL,
      sma_20 REAL,
      sma_40 REAL,
      sma_50 REAL,
      sma_100 REAL,
      sma_200 REAL,
      FOREIGN KEY (stock_id) REFERENCES Stocks (id)
    );
  `);
  query.run();
};

const createIndex = (db: Database) => {
  const query = db.query(`
    CREATE INDEX IF NOT EXISTS daily_data_stock_id_date ON DailyData (stock_id, date);
  `);
  query.run();
};

const db = new Database("market_breadth.sqlite");

createStocksDataTable(db);
createDailyDataTable(db);
createIndex(db);
