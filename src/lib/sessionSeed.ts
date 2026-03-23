const SEED_KEY = 'timeline-layout-seed'
const SEED_LIFETIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Get session-based random seed for timeline layout
 * 
 * Strategy:
 * - Persists seed in localStorage for 24 hours
 * - Same seed within session = consistent layout (feels stable)
 * - Different seed between sessions = organic variation (feels fresh)
 * - Graceful fallback if localStorage unavailable (still returns valid seed)
 * 
 * @returns Random seed between 0 and 1,000,000
 */
export function getSessionSeed(): number {
  try {
    const stored = localStorage.getItem(SEED_KEY)
    if (stored) {
      const { seed, timestamp } = JSON.parse(stored)
      const age = Date.now() - timestamp
      
      // Return existing seed if still fresh (within 24 hours)
      if (age < SEED_LIFETIME) {
        return seed
      }
    }
  } catch (e) {
    // localStorage unavailable or corrupted, will generate new seed
  }
  
  // Generate new seed
  const newSeed = Math.floor(Math.random() * 1000000)
  
  try {
    localStorage.setItem(SEED_KEY, JSON.stringify({
      seed: newSeed,
      timestamp: Date.now()
    }))
  } catch (e) {
    // localStorage write failed (quota exceeded or privacy mode)
    // Continue without persisting - seed still valid for this session
  }
  
  return newSeed
}
