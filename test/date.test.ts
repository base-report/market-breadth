import { expect, test, describe } from "bun:test";
import { parseDate } from "../src/utils/date";

describe("parseDate", () => {
  test("should parse date to EST closing time", () => {
    expect(parseDate("2019-01-01").getTime()).toEqual(1546376400000); // 2019-01-01 16:00:00 EST
  });
});
