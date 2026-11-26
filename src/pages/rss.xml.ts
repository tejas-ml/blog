import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, postSlug } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  const blogRoot = new URL('blog/', context.site!).href;
  const feedUrl = new URL('rss.xml', blogRoot).href;
  return rss({
    title: 'Tejas Mahajan — Blog',
    description:
      'Technical notes on machine learning, AI security, computational biology, and systems, by Tejas Mahajan.',
    site: blogRoot,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/posts/${postSlug(post)}/`,
      categories: post.data.tags,
    })),
  });
}
