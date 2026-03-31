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
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}