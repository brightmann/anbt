'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from './SearchBar';
import TagsFilter from './TagsFilter';
import Pagination from './Pagination';
import AnimatedLink from './AnimatedLink';
import type { BlogPostSummary } from '../utils/blog';

const POSTS_PER_PAGE = 5;

function BlogListInner({ posts, tags }: { posts: BlogPostSummary[]; tags: string[] }) {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const searchQuery = searchParams.get('search') || undefined;
  const tagFilter = searchParams.get('tag') || undefined;

  let postsData: {
    posts: BlogPostSummary[];
    totalPages: number;
    currentPage: number;
    totalPosts: number;
  };

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    const searchResults = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.description?.toLowerCase().includes(q) ||
        post.tags?.toLowerCase().includes(q)
    );
    postsData = {
      posts: searchResults,
      totalPages: 1,
      currentPage: 1,
      totalPosts: searchResults.length,
    };
  } else if (tagFilter) {
    const t = tagFilter.toLowerCase();
    const tagResults = posts.filter((post) =>
      post.tags?.toLowerCase().includes(t)
    );
    postsData = {
      posts: tagResults,
      totalPages: 1,
      currentPage: 1,
      totalPosts: tagResults.length,
    };
  } else {
    const totalPosts = posts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    postsData = {
      posts: posts.slice(startIndex, startIndex + POSTS_PER_PAGE),
      totalPages,
      currentPage: page,
      totalPosts,
    };
  }

  return (
    <>
      <SearchBar />
      <TagsFilter tags={tags} currentTag={tagFilter} baseUrl="/blog" />

      {searchQuery && (
        <div className="search-results-info">
          <p>Search results for &quot;{searchQuery}&quot; ({postsData.totalPosts} posts found)</p>
        </div>
      )}

      {tagFilter && (
        <div className="tag-results-info">
          <p>Posts tagged with &quot;{tagFilter}&quot; ({postsData.totalPosts} posts found)</p>
        </div>
      )}

      <ul className="blog-posts">
        {postsData.posts.map((post) => (
          <li key={post.slug}>
            <AnimatedLink href={`/blog/${post.slug}`} className="blog-post-link">
              <div className="blog-post-meta">
                <span className="blog-post-date">{post.date}</span>
                {post.readTime && <span>• {post.readTime}</span>}
              </div>
              <span className="blog-post-title">{post.title}</span>
              {post.description && (
                <p className="blog-post-description">{post.description}</p>
              )}
              {post.tags && (
                <div className="blog-post-tags">
                  {post.tags.split(',').map((tag, index) => (
                    <span key={index} className="blog-post-tag">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </AnimatedLink>
          </li>
        ))}
      </ul>

      {postsData.posts.length === 0 && (
        <div className="no-posts">
          <p>No posts found.</p>
        </div>
      )}

      {!searchQuery && !tagFilter && postsData.totalPages > 1 && (
        <Pagination
          currentPage={postsData.currentPage}
          totalPages={postsData.totalPages}
          baseUrl="/blog"
        />
      )}
    </>
  );
}

export default function BlogList({ posts, tags }: { posts: BlogPostSummary[]; tags: string[] }) {
  return (
    <Suspense fallback={<p>Loading posts…</p>}>
      <BlogListInner posts={posts} tags={tags} />
    </Suspense>
  );
}
