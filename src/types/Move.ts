interface Move {
  start_date: string;
  end_date: string;
  start_price: number;
  end_price: number;
  days_of_move: number;
  avg_dollar_vol_20_before_move: number;
}

interface DBMoveWrite extends Move {
  stock_id: number;
}

interface DBMoveRead extends DBMoveWrite {
  percent_change: number;
  change_per_day: number;
}

export type { Move, DBMoveWrite, DBMoveRead };
