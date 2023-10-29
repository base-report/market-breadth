type Candle = [
  number, // open
  number, // high
  number, // low
  number, // close
  number, // volume
  number, // timestamp
];

type Timeseries = Candle[];

interface FMPResponse {
  symbol: string;
  historical: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    adjClose: number;
    volume: number;
    unadjustedVolume: number;
    change: number;
    changePercent: number;
    vwap: number;
    label: string;
    changeOverTime: number;
  }[];
}

export type { Candle, Timeseries, FMPResponse };
