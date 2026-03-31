import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import SectionHeader from '../components/SectionHeader'
import AcademyCard from '../components/AcademyCard'
import academyData from '../data/academy.json'

const categories = ['All', 'WHO Guidelines', 'Research Papers', 'Training Materials', 'Policy Documents']

export default function Academy() {
  const [activeCategory, setActiveCategory] = useState('All')
  
  const filteredResources = activeCategory === 'All' 
    ? academyData 
    : academyData.filter(item => item.category === activeCategory)

  return (
    <>
      <Helmet>
        <title>Academy - Tanzania Health Alliance</title>
        <meta name="description" content="Access health education resources, WHO guidelines, research papers, and training materials curated for healthcare professionals and communities." />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="container-custom mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Health Education & Training Resources</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Curated repository of guidelines, research, and training materials from leading 
            health organizations worldwide. Updated daily.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background min-h-screen">
        <div className="container-custom mx-auto">
          <SectionHeader 
            title="Resource Library"
            subtitle="Browse our collection of evidence-based health resources"
            centered
          />

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
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

          {/* Resources Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredResources.map((resource, index) => (
                <AcademyCard key={index} resource={resource} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral/60 text-lg">No resources found in this category.</p>
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-16 bg-white rounded-xl p-6 border-l-4 border-accent shadow-sm">
            <h3 className="font-bold text-neutral mb-2">About Our Academy</h3>
            <p className="text-neutral/70 text-sm leading-relaxed">
              Resources are automatically curated daily from WHO, CDC, World Hepatitis Alliance, 
              and Tanzania Ministry of Health databases. Last updated: {new Date().toLocaleDateString()}. 
              All links direct to official source documents.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}