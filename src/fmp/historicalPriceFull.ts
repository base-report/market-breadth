import type { Timeseries, FMPResponse } from "../types/Timeseries";

import { parseDate } from "../utils/date";

const fetchHistoricalPriceFull = async (
  symbol: string,
): Promise<FMPResponse> => {
  const url = `${process.env.FMP_BASE_URL}/v3/historical-price-full/${symbol}?apikey=${process.env.FMP_API_KEY}&from=1950-01-01`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const getStockTimeseries = async (
  symbol: string,
): Promise<Uint8Array | null> => {
  const data = await fetchHistoricalPriceFull(symbol);

  if (!data?.historical) {
    return null;
  }

  const timeseries: Timeseries = [];

  for (let i = 0; i < data.historical.length; i++) {
    const { date, open, high, low, close, volume } = data.historical[i];

    if (close === 0) {
      continue;
    }

    timeseries.push([
      open,
      high,
      low,
      close,
      volume,
      parseDate(date).getTime(),
    ]);
  }

  const jsonString = JSON.stringify(timeseries.reverse());
  const encoder = new TextEncoder();
  const binaryData: Uint8Array = encoder.encode(jsonString);

  return binaryData;
};

export { getStockTimeseries };
