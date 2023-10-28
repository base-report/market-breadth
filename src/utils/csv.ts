const parseCSVLine = (line: string, expectedLength: number): string[] => {
  const result = [];
  let startValueIndex = 0;
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    }

    if ((!inQuotes && line[i] === ",") || i === line.length - 1) {
      let value =
        i === line.length - 1
          ? line.slice(startValueIndex)
          : line.slice(startValueIndex, i);
      value = value.trim().replace(/^"|"$/g, ""); // Remove surrounding quotes
      result.push(value);
      startValueIndex = i + 1;
    }
  }

  // Fill in any missing values with empty strings
  while (result.length < expectedLength) {
    result.push("");
  }

  return result;
};

export { parseCSVLine };
