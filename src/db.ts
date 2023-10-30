import type { Timeseries } from "./types/Timeseries";
import type { DBMoveWrite, Move } from "./types/Move";

import { Database } from "bun:sqlite";

const getAllSymbols = (): string[] => {
  const db = new Database(process.env.DB_PATH);
  const query = db.query(
    "SELECT symbol FROM Stocks WHERE timeseries IS NOT NULL",
  );
  const symbols = query.all().map((row) => row.symbol);
  return symbols;
};

const getStockTimeseries = (
  symbol: string,
): { stockId: number; daily: Timeseries } | null => {
  const db = new Database(process.env.DB_PATH);
  const query = db.query(
    "SELECT id, timeseries FROM Stocks WHERE symbol = $symbol",
  );
  const row = query.get({ $symbol: symbol });
  const decoder = new TextDecoder();
  const decodedString = decoder.decode(row.timeseries);
  const daily: Timeseries = JSON.parse(decodedString);
  return { stockId: row.id, daily };
};

const addThirtyPercentMoves = (stockId: number, moves: Move[]) => {
  const db = new Database(process.env.DB_PATH);
  const insert = db.prepare(
    `INSERT INTO ThirtyPercentMoves (stock_id, start_date, end_date, start_price, end_price, days_of_move)
    VALUES ($stock_id, $start_date, $end_date, $start_price, $end_price, $days_of_move)
    ON CONFLICT (stock_id, start_date) DO UPDATE SET
    end_date = excluded.end_date,
    end_price = excluded.end_price,
    days_of_move = excluded.days_of_move`,
  );
  const insertMoves = db.transaction((_moves) => {
    for (const move of _moves) {
      insert.run({
        $stock_id: stockId,
        $start_date: move.start_date,
        $end_date: move.end_date,
        $start_price: move.start_price,
        $end_price: move.end_price,
        $days_of_move: move.days_of_move,
      });
    }
    return _moves.length;
  });

  insertMoves(moves);
};

export { getAllSymbols, getStockTimeseries, addThirtyPercentMoves };
