export function generatePrefixedId(prefix: string, base: number, id: number) {
  return `${prefix}${base + id}`;
}
