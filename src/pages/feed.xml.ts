import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const items = posts.map(post => ({
    title: post.data.title,
    pubDate: post.data.pubDate,
    description: post.data.description,
    link: `/writing/${post.id}/`,
  }));

  // Include static pages as entries too
  const staticEntries = [
    {
      title: 'The Functional Life',
      pubDate: new Date('2025-07-17'),
      description: 'What is the meaning of life? Aristotle supplies the structure. Feynman supplies the method. The Solo Systems Architect supplies the practice.',
      link: '/functional-life.html',
    },
    {
      title: 'The Meaning of Life: A Techno-Optimist\'s Response',
      pubDate: new Date('2025-07-17'),
      description: 'A response to 2,500 years of philosophy from a techno-optimist building in Malaysia.',
      link: '/meaning-of-life.html',
    },
  ];

  return rss({
    title: 'The Future Is Solo',
    description: 'Intellectual sovereignty in the agentic AI era.',
    site: 'https://thefutureissolo.com',
    items: [...staticEntries, ...items],
  });
}
