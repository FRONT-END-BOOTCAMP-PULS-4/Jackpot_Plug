export function decodeHtmlEntities(text: string): string {
  if (!text) return "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}
