import { Helmet } from 'react-helmet-async';
import SectionHeader from '../components/SectionHeader';
import { Target, Eye, Activity, Brain, HeartPulse, Stethoscope } from 'lucide-react';
import { Icon } from '../components/Icon';
import { thaData } from '../data/thaData';

const thematicAreas = [
  {
    icon: Activity,
    title: 'Viral Hepatitis',
    description: 'Comprehensive prevention, screening, and treatment programs targeting hepatitis B and C to reduce transmission and improve patient outcomes.'
  },
  {
    icon: HeartPulse,
    title: 'HIV/AIDS',
    description: 'Supporting prevention, treatment adherence, and stigma reduction initiatives while promoting access to antiretroviral therapy.'
  },
  {
    icon: Brain,
    title: 'Mental Health',
    description: 'Advocating for mental health awareness, reducing stigma, and improving access to psychological services.'
  },
  {
    icon: Stethoscope,
    title: 'Healthcare Access',
    description: 'Working to eliminate barriers to quality healthcare through mobile clinics and community health worker training.'
  }
];

export const About = () => {
  const timeline = [
    { year: '2025', event: 'THA Founded', description: 'Established with a vision to reduce preventable deaths' },
    { year: '2025', event: 'KAPIME Campaign Launch', description: 'Flagship hepatitis awareness and testing initiative' },
    { year: '2025', event: 'Life Unlocked Program', description: 'Youth mental health support program established' },
    { year: '2026', event: 'UNICEF Partnership', description: 'Strategic meeting on Hepatitis B birth-dose vaccination' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Tanzania Health Alliance</title>
        <meta name="description" content="Learn about Tanzania Health Alliance's mission, vision, and team." />
      </Helmet>

      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">About Tanzania Health Alliance</h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Tanzania Health Alliance (THA) is a registered NGO (Reg. No. {thaData.registrationNo}) focused on improving health outcomes across Tanzania.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-lg mb-6">Founded with a Vision of Health Equity</h2>
              <div className="space-y-4">
                <p className="body-lg">{thaData.founder.story}</p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80"
                  alt="THA Team"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <Eye className="w-12 h-12 text-secondary mb-6" />
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-white/90 text-lg leading-relaxed">{thaData.vision}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <Target className="w-12 h-12 text-secondary mb-6" />
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/90 text-lg leading-relaxed">{thaData.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Thematic Areas */}
      <section className="section-padding bg-neutral">
        <div className="container-custom">
          <SectionHeader title="Thematic Areas" centered />
          <div className="grid md:grid-cols-2 gap-8">
            {thematicAreas.map((area, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <area.icon className="w-12 h-12 text-secondary mb-6" />
                <h3 className="heading-md mb-3">{area.title}</h3>
                <p className="body-md text-neutral-dark/70">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12">Our Journey</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {timeline.map((item) => (
              <div key={item.year} className="relative pl-12 border-l-4 border-secondary/30">
                <div className="absolute -left-3 top-0 w-6 h-6 bg-secondary rounded-full border-4 border-white shadow-lg"></div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-3xl font-bold text-secondary">{item.year}</span>
                    <h3 className="heading-sm">{item.event}</h3>
                  </div>
                  <p className="body-md text-neutral-dark/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-neutral">
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {thaData.team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="h-48 bg-gradient-to-br from-primary to-secondary"></div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-primary mb-1">{member.name}</h3>
                  <p className="text-sm text-secondary mb-3">{member.title}</p>
                  <p className="text-sm text-neutral-dark/60">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-12">Our Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {thaData.partners.map((partner) => (
              <div key={partner.name} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center">
                  <div className="font-bold text-primary mb-1">{partner.name}</div>
                  <div className="text-xs text-neutral-dark/60">{partner.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
