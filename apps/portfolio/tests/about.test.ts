import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { aboutSchema } from '../src/types/about'

describe('aboutSchema', () => {
  it('accepts valid frontmatter with all required fields', () => {
    const validData = {
      name: 'Thuy Hoang',
      title: 'Software Engineer',
      bio: 'Building interactive experiences'
    }
    
    const result = aboutSchema.parse(validData)
    
    expect(result.name).toBe('Thuy Hoang')
    expect(result.title).toBe('Software Engineer')
    expect(result.bio).toBe('Building interactive experiences')
  })

  it('rejects missing required field (name)', () => {
    const invalidData = {
      title: 'Software Engineer',
      bio: 'Building interactive experiences'
    }
    
    expect(() => aboutSchema.parse(invalidData)).toThrow(z.ZodError)
  })

  it('rejects missing required field (title)', () => {
    const invalidData = {
      name: 'Thuy Hoang',
      bio: 'Building interactive experiences'
    }
    
    expect(() => aboutSchema.parse(invalidData)).toThrow(z.ZodError)
  })

  it('rejects missing required field (bio)', () => {
    const invalidData = {
      name: 'Thuy Hoang',
      title: 'Software Engineer'
    }
    
    expect(() => aboutSchema.parse(invalidData)).toThrow(z.ZodError)
  })

  it('accepts optional fields (avatar, email, social)', () => {
    const validDataWithOptionals = {
      name: 'Thuy Hoang',
      title: 'Software Engineer',
      bio: 'Building interactive experiences',
      avatar: '/images/avatar.jpg',
      email: 'thuy@example.com',
      social: {
        github: 'thuyhoang',
        twitter: 'thuyhoang',
        linkedin: 'thuyhoang',
        youtube: 'illulachy'
      }
    }
    
    const result = aboutSchema.parse(validDataWithOptionals)
    
    expect(result.avatar).toBe('/images/avatar.jpg')
    expect(result.email).toBe('thuy@example.com')
    expect(result.social?.github).toBe('thuyhoang')
    expect(result.social?.youtube).toBe('illulachy')
  })
})
