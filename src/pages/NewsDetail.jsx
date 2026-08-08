import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import { fetchNewsArticle } from '../lib/api';
import { getNewsImageProps } from '../lib/imageUtils';

export default function NewsDetail() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);
    setLoadError('');
    setNews(null);
    fetchNewsArticle(slug)
      .then(article => {
        if (!isMounted) return;
        if (!article) {
          setNotFound(true);
          return;
        }
        setNews(article);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError("We couldn't load this article. Please try again.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [reloadKey, slug]);

  if (!loading && notFound) {
    return <Navigate to="/news" replace />;
  }

  if (!loading && loadError) {
    return (
      <div className="pt-14 md:pt-16 min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-lg text-center bg-red-50 border border-red-200 rounded-2xl p-8">
          <h1 className="heading-md mb-3">Article temporarily unavailable</h1>
          <p className="text-gray-600 mb-6">{loadError}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setReloadKey(key => key + 1)}
              className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
            >
              Try again
            </button>
            <Link to="/news" className="px-5 py-2.5 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition">
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="pt-14 md:pt-16 min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const formattedDate = new Date(news.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-white">
      <SEO
        title={news.title}
        description={news.excerpt}
        image={news.image}
        type="article"
        canonicalPath={`/news/${news.slug}`}
      />

      {/* Hero Image */}
      <div className="w-full h-72 md:h-[480px] relative">
        <img
          src={news.image}
          alt={news.title}
          width="1080"
          height="720"
          {...getNewsImageProps(news.image, { priority: true, hero: true })}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <span className="inline-block bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide mb-4">
            {news.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            {news.title}
          </h1>
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back link */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition mb-8"
        >
          <Icon name="arrow_forward" size={14} className="rotate-180" />
          Back to News
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Icon name="calendar_today" size={15} />
            {formattedDate}
          </div>
          {news.author && (
            <div className="flex items-center gap-2">
              <Icon name="person" size={15} />
              {news.author}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Icon name="visibility" size={15} />
            {news.views || 0} views
          </div>
        </div>

        {/* Content */}
        <div className="text-gray-700 leading-relaxed text-lg space-y-6">
          {news.content.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
            {news.tags.map((tag, i) => (
              <span key={i} className="bg-cool-gray text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Back CTA */}
        <div className="mt-12">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition"
          >
            <Icon name="arrow_forward" size={16} className="rotate-180" />
            Back to All News
          </Link>
        </div>

      </div>
    </div>
  );
}
