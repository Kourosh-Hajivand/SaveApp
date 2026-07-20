function isNotEmpty(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "" && value !== " ";
}

export function prepareQuery(queryObject: Record<string, unknown>): string {
  const parts: string[] = [];

  for (const [key, value] of Object.entries(queryObject)) {
    if (!isNotEmpty(value)) continue;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }

  return parts.length === 0 ? "" : `?${parts.join("&")}`;
}

export function normalizeString(value: string): string {
  return value.trim().replace(/\s+/g, "").toLowerCase();
}
