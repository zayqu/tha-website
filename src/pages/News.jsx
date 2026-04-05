<<<<<<< HEAD
import { useState } from 'react';
import { Icon } from '../components/Icon';
import { newsArticles } from '../data/newsData';

export const News = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'Announcements', label: 'Announcements' },
    { id: 'Events', label: 'Events' },
    { id: 'Press Releases', label: 'Press Releases' },
    { id: 'Success Stories', label: 'Success Stories' },
  ];

  const filteredNews = activeCategory === 'all' 
    ? newsArticles 
    : newsArticles.filter(article => article.category === activeCategory);

  const featuredArticle = newsArticles.find(article => article.isFeatured);
  const regularArticles = filteredNews.filter(article => !article.isFeatured);

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">News & Updates</h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Stay informed about our latest programs, events, and impact stories
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white shadow-md sticky top-16 md:top-20 z-30">
        <div className="container-custom px-4 overflow-x-auto custom-scrollbar">
          <div className="flex gap-2 py-4 min-w-max md:justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-neutral text-primary hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {activeCategory === 'all' && featuredArticle && (
        <section className="section-padding bg-neutral">
          <div className="container-custom">
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all card-hover">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="img-zoom-container h-64 md:h-full">
                  <img 
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover img-zoom"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="badge badge-new mb-4">Featured</div>
                  <h2 className="heading-lg mb-4">{featuredArticle.title}</h2>
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
                  <button className="btn-primary">
                    Read Full Story
                    <Icon name="arrow_forward" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {regularArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {regularArticles.map((article) => (
                <article 
                  key={article.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 card-hover"
                >
                  <div className="img-zoom-container h-56">
                    <img 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover img-zoom"
                    />
                    <div className="absolute top-4 left-4">
                      <div className="badge badge-category backdrop-blur-sm">
                        {article.category}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="heading-sm mb-3 line-clamp-2 group-hover:text-secondary transition-colors">
                      {article.title}
                    </h3>
                    <p className="body-md text-neutral-dark/70 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-neutral-dark/60">
                        <div className="flex items-center gap-1 mb-1">
                          <Icon name="person" size={14} />
                          {article.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="calendar_today" size={14} />
                          {article.date}
                        </div>
                      </div>
                      <Icon name="arrow_forward" size={20} className="text-secondary group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </article>
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

          {/* Load More */}
          {regularArticles.length > 0 && (
            <div className="text-center mt-12">
              <button className="btn-secondary">
                Load More Articles
                <Icon name="arrow_forward" size={20} />
=======
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SectionHeader from '../components/SectionHeader'
import NewsCard from '../components/NewsCard'
import newsData from '../data/news.json'

const categories = ['All', 'Announcements', 'Events', 'Press Releases', 'Success Stories']

export default function News() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const filteredNews = activeCategory === 'All' 
    ? newsData 
    : newsData.filter(item => item.category === activeCategory)

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage)
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  return (
    <>
      <Helmet>
        <title>News & Updates - Tanzania Health Alliance</title>
        <meta name="description" content="Latest news, announcements, events, and success stories from Tanzania Health Alliance." />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary text-white py-20">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">News & Updates</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Stay informed about our latest initiatives, upcoming events, and impact stories.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background min-h-screen">
        <div className="container-custom mx-auto">
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-accent text-white shadow-lg'
                    : 'bg-white text-neutral/70 hover:text-neutral hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* News Grid */}
          {paginatedNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral/60 text-lg">No news items found in this category.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-16">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-neutral hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-accent text-white'
                        : 'bg-white text-neutral hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-neutral hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
              </button>
            </div>
          )}
        </div>
      </section>
<<<<<<< HEAD
    </div>
  );
};
=======
    </>
  )
}
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
