import { seedStocks, seedStockTimeseries } from "./seed";
import { getAllSymbols, getStockTimeseries, addThirtyPercentMoves } from "./db";
import { findPercentageMoves } from "./percentageMoveFinder";

// seedStocks();
// seedStockTimeseries();

console.time("get all symbols");
const symbols = getAllSymbols();
console.timeEnd("get all symbols");

console.time("find and add thirty percent moves");
for (const symbol of symbols) {
  const { stockId, daily } = getStockTimeseries(symbol);
  const moves = findPercentageMoves({ daily, minMove: 1.3, maxDays: 10 });
  addThirtyPercentMoves(stockId, moves);
}
console.timeEnd("find and add thirty percent moves");
