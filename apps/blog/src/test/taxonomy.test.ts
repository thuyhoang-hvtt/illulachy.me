import { describe, it, expect } from 'vitest'
import { slugify } from '../lib/slugify'

describe('slugify', () => {
  it('lowercases a single-word string', () => {
    expect(slugify('Engineering')).toBe('engineering')
  })

  it('replaces spaces with hyphens', () => {
    expect(slugify('Web Development')).toBe('web-development')
  })

  it('leaves already-lowercase strings unchanged', () => {
    expect(slugify('rust')).toBe('rust')
  })

  it('trims and collapses multiple spaces', () => {
    expect(slugify('  Spaced  Out  ')).toBe('spaced-out')
  })

  it('returns empty string for empty input', () => {
    expect(slugify('')).toBe('')
  })
})
