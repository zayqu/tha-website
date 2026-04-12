import { ExternalLink, FileText, BookOpen, Video, File } from 'lucide-react'

const iconMap = {
  'WHO Guidelines': BookOpen,
  'Research Papers': FileText,
  'Training Materials': Video,
  'Policy Documents': File,
  default: FileText
}

export default function AcademyCard({ resource }) {
  const Icon = iconMap[resource.category] || iconMap.default
  
  return (
    <a 
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 border border-gray-100 hover:border-accent/20"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {resource.sourceFavicon ? (
            <img 
              src={resource.sourceFavicon} 
              alt="" 
              width="40"
              height="40"
              decoding="async"
              className="w-10 h-10 rounded-lg object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-accent uppercase tracking-wider">
              {resource.source}
            </span>
            <ExternalLink className="w-4 h-4 text-neutral/40 group-hover:text-accent transition-colors" />
          </div>
          
          <h3 className="text-lg font-bold text-neutral mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {resource.title}
          </h3>
          
          <p className="text-sm text-neutral/70 line-clamp-2 mb-3 leading-relaxed">
            {resource.excerpt}
          </p>
          
          <div className="flex items-center text-xs text-neutral/50 space-x-3">
            <span>{resource.date}</span>
            {resource.category && (
              <>
                <span>•</span>
                <span>{resource.category}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  )
}
