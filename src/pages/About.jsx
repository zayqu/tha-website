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
            </div>
          </div>
        </div>
      </section>

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
              </p>
            </div>
          </div>
        </div>
      </section>

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
              </div>
            ))}
          </div>
        </div>
      </section>

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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}