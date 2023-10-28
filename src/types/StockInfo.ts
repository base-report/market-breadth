interface StockInfo {
  symbol: string;
  exchange: string;
  sector: string | null;
  industry: string | null;
  delisted: boolean;
}

interface DBStockInfo extends StockInfo {
  id: number;
}

export type { StockInfo, DBStockInfo };
