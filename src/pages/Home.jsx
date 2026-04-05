import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import campaigns from '../data/campaigns.json';
import impact from '../data/impact.json';
import partners from '../data/partners.json';
import stories from '../data/stories.json';

const AnimatedCounter = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true);
      }
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress === 1) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-secondary">
      {count.toLocaleString()}+
    </div>
  );
};

export const Home = () => {
  // Real impact metrics from actual THA data
  const impactStats = [
    { label: 'Volunteers', value: 2 },
    { label: 'Donations', value: 2 },
    { label: 'Projects', value: 4 },
    { label: 'Missions', value: 20 },
  ];

  return (
    <div className="pt-16 bg-cool-gray">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark overflow-hidden">
        {/* Background video placeholder - TODO: add video */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-hero-lg font-heading font-bold tracking-tighter text-white mb-6 animate-fade-up">
            Together for a Healthier Tanzania
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto opacity-animation">
            We work to combat the challenges of Viral Hepatitis, HIV, and Mental Health through advocacy, awareness, and access to care across Tanzania.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link to="/about" className="px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition shadow-card">
              Learn More
            </Link>
            <Link to="/contact" className="px-8 py-3 border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-primary transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Bar */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12">
            {impactStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <AnimatedCounter end={stat.value} />
                <p className="text-gray-600 font-medium mt-3">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Programs Section */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter text-center mb-4">
            Our Programs
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Real solutions to real health challenges in Tanzania
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {campaigns.campaigns.map((campaign) => (
              <div 
                key={campaign.id}
                className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-elevated transition-all duration-300"
              >
                <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center border-b-4 border-secondary">
                  <Icon name="favorite" size={64} category="secondary" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-primary">
                    {campaign.name}
                  </h3>
                  <p className="text-secondary font-bold mb-3 text-sm">{campaign.tagline}</p>
                  <p className="text-gray-600 body-md mb-4">
                    {campaign.description}
                  </p>
                  
                  <Link 
                    to={`/campaigns/${campaign.id}`}
                    className="inline-block w-full text-center px-4 py-2 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Causes */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter">
              Featured Causes
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-cool-gray rounded-lg shadow-card overflow-hidden hover:shadow-elevated transition-shadow p-6">
              <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <Icon name="favorite" size={24} color="white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Hepatitis Awareness & Prevention</h3>
              <p className="text-gray-600 body-md">
                Viral hepatitis is a silent epidemic in Tanzania, with thousands unaware of their infection status. Through screenings, vaccinations, and education, we are working to eliminate hepatitis and prevent liver-related illnesses.
              </p>
            </div>

            <div className="bg-cool-gray rounded-lg shadow-card overflow-hidden hover:shadow-elevated transition-shadow p-6">
              <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <Icon name="psychology" size={24} color="white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Community Health Education</h3>
              <p className="text-gray-600 body-md">
                Knowledge is the first step toward better health. We empower communities with essential information on disease prevention, hygiene, nutrition, and mental well-being to foster healthier lives.
              </p>
            </div>

            <div className="bg-cool-gray rounded-lg shadow-card overflow-hidden hover:shadow-elevated transition-shadow p-6">
              <div className="h-12 w-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                <Icon name="groups" size={24} color="white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary">Healthcare Access & Advocacy</h3>
              <p className="text-gray-600 body-md">
                Quality healthcare should be accessible to all. We advocate for policy changes, support medical infrastructure, and provide essential services to underserved communities, ensuring no one is left behind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter mb-12 text-center">
            Who We Are
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-primary">Our Vision</h3>
              <p className="text-gray-600 body-md leading-relaxed">
                To achieve a healthier Tanzania where every individual has access to equitable and quality healthcare.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-primary">Our Mission</h3>
              <p className="text-gray-600 body-md leading-relaxed">
                To advance public health through advocacy, capacity building, research, and partnerships, contributing to sustainable and resilient healthcare systems in Tanzania.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-primary">About THA</h3>
              <p className="text-gray-600 body-md leading-relaxed">
                Tanzania Health Alliance (THA) is a registered NGO (No. 00NGO/R/8379) based in Dar es Salaam, dedicated to tackling key health challenges in Tanzania.
              </p>
            </div>
          </div>

          {/* Founder Story */}
          <div className="mt-16 bg-white rounded-lg shadow-elevated p-12 border-l-4 border-secondary">
            <h3 className="text-2xl font-bold mb-4 text-primary">Our Story</h3>
            <p className="text-gray-600 body-md leading-relaxed mb-4">
              The Tanzania Health Alliance was founded with a transformational goal: to save lives and address the pressing health challenges facing Tanzanian communities.
            </p>
            <p className="text-gray-600 body-md leading-relaxed">
              Our Founder and Executive Director, Shaibu Issa, lost his brother to liver cancer in 2021 – a preventable disease if diagnosed early or prevented through vaccination. Having personally faced hepatitis B and the stigma associated with it, Shaibu was driven to ensure no one else suffers from preventable diseases due to misinformation, late detection, or stigma. This personal experience ignited his passion to create an organization that raises awareness, promotes prevention, and strengthens access to healthcare for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter mb-2">
            Our Partners
          </h2>
          <p className="text-gray-600">Working together to strengthen health systems in Tanzania</p>
        </div>
        <div className="bg-cool-gray py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {partners.partners.map((partner, idx) => (
                <a 
                  key={partner.id || idx}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-24 bg-white rounded-lg shadow-subtle hover:shadow-card transition cursor-pointer group"
                >
                  <span className="font-bold text-center px-3 text-sm group-hover:text-secondary transition">
                    {partner.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter mb-6">
            Get Involved
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join us in creating a healthier Tanzania!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <Icon name="groups" size={48} color="white" className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Volunteer</h3>
              <p className="text-white/90 mb-6">Be part of our life saving initiatives.</p>
              <Link to="/make-a-difference" className="inline-block px-6 py-2 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition">
                Get Started
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <Icon name="favorite" size={48} color="white" className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Donate</h3>
              <p className="text-white/90 mb-6">Support our mission with a contribution.</p>
              <Link to="/make-a-difference" className="inline-block px-6 py-2 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition">
                Donate Now
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
              <Icon name="person" size={48} color="white" className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Partner</h3>
              <p className="text-white/90 mb-6">Work with us to create sustainable healthcare solutions.</p>
              <Link to="/contact" className="inline-block px-6 py-2 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition">
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
