import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPostsBySection, postSlug } from '../../lib/posts';
import { SECTIONS, getSection, type SectionSlug } from '../../lib/sections';

export function getStaticPaths() {
  return SECTIONS.map((section) => ({
    params: { section: section.slug },
  }));
}

export async function GET(context: APIContext) {
  const slug = context.params.section as SectionSlug;
  const section = getSection(slug);
  if (!section) {
    return new Response('Not found', { status: 404 });
  }
  const posts = await getPostsBySection(slug);
  const blogRoot = new URL('blog/', context.site!).href;
  const feedUrl = new URL(`${slug}/rss.xml`, blogRoot).href;
  return rss({
    title: `${section.title} — Tejas Mahajan`,
    description: section.description,
    site: blogRoot,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />`,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/posts/${postSlug(post)}/`,
      categories: [section.title, ...post.data.tags],
    })),
  });
}
