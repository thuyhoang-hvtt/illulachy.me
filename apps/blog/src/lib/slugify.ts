/**
 * Normalizes a string into a URL-safe slug.
 * Lowercases, trims, collapses whitespace to single hyphens.
 */
export function slugify(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}
