import { useState } from 'react';
import { Icon } from '../components/Icon';
import { SEO } from '../components/SEO';
import testimonials from '../data/testimonials.json';

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

  const courses = [
    {
      title: 'Understanding Hepatitis',
      description: 'Learn the causes, types (like Hepatitis B & C), symptoms, available treatments, and how to prevent hepatitis in your community.',
      icon: 'local_hospital',
      category: 'Hepatitis',
    },
    {
      title: 'HIV Essentials - Stigma Reduction',
      description: 'Break the stigma. Learn how testing, medication, and community support help people live full lives with HIV.',
      icon: 'favorite',
      category: 'HIV',
    },
    {
      title: 'Mental Health Matters',
      description: 'Learn about mental well-being, risk factors, protective actions, and available services in Tanzania.',
      icon: 'psychology',
      category: 'Mental Health',
    },
  ];

  const topics = [
    {
      title: 'Hepatitis',
      description: 'Learn about viral hepatitis, its impact, prevention, and our work to eliminate hepatitis B and C in Tanzania.',
      icon: 'local_hospital',
    },
    {
      title: 'HIV',
      description: 'Discover how THA supports testing, treatment, and education to fight HIV and reduce stigma across communities.',
      icon: 'favorite',
    },
    {
      title: 'Mental Health',
      description: 'A state of well-being that enables people to cope with stress, work productively, and contribute to their communities.',
      icon: 'psychology',
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
    <div className="pt-0 md:pt-20">
      <SEO
        title="THA Academy"
        description="Access Tanzania Health Alliance learning resources on hepatitis, HIV, mental health, policy, and public health training."
        canonicalPath="/academy"
      />

      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-4">THA Academy</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2 leading-relaxed font-semibold">
              Creating Awareness for a Healthier Future
            </p>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Our mission is to educate and empower communities through evidence-based information about hepatitis prevention, treatment, and support.
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

      {/* Thematic Topics */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {topics.map((topic) => (
              <div key={topic.title} className="bg-cool-gray rounded-2xl p-8 text-center hover:shadow-card transition card-hover">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={topic.icon} size={32} color="white" />
                </div>
                <h3 className="heading-sm text-primary mb-3">{topic.title}</h3>
                <p className="body-md text-gray-600">{topic.description}</p>
              </div>
            ))}
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
                    <div className="flex items-start justify-between mb-4">
                      <div className="badge badge-category">{resource.category}</div>
                      {resource.isNew && <div className="badge badge-new">New</div>}
                    </div>
                    <h3 className="heading-sm mb-3 line-clamp-2">{resource.title}</h3>
                    <p className="body-md text-neutral-dark/70 mb-4 line-clamp-3">{resource.excerpt}</p>
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
                onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Courses Section */}
      <section className="section-padding bg-neutral">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">What Do You Want To Learn Today?</h2>
            <p className="body-lg text-neutral-dark/70 max-w-2xl mx-auto">
              Access free, engaging courses on mental health, hepatitis awareness, and more through our platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.title} className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition card-hover">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center mb-5">
                  <Icon name={course.icon} size={28} color="white" />
                </div>
                <div className="badge badge-category mb-3">{course.category}</div>
                <h3 className="heading-sm mb-3">{course.title}</h3>
                <p className="body-md text-neutral-dark/70">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">What People Are Saying</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.testimonials.map((t) => (
              <div key={t.id} className="bg-cool-gray rounded-2xl p-6 hover:shadow-card transition flex flex-col">
                <p className="body-md text-gray-600 italic mb-5 flex-grow">"{t.quote}"</p>
                <div className="border-t border-cool-gray-dark pt-4">
                  <p className="font-bold text-primary text-sm">{t.author}</p>
                  <p className="text-secondary text-xs mt-0.5">{t.title}</p>
                  <p className="text-gray-500 text-xs">{t.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="section-padding bg-neutral">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 md:p-12">
            <h2 className="heading-md mb-6 text-primary">Privacy Policy</h2>
            <div className="space-y-4 body-md text-gray-600">
              <p>
                Tanzania Health Alliance (THA) is committed to respecting your privacy. Our learning platform is freely accessible and does not require personal information such as names, emails, or registration to view educational content.
              </p>
              <p>
                We do not collect, store, or share any personal data from visitors accessing our courses or materials.
              </p>
              <p>
                Minimal cookies may be used to ensure smooth performance and improve the browsing experience, but no identifiable user data is tracked or stored.
              </p>
            </div>
          </div>
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
