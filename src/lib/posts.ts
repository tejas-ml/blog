import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export function postSlug(post: Post): string {
  return post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx?$/, '');
}

export function postPath(post: Post): string {
  return `${import.meta.env.BASE_URL}posts/${postSlug(post)}/`;
}

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function formatDate(date: Date): string {
  // Frontmatter dates are calendar dates (midnight UTC). Format in UTC so
  // they do not roll back a day in US time zones.
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
