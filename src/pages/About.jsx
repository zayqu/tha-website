<<<<<<< HEAD
import { Icon } from '../components/Icon';
import { thaData } from '../data/thaData';

export const About = () => {
  const timeline = [
    { year: '2025', event: 'THA Founded', description: 'Established with a vision to reduce preventable deaths and address urgent health challenges' },
    { year: '2025', event: 'KAPIME Campaign Launch', description: 'Flagship hepatitis awareness and testing initiative begins' },
    { year: '2025', event: 'Life Unlocked Program', description: 'Youth mental health support program established' },
    { year: '2026', event: 'UNICEF Partnership', description: 'Strategic meeting on Hepatitis B birth-dose vaccination' },
  ];

  const leadership = [
    {
      name: 'Shaibu Issa',
      title: 'Founder & Executive Director',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
      bio: 'Visionary leader with 15+ years in public health advocacy and program development across East Africa.'
    },
    {
      name: 'Dr. Amina Hassan',
      title: 'Medical Director',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
      bio: 'Board-certified physician specializing in infectious diseases and community health systems.'
    },
    {
      name: 'James Mwangi',
      title: 'Programs Manager',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
      bio: 'Expert in project management with extensive experience in NGO operations and community engagement.'
    },
    {
      name: 'Grace Nyerere',
      title: 'Partnerships Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
      bio: 'Strategic partnerships specialist with a track record of building impactful collaborations.'
    },
  ];

  const partners = [
    { name: 'World Health Organization', type: 'Technical Partner' },
    { name: 'World Hepatitis Alliance', type: 'Program Partner' },
    { name: 'UNAIDS', type: 'Strategic Partner' },
    { name: 'PEPFAR', type: 'Funding Partner' },
    { name: 'Global Fund', type: 'Funding Partner' },
    { name: 'CDC Foundation', type: 'Technical Partner' },
    { name: 'USAID', type: 'Funding Partner' },
    { name: 'Ministry of Health - Tanzania', type: 'Government Partner' },
  ];

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl text-white mb-6">About Tanzania Health Alliance</h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-4">
              Tanzania Health Alliance (THA) is a registered non-governmental organization (Reg. No. {thaData.registrationNo}) based in Dar es Salaam.
            </p>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              The organization focuses on improving health outcomes by addressing key public health issues affecting communities across Tanzania.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block px-4 py-2 bg-secondary/10 rounded-full text-secondary font-semibold mb-6">
                Our Story
              </div>
              <h2 className="heading-lg mb-6">Why We Exist</h2>
              <p className="body-lg mb-4">
                Tanzania Health Alliance was established with the goal of reducing preventable deaths and addressing urgent health challenges in Tanzania.
              </p>
              <p className="body-lg mb-6">
                {thaData.founder.story}
              </p>
              <div className="flex items-center gap-4 p-6 bg-neutral rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center text-white font-bold text-2xl">
                  {thaData.founder.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-bold text-primary">{thaData.founder.name}</div>
                  <div className="text-neutral-dark/70">{thaData.founder.title}</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="img-zoom-container rounded-2xl shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80"
                  alt="THA Team"
                  className="w-full h-[400px] object-cover img-zoom"
                />
              </div>
=======
import { Helmet } from 'react-helmet-async'
import SectionHeader from '../components/SectionHeader'
import { Target, Eye, Activity, Brain, HeartPulse, Stethoscope } from 'lucide-react'

const thematicAreas = [
  {
    icon: Activity,
    title: 'Viral Hepatitis',
    description: 'Comprehensive prevention, screening, and treatment programs targeting hepatitis B and C to reduce transmission and improve patient outcomes across Tanzania.'
  },
  {
    icon: HeartPulse,
    title: 'HIV/AIDS',
    description: 'Supporting prevention, treatment adherence, and stigma reduction initiatives while promoting access to antiretroviral therapy and comprehensive care services.'
  },
  {
    icon: Brain,
    title: 'Mental Health',
    description: 'Advocating for mental health awareness, reducing stigma, and improving access to psychological services and community-based support systems.'
  },
  {
    icon: Stethoscope,
    title: 'Healthcare Access',
    description: 'Working to eliminate barriers to quality healthcare through mobile clinics, telemedicine initiatives, and community health worker training programs.'
  }
]

const team = [
  {
    name: 'Shaibu Issa',
    role: 'Founder & Executive Director',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Public health specialist with 15+ years experience in health systems strengthening.'
  },
  {
    name: 'Dr. Mary Johnson',
    role: 'Medical Director',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Infectious disease specialist focusing on hepatitis and HIV treatment programs.'
  },
  {
    name: 'James Mwakalinga',
    role: 'Programs Manager',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Expert in community engagement and health education program implementation.'
  },
  {
    name: 'Grace Muro',
    role: 'Finance & Admin Director',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    bio: 'Certified accountant ensuring transparent resource management and compliance.'
  }
]

const partners = [
  'World Health Organization',
  'UNICEF Tanzania',
  'Tanzania Ministry of Health',
  'Global Fund',
  'CDC Tanzania',
  'World Hepatitis Alliance',
  ' PATH',
  'JHPIEGO'
]

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us - Tanzania Health Alliance</title>
        <meta name="description" content="Learn about Tanzania Health Alliance's mission, vision, and the team working to improve health outcomes in Tanzania." />
      </Helmet>

      {/* Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-accent font-semibold mb-4">Our Story</div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral mb-6 leading-tight">
                Founded with a Vision of Health Equity
              </h1>
              <div className="prose prose-lg text-neutral/70 leading-relaxed space-y-4">
                <p>
                  Tanzania Health Alliance (THA) was established in 2018 by Shaibu Issa, a public health 
                  professional who witnessed firsthand the devastating impact of viral hepatitis and HIV 
                  on underserved communities in Tanzania.
                </p>
                <p>
                  What began as a small volunteer initiative conducting hepatitis screening in Dar es 
                  Salaam has grown into a national alliance impacting thousands of lives. Shaibu's 
                  vision was simple yet powerful: create a coordinated response to Tanzania's most 
                  pressing health challenges through education, early detection, and community empowerment.
                </p>
                <p>
                  Today, THA operates across multiple regions, partnering with government agencies, 
                  international organizations, and local communities to deliver sustainable health 
                  solutions. Our approach combines clinical excellence with cultural sensitivity, 
                  ensuring that healthcare reaches even the most remote populations.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="THA Founder working with community" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-accent text-white p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
                <p className="font-semibold text-lg">"Health is a human right, not a privilege."</p>
                <p className="text-sm mt-2 opacity-90">— Shaibu Issa, Founder</p>
              </div>
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Mission & Vision */}
      <section className="section-padding bg-neutral">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center mb-6">
                <Icon name="track_changes" size={32} className="text-white" />
              </div>
              <h3 className="heading-md mb-4">Our Mission</h3>
              <p className="body-md leading-relaxed">
                {thaData.mission}
              </p>
            </div>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center mb-6">
                <Icon name="visibility" size={32} className="text-white" />
              </div>
              <h3 className="heading-md mb-4">Our Vision</h3>
              <p className="body-md leading-relaxed">
                {thaData.vision}
=======
      {/* Vision & Mission */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <Eye className="w-12 h-12 text-accent mb-6" />
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-white/90 text-lg leading-relaxed">
                A Tanzania where every individual has access to quality healthcare, regardless of 
                their socioeconomic status or geographic location. We envision communities free from 
                the burden of preventable diseases, with robust health systems supporting wellbeing 
                across all stages of life.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <Target className="w-12 h-12 text-accent mb-6" />
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-white/90 text-lg leading-relaxed">
                To improve health outcomes in Tanzania through comprehensive education, advocacy, 
                and service delivery. We mobilize communities, strengthen health systems, and 
                create sustainable partnerships that address the root causes of health disparities, 
                with special focus on viral hepatitis, HIV/AIDS, and mental health.
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
              </p>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Objectives */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Our Objectives</h2>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {thaData.objectives.map((objective, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                  {index + 1}
                </div>
                <p className="body-md">{objective}</p>
=======
      {/* Thematic Areas */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <SectionHeader 
            title="Thematic Areas"
            subtitle="Our strategic focus areas addressing Tanzania's critical health challenges"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {thematicAreas.map((area, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 group">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <area.icon className="w-7 h-7 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral mb-3">{area.title}</h3>
                <p className="text-neutral/70 leading-relaxed">{area.description}</p>
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
              </div>
            ))}
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Timeline */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="heading-lg mb-4">Our Journey</h2>
            <p className="body-lg max-w-3xl mx-auto">
              From a small team with a big vision to Tanzania's leading health NGO
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div 
                  key={item.year}
                  className="relative pl-8 md:pl-12 border-l-4 border-secondary/30 hover:border-secondary transition-colors"
                >
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-secondary rounded-full border-4 border-white shadow-lg"></div>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow card-hover">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                      <span className="text-3xl font-bold text-secondary">{item.year}</span>
                      <h3 className="heading-sm">{item.event}</h3>
                    </div>
                    <p className="body-md text-neutral-dark/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-neutral">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="heading-lg mb-4">Our Team</h2>
            <p className="body-lg max-w-3xl mx-auto">
              Meet the dedicated professionals leading our mission
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {thaData.team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 card-hover">
                <div className="h-32 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-primary mb-1 text-sm">{member.name}</h3>
                  <div className="text-xs text-neutral-dark/70">{member.title}</div>
                </div>
=======
      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <SectionHeader 
            title="Leadership Team"
            subtitle="Meet the dedicated professionals driving our mission forward"
            centered
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-xl font-bold text-neutral mb-1">{member.name}</h3>
                <p className="text-accent font-medium text-sm mb-2">{member.role}</p>
                <p className="text-neutral/60 text-sm leading-relaxed">{member.bio}</p>
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
<<<<<<< HEAD
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Our Partners</h2>
            <p className="body-lg max-w-3xl mx-auto">
              Collaborating with leading organizations to maximize our impact
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <div 
                key={partner.name}
                className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all card-hover"
              >
                <div className="text-center">
                  <div className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                    {partner.name}
                  </div>
                  <div className="text-sm text-neutral-dark/60">{partner.type}</div>
                </div>
=======
      <section className="section-padding bg-background border-t border-gray-200">
        <div className="container-custom mx-auto">
          <SectionHeader 
            title="Our Partners"
            subtitle="Collaborating with leading organizations to maximize our impact"
            centered
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-24">
                <span className="text-neutral font-semibold text-center">{partner}</span>
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
              </div>
            ))}
          </div>
        </div>
      </section>
<<<<<<< HEAD

      {/* Annual Report */}
      <section className="section-padding bg-gradient-to-br from-secondary to-secondary-dark text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-4">Annual Report 2024</h2>
            <p className="text-xl text-white/90 mb-8">
              Download our comprehensive annual report to learn more about our programs, impact, and financial overview.
            </p>
            <button className="btn-primary bg-white text-secondary hover:bg-neutral">
              <Icon name="download" size={24} />
              Download Report (PDF)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
=======
    </>
  )
}
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
