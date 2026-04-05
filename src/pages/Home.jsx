<<<<<<< HEAD
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { TypingText } from '../components/TypingText';
import { thaData } from '../data/thaData';
import { impactStats } from '../data/statsData';

const CountUp = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export const Home = () => {
  const [activeCard, setActiveCard] = useState(null);

  const impactStatsDisplay = [
    { label: 'People Reached', value: impactStats.peopleReached, suffix: '+' },
    { label: 'Active Partnerships', value: impactStats.partnerships, suffix: '' },
    { label: 'Regions Served', value: impactStats.regions, suffix: '' },
    { label: 'Years Active', value: impactStats.getYearsActive(), suffix: '' },
  ];

  const focusAreas = thaData.thematicAreas.map((area, index) => ({
    title: area.name,
    icon: index === 0 ? 'local_hospital' : index === 1 ? 'favorite' : 'psychology',
    description: area.approach.join('. '),
    color: index === 0 ? 'from-blue-500 to-blue-600' : index === 1 ? 'from-red-500 to-red-600' : 'from-purple-500 to-purple-600'
  }));

  const latestNews = [
    {
      id: 1,
      title: 'World Hepatitis Day 2025: Zero Hepatitis by 2030',
      excerpt: 'Join us for a community awareness campaign across Dar es Salaam.',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      date: 'March 28, 2026',
      category: 'Events'
    },
    {
      id: 2,
      title: 'New Mental Health Clinic Opens in Mwanza',
      excerpt: 'Expanding our services to provide comprehensive mental health support.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      date: 'March 25, 2026',
      category: 'Announcements'
    },
    {
      id: 3,
      title: 'Partnership with Ministry of Health Strengthened',
      excerpt: 'Collaborative efforts to improve healthcare outcomes nationwide.',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
      date: 'March 20, 2026',
      category: 'Press Release'
    },
  ];

  const partners = [
    'WHO', 'World Hepatitis Alliance', 'UNAIDS', 'PEPFAR', 'Global Fund',
    'CDC', 'USAID', 'MoH Tanzania', 'WHO', 'World Hepatitis Alliance'
  ];

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section with Video Background */}
      <section className="relative h-[85vh] md:h-screen flex items-center overflow-hidden bg-primary">
        {/* Video Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/90 z-10"></div>
          {/* TODO: Replace with actual video background */}
          {/* <video autoPlay muted loop className="w-full h-full object-cover">
            <source src="YOUR_VIDEO_URL" type="video/mp4" />
          </video> */}
          <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark"></div>
          {/* TODO: Replace with your healthcare photo - recommended 1920x1080px */}
          <img 
            src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&q=80"
            alt="Healthcare in Tanzania"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        </div>

        {/* Hero Content */}
        <div className="container-custom relative z-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight min-h-[120px] md:min-h-[160px]">
              <TypingText text={thaData.motto} speed={80} loop={true} />
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              {thaData.heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/make-a-difference" className="btn-primary text-lg">
                Get Involved
                <Icon name="arrow_forward" size={24} />
              </Link>
              <Link to="/about" className="btn-secondary bg-white/10 text-white border-white hover:bg-white hover:text-primary text-lg">
                Learn More
                <Icon name="info" size={24} />
=======
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
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
              </Link>
            </div>
          </div>
        </div>
<<<<<<< HEAD

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-gradient-to-br from-secondary to-secondary-dark text-white -mt-20 relative z-10">
        <div className="container-custom section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {impactStatsDisplay.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300 card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-5xl font-bold mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm md:text-base text-white/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Focus */}
      <section className="section-padding bg-neutral">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="heading-lg mb-4">Our Focus Areas</h2>
            <p className="body-lg max-w-3xl mx-auto">
              We address critical health challenges through targeted programs and community partnerships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {focusAreas.map((area, index) => (
              <div
                key={area.title}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 card-hover cursor-pointer"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="p-8 md:p-10">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon name={area.icon} size={32} className="text-white" />
                  </div>
                  <h3 className="heading-sm mb-3">{area.title}</h3>
                  <p className="body-md text-neutral-dark/70 leading-relaxed">
                    {area.description}
                  </p>
                  <div className={`flex items-center gap-2 mt-6 text-primary font-semibold transition-all duration-300 ${
                    activeCard === index ? 'translate-x-2' : ''
                  }`}>
                    Learn More
                    <Icon name="arrow_forward" size={20} />
                  </div>
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
=======
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
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
<<<<<<< HEAD
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="heading-lg mb-4">Latest News</h2>
              <p className="body-lg">Stay updated with our recent activities and announcements</p>
            </div>
            <Link to="/news" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:text-secondary transition-colors">
              View All
              <Icon name="arrow_forward" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {latestNews.map((news) => (
              <article key={news.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 card-hover">
                <div className="img-zoom-container h-56">
                  <img 
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover img-zoom"
                  />
                </div>
                <div className="p-6">
                  <div className="badge badge-category mb-3">{news.category}</div>
                  <h3 className="heading-sm mb-3 line-clamp-2 group-hover:text-secondary transition-colors">
                    {news.title}
                  </h3>
                  <p className="body-md text-neutral-dark/70 mb-4 line-clamp-2">
                    {news.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-neutral-dark/60">
                      <Icon name="calendar_today" size={16} />
                      {news.date}
                    </div>
                    <Icon name="arrow_forward" size={20} className="text-secondary group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/news" className="btn-primary">
              View All News
              <Icon name="arrow_forward" size={20} />
            </Link>
=======
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
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Featured Academy Resource */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-light text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="badge badge-new mb-6 mx-auto">New Resource</div>
            <h2 className="heading-lg text-white mb-4">Latest from THA Academy</h2>
            <p className="text-xl text-white/90 mb-8">
              WHO Guidelines: Comprehensive Hepatitis B and C Testing Services
            </p>
            <p className="body-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Access the latest evidence-based guidelines for hepatitis testing, diagnosis, and care coordination in resource-limited settings.
            </p>
            <Link to="/academy" className="btn-primary bg-white text-primary hover:bg-neutral">
              Access Resource
              <Icon name="download" size={20} />
            </Link>
=======
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
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Partners Marquee */}
      <section className="section-padding bg-neutral overflow-hidden">
        <div className="container-custom mb-12">
          <h2 className="heading-md text-center">Our Partners</h2>
        </div>
        
        <div className="marquee-container">
          <div className="marquee-content">
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={index}
                className="inline-flex items-center justify-center px-8 md:px-12"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary/30 hover:text-secondary transition-colors whitespace-nowrap">
                  {partner}
                </div>
=======
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
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
              </div>
            ))}
          </div>
        </div>
      </section>
<<<<<<< HEAD
    </div>
  );
};
=======
    </>
  )
}
>>>>>>> 5ac31723d5b9b56bde9fed84c9a0ddf1a28941a9
