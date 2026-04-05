import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Heart, Globe, ChevronRight } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import CounterAnimation from '../components/CounterAnimation'
import NewsCard from '../components/NewsCard'
import AcademyCard from '../components/AcademyCard'
import ButtonPrimary from '../components/ButtonPrimary'
import ButtonSecondary from '../components/ButtonSecondary'
import newsData from '../data/news.json'
import academyData from '../data/academy.json'

const impactStats = [
  { number: 15000, suffix: '+', label: 'People Reached', icon: Users },
  { number: 50, suffix: '+', label: 'Communities Served', icon: Globe },
  { number: 200, suffix: '+', label: 'Volunteers Active', icon: Heart },
]

const partners = [
  { name: 'WHO', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/World_Health_Organization_Logo.svg/200px-World_Health_Organization_Logo.svg.png' },
  { name: 'UNICEF', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/UNICEF_Logo.png/200px-UNICEF_Logo.png' },
  { name: 'Global Fund', logo: 'https://www.theglobalfund.org/assets/images/logo.png' },
  { name: 'CDC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/US_CDC_logo.svg/200px-US_CDC_logo.svg.png' },
  { name: 'Tanzania MoH', logo: 'https://www.moh.go.tz/site/images/logo.png' },
  { name: 'World Hepatitis Alliance', logo: 'https://www.worldhepatitisalliance.org/sites/default/files/2020-09/WHA%20Logo.png' },
]

export default function Home() {
  const latestNews = newsData.slice(0, 3)
  const featuredAcademy = academyData.slice(0, 3)

  return (
    <>
      <Helmet>
        <title>Tanzania Health Alliance - Improving Health Outcomes</title>
        <meta name="description" content="Tanzania Health Alliance is dedicated to improving health outcomes through education, advocacy, and community engagement." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-secondary min-h-[90vh] flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>
        </div>
        
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="text-accent font-semibold text-sm">Transforming Healthcare in Tanzania</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Building a Healthier<br />
              <span className="text-accent">Tanzania</span> Together
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
              We unite communities, healthcare professionals, and partners to combat viral hepatitis, 
              HIV/AIDS, and mental health challenges through education, advocacy, and accessible care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <ButtonPrimary to="/make-a-difference" className="text-lg px-10">
                Join the Alliance <ArrowRight className="ml-2 w-5 h-5" />
              </ButtonPrimary>
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center text-white font-semibold text-lg hover:text-accent transition-colors"
              >
                Learn More <ChevronRight className="ml-1 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-white">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-background">
                <stat.icon className="w-10 h-10 text-accent mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold text-neutral mb-2">
                  <CounterAnimation end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-neutral/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="section-padding bg-background">
        <div className="container-custom mx-auto">
          <SectionHeader 
            title="Latest News"
            subtitle="Stay updated with our latest initiatives, success stories, and announcements"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <ButtonSecondary to="/news">View All News</ButtonSecondary>
          </div>
        </div>
      </section>

      {/* Featured Academy */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <SectionHeader 
            title="Academy Resources"
            subtitle="Access the latest health guidelines, research, and training materials"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAcademy.map((resource, index) => (
              <AcademyCard key={index} resource={resource} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <ButtonSecondary to="/academy">Browse Academy</ButtonSecondary>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section-padding bg-background border-t border-gray-200">
        <div className="container-custom mx-auto">
          <p className="text-center text-sm font-semibold text-neutral/50 uppercase tracking-widest mb-8">
            Trusted by Leading Organizations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center justify-center p-4 hover:opacity-100 transition-opacity">
                <img 
                  src={partner.logo} 
                  alt={partner.name} 
                  className="max-h-12 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
