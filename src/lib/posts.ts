import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// Prefix an internal path with the deploy base. External URLs pass through.
export function withBase(path: string): string {
  if (!path.startsWith('/')) {
    return path;
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + path;
}

export function postHref(p: Post): string {
  return withBase(`/posts/${p.id}/`);
}

export function tagHref(tag: string): string {
  return withBase(`/tags/${encodeURIComponent(tag)}/`);
}

// Every tag in use, alphabetical.
export function allTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((p) => p.data.tags))].sort();
}

// Newest first. Posts with an unconfirmed date sort after dated ones;
// same-date posts sort by `order` (higher first), then title. Drafts show only in dev.
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('posts', (p) => import.meta.env.DEV || !p.data.draft);
  return all.sort((a, b) => {
    if (a.data.datePending !== b.data.datePending) {
      return a.data.datePending ? 1 : -1;
    }
    const byDate = b.data.date.getTime() - a.data.date.getTime();
    if (byDate !== 0) {
      return byDate;
    }
    const byOrder = b.data.order - a.data.order;
    if (byOrder !== 0) {
      return byOrder;
    }
    return a.data.title.localeCompare(b.data.title);
  });
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

// Printed date, or null while the date is unconfirmed.
export function postDate(p: Post): { text: string; iso: string } | null {
  if (p.data.datePending) {
    return null;
  }
  return { text: DATE_FORMAT.format(p.data.date), iso: p.data.date.toISOString().slice(0, 10) };
}

// Reading time from the MDX source: words of prose, ignoring tags and imports.
const WORDS_PER_MINUTE = 220;

export function readingMinutes(p: Post): number {
  if (p.data.minutes) {
    return p.data.minutes;
  }
  const text = (p.body ?? '')
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>|{}[\]()-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
