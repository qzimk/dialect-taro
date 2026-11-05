export function cn(...inputs: Array<string | number | false | null | undefined>) {
  const seen = new Set<string>();
  for (const part of inputs) {
    if (!part) continue;
    for (const cls of String(part).split(/\s+/)) {
      if (cls) seen.add(cls);
    }
  }
  return [...seen].join(' ');
}
