import { describe, it, expect } from 'vitest'
import { createDateToXMapper, getDateRange } from '../src/lib/dateUtils'
import type { ContentNode } from '../src/types/content'

describe('createDateToXMapper', () => {
  const mockNodes: ContentNode[] = [
    { id: '1', type: 'blog', title: 'Old', date: '2020-01-01T00:00:00.000Z' },
    { id: '2', type: 'blog', title: 'Mid', date: '2022-06-15T00:00:00.000Z' },
    { id: '3', type: 'blog', title: 'New', date: '2024-12-31T00:00:00.000Z' }
  ]

  it.todo('returns mapper function that converts dates to negative X')
  it.todo('oldest node maps to most negative X')
  it.todo('newest node maps to X closest to 0')
  it.todo('nodes with same date get same X coordinate')
  it.todo('chronological ordering maintained')
})

describe('getDateRange', () => {
  it.todo('calculates date span in days')
  it.todo('identifies oldest and newest dates')
  it.todo('handles single node')
})
