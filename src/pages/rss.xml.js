import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_NAME } from '../data/site';
import { getPosts, postHref } from '../lib/posts';

// One item per published post. Undated posts carry no pubDate.
export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.summary,
      link: postHref(p),
      pubDate: p.data.datePending ? undefined : p.data.date,
      categories: p.data.tags,
    })),
  });
}
