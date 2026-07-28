import { useMemo, useState } from 'react';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import resources from '../data/academy.json';

const TOPICS = ['All topics', 'HIV', 'Hepatitis', 'Mental Health'];
const CATEGORIES = ['All resources', 'Guidance', 'Training', 'Research', 'Policy', 'News'];

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(value));
}

export const Academy = () => {
  const [topic, setTopic] = useState('All topics');
  const [category, setCategory] = useState('All resources');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = useMemo(() => resources
    .filter(resource => resource.status !== 'draft')
    .filter(resource => topic === 'All topics' || resource.topics?.includes(topic))
    .filter(resource => category === 'All resources' || resource.category === category)
    .filter(resource => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      return [resource.title, resource.excerpt, resource.source, ...(resource.topics || [])]
        .join(' ').toLowerCase().includes(query);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)), [topic, category, searchQuery]);

  return (
    <div className="pt-14 md:pt-16">
      <SEO
        title="Public Health Knowledge Centre"
        description="Read trusted online guidance, training and health information on HIV, viral hepatitis and mental health."
        canonicalPath="/academy"
      />

      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <p className="uppercase tracking-[0.2em] text-sm font-semibold text-white/75 mb-4">THA Academy</p>
            <h1 className="heading-xl text-white mb-5">Public Health Knowledge Centre</h1>
            <p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto mb-8">
              Read verified guidance and learning resources from trusted national and international health institutions.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <Icon name="search" size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
              <input
                type="search"
                placeholder="Search by topic, title or institution"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-secondary text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b sticky top-14 md:top-16 z-30">
        <div className="container-custom px-4 py-4 space-y-3">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar">
            {TOPICS.map(item => (
              <button key={item} onClick={() => setTopic(item)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${topic === item ? 'bg-primary text-white' : 'bg-neutral text-primary hover:bg-gray-200'}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto custom-scrollbar">
            {CATEGORIES.map(item => (
              <button key={item} onClick={() => setCategory(item)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${category === item ? 'bg-secondary text-white' : 'border border-gray-200 text-gray-600 hover:border-secondary'}`}>
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-neutral">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-secondary font-semibold mb-2">Evidence-based learning</p>
              <h2 className="heading-lg">Latest resources</h2>
            </div>
            <p className="text-gray-500">{filteredResources.length} resource{filteredResources.length === 1 ? '' : 's'}</p>
          </div>

          {filteredResources.length ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <article key={resource.url} className="bg-white rounded-2xl shadow-card p-6 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="badge badge-category">{resource.category}</span>
                    {resource.topics?.map(item => (
                      <span key={item} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/5 text-primary">{item}</span>
                    ))}
                  </div>
                  <h3 className="heading-sm mb-3">{resource.title}</h3>
                  <p className="body-md text-gray-600 mb-5 flex-grow">{resource.excerpt}</p>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between gap-4 text-sm text-gray-500 mb-4">
                      <span className="font-semibold text-primary">{resource.source}</span>
                      <span>{formatDate(resource.date)}</span>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-secondary inline-flex items-center justify-center gap-2"
                      aria-label={`Read ${resource.title} online at ${resource.source}`}
                    >
                      Read online
                      <Icon name="open_in_new" size={18} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card text-center py-16 px-6">
              <Icon name="search" size={48} className="text-primary/30 mx-auto mb-4" />
              <h3 className="heading-md mb-3">No matching resources</h3>
              <p className="text-gray-600 mb-6">Try a different topic, resource type or search term.</p>
              <button onClick={() => { setTopic('All topics'); setCategory('All resources'); setSearchQuery(''); }} className="btn-secondary">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-8 items-start">
            <div>
              <p className="text-secondary font-semibold mb-2">Editorial standard</p>
              <h2 className="heading-lg">Trusted, attributable information</h2>
            </div>
            <div className="space-y-4 text-gray-600">
              <p>Every resource identifies its original institution and opens on the source website for online reading.</p>
              <p>Automated discoveries are reviewed for relevance, date, source and topic before they appear in the Academy.</p>
              <p>THA does not replace professional medical advice. Readers should consult qualified health professionals for individual care.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
