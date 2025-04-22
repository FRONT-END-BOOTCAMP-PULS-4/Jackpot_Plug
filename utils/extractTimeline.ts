export function extractTimeline(description: string): string[] {
  const lines = description.split("\n");

  return lines
    .filter(
      (line) =>
        /^\s*\d{1,2}\s*\.\s*\S+/.test(line) || // 넘버링 있는 줄
        /\d{1,2}:\d{2}(?::\d{2})?/.test(line) // 타임라인 있는 줄
    )
    .map((line) =>
      line
        .replace(/^\s*\d{1,2}\s*\.\s*|\(?\d{1,2}:\d{2}(?::\d{2})?\)?\s*/g, "")
        .trim()
    );
}
