import Navigation from '../../components/Navigation';
import type { Metadata } from 'next';
import BlogList from '../../components/BlogList';
import { getPostsSummary, getAllTags } from '../../utils/blog';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest posts on unfilteredmind.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog | unfilteredmind',
    description: 'Read the latest posts on unfilteredmind.',
    url: '/blog',
    type: 'website',
  },
};

export default async function Blog() {
  const posts = getPostsSummary();
  const allTags = getAllTags();

  return (
    <>
      <Navigation />
      <main className="main">
        <div className="container">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
                  { '@type': 'ListItem', position: 2, name: 'Blog', item: '/blog' },
                ],
              }),
            }}
          />
          <h1 className="title">My Blog</h1>

          <BlogList posts={posts} tags={allTags} />
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer">rss</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">github</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">view source</a>
          </div>
          <div className="copyright">© 2024 MIT Licensed</div>
        </div>
      </footer>
    </>
  );
}
