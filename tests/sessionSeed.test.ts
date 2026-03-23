import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getSessionSeed } from '../src/lib/sessionSeed'

describe('getSessionSeed', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('generates and stores new seed on first call', () => {
    const seed1 = getSessionSeed()
    expect(seed1).toBeGreaterThan(0)
    expect(seed1).toBeLessThan(1000000)
    
    const stored = localStorage.getItem('timeline-layout-seed')
    expect(stored).toBeTruthy()
    
    const parsed = JSON.parse(stored!)
    expect(parsed.seed).toBe(seed1)
    expect(parsed.timestamp).toBeGreaterThan(0)
  })

  it('returns same seed within 24 hours', () => {
    const seed1 = getSessionSeed()
    const seed2 = getSessionSeed()
    expect(seed2).toBe(seed1)
  })

  it('regenerates seed after 24 hours', () => {
    const seed1 = getSessionSeed()
    
    // Mock Date.now() to advance 25 hours
    const realNow = Date.now()
    vi.spyOn(Date, 'now').mockReturnValue(realNow + 25 * 60 * 60 * 1000)
    
    const seed2 = getSessionSeed()
    expect(seed2).not.toBe(seed1)
    
    vi.restoreAllMocks()
  })

  it('falls back gracefully when localStorage unavailable', () => {
    // Mock localStorage.setItem to throw
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    
    const seed = getSessionSeed()
    expect(seed).toBeGreaterThan(0) // Still returns valid seed
    expect(seed).toBeLessThan(1000000)
    
    vi.restoreAllMocks()
  })
})
