import { useState } from 'react';
import { Icon } from '../components/Icon';

export const Projects = () => {
  const [filter, setFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: "Hepatitis Awareness Campaign - Dar es Salaam",
      description: "Comprehensive community outreach program reaching 5,000+ individuals with free testing and vaccination services",
      category: "Hepatitis",
      location: "Dar es Salaam",
      date: "2025",
      impact: "5,000+ people tested",
      images: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"],
      status: "completed"
    },
    {
      id: 2,
      title: "Mental Health First Aid Training",
      description: "Training 200 community health workers in mental health first aid and stigma reduction",
      category: "Mental Health",
      location: "Mwanza",
      date: "2025",
      impact: "200 trained CHWs",
      images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80"],
      status: "ongoing"
    },
    {
      id: 3,
      title: "Mobile HIV Testing Units",
      description: "Deploying mobile testing units to reach underserved rural communities across 5 regions",
      category: "HIV/AIDS",
      location: "Multi-region",
      date: "2024-2025",
      impact: "3,500+ tests conducted",
      images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80"],
      status: "ongoing"
    }
  ];

  const categories = ['all', 'Hepatitis', 'HIV/AIDS', 'Mental Health'];
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="pt-16 md:pt-20">
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">Our Projects & Activities</h1>
            <p className="text-xl text-white/90">Real impact, real change - see our work in action</p>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-md sticky top-16 md:top-20 z-30">
        <div className="container-custom px-4 overflow-x-auto">
          <div className="flex gap-2 py-4 min-w-max md:justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  filter === cat ? 'bg-secondary text-white' : 'bg-neutral text-primary hover:bg-gray-200'
                }`}>
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(project => (
              <article key={project.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all card-hover">
                <div className="img-zoom-container h-64">
                  <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover img-zoom"/>
                  <div className="absolute top-4 left-4">
                    <span className={`badge ${project.status === 'ongoing' ? 'bg-secondary' : 'bg-primary'} text-white`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="badge badge-category mb-3">{project.category}</div>
                  <h3 className="heading-sm mb-3">{project.title}</h3>
                  <p className="body-md text-neutral-dark/70 mb-4">{project.description}</p>
                  <div className="space-y-2 text-sm text-neutral-dark/60 mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="location_on" size={16}/>
                      {project.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="calendar_today" size={16}/>
                      {project.date}
                    </div>
                    <div className="flex items-center gap-2 text-secondary font-semibold">
                      <Icon name="check_circle" size={16}/>
                      {project.impact}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
