import { Link } from 'react-router-dom';
import { Icon } from './Icon';

export default function NewsCard({ news }) {
  return (
    <article className="group bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {news.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-neutral/60 mb-3">
          <Icon name="calendar_today" size={16} className="mr-2" />
          {new Date(news.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        
        <h3 className="text-xl font-bold text-neutral mb-3 line-clamp-2 group-hover:text-accent transition-colors">
          {news.title}
        </h3>
        
        <p className="text-neutral/70 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
          {news.excerpt}
        </p>
        
        <Link 
          to={`/news/${news.slug}`}
          className="inline-flex items-center text-accent font-semibold text-sm hover:underline mt-auto"
        >
          Read More <Icon name="arrow_forward" size={16} className="ml-1" />
        </Link>
      </div>
    </article>
  );
}