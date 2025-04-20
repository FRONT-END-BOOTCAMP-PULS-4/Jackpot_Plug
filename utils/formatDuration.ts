function formatDuration(duration: string): string {
  const regex = /P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;

  const [, days, hours, minutes, seconds] = duration.match(regex) || [];

  const totalHours = parseInt(days || "0") * 24 + parseInt(hours || "0");
  const mins = parseInt(minutes || "0");
  const secs = parseInt(seconds || "0");

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${pad(totalHours)}:${pad(mins)}:${pad(secs)}`;
}
