export function extractTimeline(description: string): string[] {
  const lines = description.split("\n");

  return lines
    .filter((line) => /\d{1,2}:\d{2}(?::\d{2})?/.test(line))
    .map((line) =>
      line
        .replace(/\(?\d{1,2}:\d{2}(?::\d{2})?\)?/, "")
        .trim()
        .replace(/\s*-\s*/, " - ")
    );
}
