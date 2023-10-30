import type { Timeseries } from "./types/Timeseries";
import type { Move } from "./types/Move";

import { timestampToDateStr } from "./utils/date";

const findPercentageMoves = ({
  daily,
  minMove,
  maxDays,
}: {
  daily: Timeseries;
  minMove: number;
  maxDays: number;
}): Move[] => {
  let movesFound: Timeseries[] = [];

  for (let i = 0; i < daily.length - maxDays; ) {
    let baseDay = daily[i];
    let baseClose = baseDay[3]; // close price is at index 3
    let hasMadeMove = false;

    for (let j = i + 1; j <= i + maxDays && j < daily.length; j++) {
      let currentDay = daily[j];
      let currentClose = currentDay[3];

      // If current day's close is less than base day's close, reset the base day
      if (currentClose < baseClose) {
        break;
      }

      // Check for a minimum upward move
      if (!hasMadeMove && currentClose >= baseClose * minMove) {
        hasMadeMove = true;
        movesFound.push(daily.slice(i, j + 1)); // add the range of days to the movesFound array
        i = j; // Move the outer loop index to the end of the current move
        break;
      }
    }

    if (!hasMadeMove) {
      // Increment the loop only if no move has been made
      i++;
    }
  }

  return movesFound.map((move) => {
    let [, , , start_price, , start_timestamp] = move[0];
    let [, , , end_price, , end_timestamp] = move[move.length - 1];

    const start_date = timestampToDateStr(start_timestamp);
    const end_date = timestampToDateStr(end_timestamp);

    return {
      start_date,
      end_date,
      start_price,
      end_price,
      days_of_move: move.length,
    };
  });
};

export { findPercentageMoves };
