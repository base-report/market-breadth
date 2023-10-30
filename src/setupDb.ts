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

const createThirtyPercentMovesTable = (db: Database) => {
  const query = db.query(`
    CREATE TABLE IF NOT EXISTS ThirtyPercentMoves (
      stock_id INTEGER NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      start_price REAL NOT NULL,
      end_price REAL NOT NULL,
      days_of_move INTEGER NOT NULL,
      percent_change REAL GENERATED ALWAYS AS (round(100 * (end_price - start_price) / start_price, 2)) STORED,
      change_per_day REAL GENERATED ALWAYS AS (round(percent_change / days_of_move, 2)) STORED,
      FOREIGN KEY (stock_id) REFERENCES Stocks (id),
      UNIQUE (stock_id, start_date)
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

console.time("setupDb");

const db = new Database(process.env.DB_PATH);

createStocksDataTable(db);
createDailyDataTable(db);
createThirtyPercentMovesTable(db);
createIndex(db);

console.timeEnd("setupDb");
