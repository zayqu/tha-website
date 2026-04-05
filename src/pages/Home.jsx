import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';

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
  const impactStats = [
    { label: 'People Reached', value: 50000 },
    { label: 'Partnerships', value: 25 },
    { label: 'Regions', value: 8 },
    { label: 'Years Active', value: 6 },
  ];

  const focusAreas = [
    {
      id: 'hepatitis',
      title: 'Hepatitis',
      icon: 'local_hospital',
      category: 'hepatitis',
      description: 'Raising awareness and prevention strategies for viral hepatitis across Tanzania.',
    },
    {
      id: 'hiv',
      title: 'HIV/AIDS',
      icon: 'favorite',
      category: 'hiv',
      description: 'Comprehensive support and education programs for HIV prevention and treatment.',
    },
    {
      id: 'mental',
      title: 'Mental Health',
      icon: 'psychology',
      category: 'mental',
      description: 'Promoting mental wellbeing and addressing stigma in our communities.',
    },
    {
      id: 'healthcare',
      title: 'Healthcare Access',
      icon: 'groups',
      category: 'primary',
      description: 'Ensuring equitable access to quality healthcare services for all Tanzanians.',
    },
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
            Transforming Health Outcomes Across Tanzania
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto opacity-animation">
            Tanzania Health Alliance works to strengthen health systems through education, advocacy, and community engagement in the regions we serve.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link to="/make-a-difference" className="px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition shadow-card">
              Get Involved
            </Link>
            <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-primary transition">
              Learn More
            </button>
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

      {/* Our Focus Section */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter text-center mb-12">
            Our Focus Areas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {focusAreas.map((area) => (
              <div 
                key={area.id}
                className="bg-white rounded-lg shadow-card p-6 hover:shadow-elevated hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-center mb-4">
                  <Icon name={area.icon} size={48} category={area.category} />
                </div>
                <h3 className="text-xl font-bold text-center mb-3 text-primary">
                  {area.title}
                </h3>
                <p className="text-center text-gray-600 body-sm">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter">
              Latest News
            </h2>
            <Link to="/news" className="text-secondary font-bold hover:text-secondary-dark transition flex items-center gap-2">
              View All <Icon name="arrow_forward" size={20} />
            </Link>
          </div>
          
          {/* News Grid Placeholder - TODO: implement with dynamic data */}
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-cool-gray rounded-lg shadow-card overflow-hidden hover:shadow-elevated transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-gray-400">News Image {i}</span>
                </div>
                <div className="p-6">
                  <p className="text-secondary font-bold text-sm mb-2">Announcement</p>
                  <h3 className="text-lg font-bold mb-3">News Headline {i}</h3>
                  <p className="text-gray-600 body-sm mb-4">Brief description of the news article goes here...</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>April 5, 2024</span>
                    <Icon name="arrow_forward" size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy Highlight */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-elevated overflow-hidden md:flex">
            <div className="md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <span className="text-gray-400">Academy Resource Image</span>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block w-fit mb-4 px-3 py-1 bg-secondary/10 text-secondary font-bold text-sm rounded-full">
                NEW RESOURCE
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold tracking-tighter mb-4">
                Health Education & Research
              </h3>
              <p className="body-md text-gray-600 mb-6">
                Access our comprehensive library of WHO guidelines, research papers, training materials, and policy documents to stay informed on the latest in health.
              </p>
              <Link to="/academy" className="flex items-center gap-2 text-secondary font-bold hover:text-secondary-dark transition w-fit">
                Explore Academy <Icon name="arrow_forward" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee - TODO: implement with real logos */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter mb-2">
            Our Partners
          </h2>
          <p className="text-gray-600">Working together to strengthen health systems in Tanzania</p>
        </div>
        <div className="bg-cool-gray py-12 overflow-hidden">
          <div className="flex gap-12 animate-marquee">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-32 h-16 bg-white rounded-lg flex items-center justify-center shadow-subtle hover:shadow-card transition cursor-pointer opacity-60 hover:opacity-100">
                <span className="text-gray-400 text-sm">Partner {i + 1}</span>
              </div>
            ))}
            {[...Array(8)].map((_, i) => (
              <div key={`duplicate-${i}`} className="flex-shrink-0 w-32 h-16 bg-white rounded-lg flex items-center justify-center shadow-subtle hover:shadow-card transition cursor-pointer opacity-60 hover:opacity-100">
                <span className="text-gray-400 text-sm">Partner {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter mb-6">
            Join the Alliance
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Become a member and help us create lasting health impact in Tanzania. Whether you're an individual, organization, or healthcare professional, there's a way for you to get involved.
          </p>
          <button className="px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition shadow-card">
            Become a Member
          </button>
        </div>
      </section>
    </div>
  );
};
