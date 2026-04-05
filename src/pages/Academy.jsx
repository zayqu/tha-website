import { useState } from 'react';
import { Icon } from '../components/Icon';

export const Academy = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    {
      id: 1,
      title: 'WHO Guidelines: Hepatitis B and C Testing Services',
      excerpt: 'Comprehensive guidelines for implementing effective testing services in resource-limited settings.',
      category: 'WHO Guidelines',
      source: 'WHO',
      date: 'March 25, 2026',
      isNew: true,
      url: '#'
    },
    {
      id: 2,
      title: 'Mental Health Integration in Primary Care: Implementation Guide',
      excerpt: 'Practical strategies for integrating mental health services into existing primary healthcare systems.',
      category: 'Training Materials',
      source: 'THA',
      date: 'March 20, 2026',
      isNew: true,
      url: '#'
    },
    {
      id: 3,
      title: 'HIV Prevention and Treatment in East Africa: 2025 Report',
      excerpt: 'Latest data and trends in HIV prevention, testing, and treatment across East African nations.',
      category: 'Research Papers',
      source: 'UNAIDS',
      date: 'March 15, 2026',
      isNew: false,
      url: '#'
    },
    {
      id: 4,
      title: 'Tanzania National Health Policy 2025-2030',
      excerpt: 'Policy framework for strengthening health systems and improving health outcomes nationwide.',
      category: 'Policy Documents',
      source: 'MoH Tanzania',
      date: 'March 10, 2026',
      isNew: false,
      url: '#'
    },
    {
      id: 5,
      title: 'Community Health Worker Training Manual',
      excerpt: 'Comprehensive training curriculum for community-based health workers and volunteers.',
      category: 'Training Materials',
      source: 'THA',
      date: 'March 5, 2026',
      isNew: false,
      url: '#'
    },
    {
      id: 6,
      title: 'THA Quarterly Newsletter - Q1 2026',
      excerpt: 'Updates on programs, success stories, and upcoming events from Tanzania Health Alliance.',
      category: 'Newsletters',
      source: 'THA',
      date: 'March 1, 2026',
      isNew: false,
      url: '#'
    },
  ];

  const filters = ['all', 'WHO Guidelines', 'Research Papers', 'Training Materials', 'Policy Documents', 'Newsletters'];

  const filteredResources = resources.filter(resource => {
    const matchesFilter = activeFilter === 'all' || resource.category === activeFilter;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">THA Academy</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Access evidence-based health resources, research, and educational materials
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Icon name="search" size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-secondary text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white shadow-md sticky top-16 md:top-20 z-30">
        <div className="container-custom px-4 overflow-x-auto custom-scrollbar">
          <div className="flex gap-2 py-4 min-w-max md:justify-center">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-secondary text-white shadow-md'
                    : 'bg-neutral text-primary hover:bg-gray-200'
                }`}
              >
                {filter === 'all' ? 'All Resources' : filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredResources.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredResources.map((resource) => (
                <article 
                  key={resource.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 card-hover overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="badge badge-category">{resource.category}</div>
                      {resource.isNew && <div className="badge badge-new">New</div>}
                    </div>

                    {/* Content */}
                    <h3 className="heading-sm mb-3 line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="body-md text-neutral-dark/70 mb-4 line-clamp-3">
                      {resource.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-neutral-dark/60">
                        <div className="font-semibold text-primary">{resource.source}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Icon name="calendar_today" size={14} />
                          {resource.date}
                        </div>
                      </div>
                      <button className="w-10 h-10 bg-secondary/10 hover:bg-secondary hover:text-white text-secondary rounded-lg flex items-center justify-center transition-colors group">
                        <Icon name="download" size={20} className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-neutral rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="search" size={48} className="text-primary/30" />
              </div>
              <h3 className="heading-md mb-4">No resources found</h3>
              <p className="body-md text-neutral-dark/70 mb-6">
                Try adjusting your search or filter to find what you're looking for
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-padding bg-gradient-to-br from-secondary to-secondary-dark text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-white/90 mb-6">
              Subscribe to receive new resources and updates from THA Academy
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button type="submit" className="bg-white text-secondary font-semibold px-6 py-3 rounded-lg hover:bg-neutral transition-colors flex items-center justify-center gap-2">
                Subscribe
                <Icon name="arrow_forward" size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
