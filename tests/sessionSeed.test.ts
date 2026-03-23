import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getSessionSeed } from '../src/lib/sessionSeed'

describe('getSessionSeed', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it.todo('generates and stores new seed on first call')
  it.todo('returns same seed within 24 hours')
  it.todo('regenerates seed after 24 hours')
  it.todo('falls back gracefully when localStorage unavailable')
})
