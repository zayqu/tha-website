import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import newsData from '../data/news.json'

export default function NewsDetail() {
  const { slug } = useParams()
  const news = newsData.find(item => item.slug === slug)

  if (!news) {
    return <Navigate to="/news" replace />
  }

  return (
    <>
      <Helmet>
        <title>{news.title} - Tanzania Health Alliance</title>
        <meta name="description" content={news.excerpt} />
        <meta property="og:title" content={news.title} />
        <meta property="og:description" content={news.excerpt} />
        <meta property="og:image" content={news.image} />
      </Helmet>

      <article className="min-h-screen bg-white">
        {/* Back Navigation */}
        <div className="container-custom mx-auto px-4 py-6">
          <Link 
            to="/news" 
            className="inline-flex items-center text-neutral/70 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to News
          </Link>
        </div>

        {/* Hero Image */}
        <div className="w-full h-[400px] md:h-[500px] relative">
          <img 
            src={news.image} 
            alt={news.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 container-custom mx-auto px-4 pb-12">
            <span className="inline-block bg-accent text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
              {news.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white max-w-4xl leading-tight">
              {news.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="container-custom mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral/60 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(news.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              {news.author && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {news.author}
                </div>
              )}
            </div>

            {/* Body */}
            <div className="prose prose-lg max-w-none text-neutral/80 leading-relaxed">
              {news.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6">{paragraph}</p>
              ))}
            </div>

            {/* Share/Tags */}
            {news.tags && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center flex-wrap gap-2">
                  <Tag className="w-4 h-4 text-neutral/60 mr-2" />
                  {news.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-neutral/70 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  )
}