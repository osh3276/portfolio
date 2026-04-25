import type { AstroGlobal } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: AstroGlobal) {
  const blog = await getCollection('blog');

  const posts = blog.sort((a, b) =>
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Oliver Huang's Blog</title>
    <description>Physics, mathematics, and computer science thoughts</description>
    <link>https://gooosexe.github.io/blog</link>
    <language>en-us</language>
    <atom:link href="https://gooosexe.github.io/rss.xml" rel="self" type="application/rss+xml" />
    ${posts.map(post => `
    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>https://gooosexe.github.io/blog/${post.slug}</link>
      <guid>https://gooosexe.github.io/blog/${post.slug}</guid>
      <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.data.title)}</description>
    </item>
    `).join('')}
  </channel>
</rss>`.trim();

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
