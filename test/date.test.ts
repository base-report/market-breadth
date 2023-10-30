import { expect, test, describe } from "bun:test";
import { parseDate, timestampToDateStr } from "../src/utils/date";

describe("date", () => {
  test("should parse date to EST closing time", () => {
    expect(parseDate("2019-01-01").getTime()).toEqual(1546376400000); // 2019-01-01 16:00:00 EST
  });

  test("should convert timestamp to date string", () => {
    expect(timestampToDateStr(1546376400000)).toEqual("2019-01-01");
  });
});
