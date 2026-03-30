import rss from '@astrojs/rss'
import type { APIContext } from 'astro'

export async function GET(context: APIContext) {
  const postModules = import.meta.glob(
    '../../../../packages/content/content/posts/**/*.md',
    { eager: true }
  )

  const posts = Object.entries(postModules)
    .map(([path, mod]: [string, any]) => ({
      slug: path.split('/').pop()!.replace('.md', ''),
      title: mod.frontmatter?.title as string,
      date: mod.frontmatter?.date as string,
      excerpt: (mod.frontmatter?.excerpt ?? '') as string,
    }))
    .filter(p => p.title)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return rss({
    title: 'Writing — illulachy.me',
    description: 'Thoughts on engineering, learning, and building.',
    site: context.site!,
    items: posts.map(post => ({
      title: post.title,
      pubDate: new Date(post.date),
      description: post.excerpt,
      link: `/${post.slug}/`,
    })),
  })
}
