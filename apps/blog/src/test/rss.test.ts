import { describe, it, expect } from 'vitest'

// Test the mapping logic that will be used in rss.xml.ts
// Extracted as a pure function for testability

interface RssPostInput {
  slug: string
  title: string
  date: string
  excerpt?: string
}

function mapPostToRssItem(post: RssPostInput) {
  return {
    title: post.title,
    pubDate: new Date(post.date),
    description: post.excerpt ?? '',
    link: `/${post.slug}/`,
  }
}

function buildCanonicalUrl(pathname: string, site: string): string {
  return new URL(pathname, site).href
}

describe('RSS item mapping', () => {
  it('maps a post with all fields to RSS item shape', () => {
    const item = mapPostToRssItem({
      slug: 'hello-world',
      title: 'Hello World',
      date: '2026-01-15',
      excerpt: 'A test post',
    })
    expect(item.title).toBe('Hello World')
    expect(item.pubDate).toEqual(new Date('2026-01-15'))
    expect(item.description).toBe('A test post')
    expect(item.link).toBe('/hello-world/')
  })

  it('handles missing excerpt with empty string', () => {
    const item = mapPostToRssItem({
      slug: 'no-excerpt',
      title: 'No Excerpt',
      date: '2026-02-01',
    })
    expect(item.description).toBe('')
  })

  it('link includes trailing slash', () => {
    const item = mapPostToRssItem({
      slug: 'my-post',
      title: 'My Post',
      date: '2026-03-01',
      excerpt: 'test',
    })
    expect(item.link).toBe('/my-post/')
  })
})

describe('Canonical URL construction', () => {
  it('builds absolute URL from pathname and site', () => {
    const url = buildCanonicalUrl('/hello-world/', 'https://writing.illulachy.me')
    expect(url).toBe('https://writing.illulachy.me/hello-world/')
  })

  it('handles root path', () => {
    const url = buildCanonicalUrl('/', 'https://writing.illulachy.me')
    expect(url).toBe('https://writing.illulachy.me/')
  })
})
