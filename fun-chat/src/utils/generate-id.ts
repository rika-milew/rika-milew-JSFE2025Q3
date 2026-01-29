export function generateId(): string {
  const BASE = 36;
  const startIndex = 2;
  const lastIndex = 6;

  return Date.now().toString(BASE) + Math.random().toString(BASE).slice(startIndex, lastIndex);
}
