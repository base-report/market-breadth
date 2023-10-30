const parseDate = (dateString: string, timeZone = "US/Eastern") => {
  const [date, time] = dateString.split(" ");
  const [y, m, d] = date.split("-").map((x) => parseInt(x));
  const [hr, min, sec] = time
    ? time.split(":").map((x) => parseInt(x))
    : [16, 0, 0];

  const _date = new Date(Date.UTC(y, m - 1, d, hr, min, sec));
  const utcDate = new Date(_date.toLocaleString("en-US", { timeZone: "UTC" }));
  const tzDate = new Date(_date.toLocaleString("en-US", { timeZone }));
  const offset = utcDate.getTime() - tzDate.getTime();
  _date.setTime(_date.getTime() + offset);
  return _date;
};

const timestampToDateStr = (timestamp: number): string => {
  // Create a new date object from the timestamp
  const date = new Date(timestamp);

  // Convert to YYYY-MM-DD format
  const year = date.getUTCFullYear(); // YYYY
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // MM
  const day = date.getUTCDate().toString().padStart(2, "0"); // DD

  return `${year}-${month}-${day}`; // YYYY-MM-DD
};

export { parseDate, timestampToDateStr };
