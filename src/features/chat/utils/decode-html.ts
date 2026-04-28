const textarea =
  typeof window !== "undefined" ? document.createElement("textarea") : null;

/**
 * Decodes HTML entities in a string into their corresponding characters.
 */
export function decodeHtml(html: string): string {
  if (!textarea) {
    return html;
  }

  textarea.innerHTML = html;

  return textarea.value;
}
