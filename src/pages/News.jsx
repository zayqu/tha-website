import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import { newsArticles } from '../data/newsData';
import { fetchPublishedNews, normalizeArticle } from '../lib/api';
import { getNewsImageProps } from '../lib/imageUtils';

// Map categories to brand colors
const categoryColor = {
  'Events':         'bg-primary/10 text-primary',
  'Press Releases': 'bg-secondary/10 text-secondary-dark',
  'Success Stories':'bg-accent/10 text-accent-dark',
  'Announcements':  'bg-primary/10 text-primary',
};

export const News = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const fallbackNews = useMemo(() => newsArticles.map(normalizeArticle), []);
  const [articles, setArticles] = useState(fallbackNews);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    fetchPublishedNews({ limit: 100 })
      .then(liveArticles => {
        if (!isMounted) return;
        setArticles(liveArticles.length > 0 ? liveArticles : fallbackNews);
        setLoadError('');
      })
      .catch(() => {
        if (!isMounted) return;
        setArticles(fallbackNews);
        setLoadError('Showing saved website news while live news is unavailable.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [fallbackNews]);

  const categories = [
    { id: 'all',            label: 'All News' },
    { id: 'Announcements',  label: 'Announcements' },
    { id: 'Events',         label: 'Events' },
    { id: 'Press Releases', label: 'Press Releases' },
    { id: 'Success Stories',label: 'Success Stories' },
  ];

  const filteredNews = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category === activeCategory);

  const featuredArticle = articles.find(a => a.isFeatured);
  const regularArticles  = activeCategory === 'all'
    ? filteredNews.filter(a => !a.isFeatured)
    : filteredNews;

  return (
    <div className="pt-14 md:pt-20">
      <SEO
        title="News and Updates"
        description="Read Tanzania Health Alliance news, public health updates, campaign stories, and advocacy milestones across viral hepatitis, HIV, and mental health."
        canonicalPath="/news"
      />

      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">News &amp; Updates</h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Stay informed about our latest programs, events, and impact stories
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white shadow-md sticky top-14 md:top-16 z-30">
        <div className="container-custom px-4 overflow-x-auto custom-scrollbar">
          <div className="flex gap-2 py-4 min-w-max md:justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-neutral text-primary hover:bg-cool-gray-dark'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {activeCategory === 'all' && featuredArticle && (
        <section className="section-padding bg-neutral">
          <div className="container-custom">
            <Link
              to={`/news/${featuredArticle.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="img-zoom-container h-64 md:h-full min-h-[280px]">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    width="1080"
                    height="720"
                    {...getNewsImageProps(featuredArticle.image, { priority: true })}
                    className="w-full h-full object-cover img-zoom"
                  />
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-accent text-white text-xs font-bold rounded-full">
                      Featured
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColor[featuredArticle.category] || 'bg-primary/10 text-primary'}`}>
                      {featuredArticle.category}
                    </span>
                  </div>

                  <h2 className="heading-lg mb-4 group-hover:text-secondary transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="body-lg text-neutral-dark/70 mb-6">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="flex items-center gap-4 mb-6 text-sm text-neutral-dark/60">
                    <div className="flex items-center gap-2">
                      <Icon name="person" size={16} />
                      {featuredArticle.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="calendar_today" size={16} />
                      {featuredArticle.date}
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl w-fit group-hover:bg-secondary transition-colors duration-300">
                    Read Full Story
                    <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <Icon name="arrow_forward" size={14} color="white" />
                    </div>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {loading && (
            <div className="text-center text-neutral-dark/60 mb-8">Loading latest news...</div>
          )}
          {loadError && (
            <div className="max-w-2xl mx-auto bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 text-sm mb-8">
              {loadError}
            </div>
          )}
          {regularArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {regularArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col"
                >
                  {/* Image */}
                  <div className="img-zoom-container h-52 flex-shrink-0">
                    <img
                      src={article.image}
                      alt={article.title}
                      width="1080"
                      height="720"
                      {...getNewsImageProps(article.image)}
                      className="w-full h-full object-cover img-zoom"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${categoryColor[article.category] || 'bg-primary/10 text-primary'}`}>
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="heading-sm mb-3 line-clamp-2 group-hover:text-secondary transition-colors">
                      {article.title}
                    </h3>
                    <p className="body-md text-neutral-dark/70 mb-4 line-clamp-2 flex-grow">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-neutral-dark/60">
                        <div className="flex items-center gap-1 mb-1">
                          <Icon name="person" size={13} />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="calendar_today" size={13} />
                          <span>{article.date}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary group-hover:translate-x-1 transition-all duration-300">
                        <Icon name="arrow_forward" size={16} className="text-primary group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-neutral rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="newspaper" size={48} className="text-primary/30" />
              </div>
              <h3 className="heading-md mb-4">No news in this category</h3>
              <p className="body-md text-neutral-dark/70">
                Check back soon for updates in {activeCategory}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
