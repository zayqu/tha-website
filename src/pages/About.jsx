import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PartnersCarousel } from '../components/PartnersCarousel';
import teamData from '../data/teamData.json';
import teamJson from '../data/team.json';
import partners from '../data/partners.json';
import { thaData } from '../data/thaData';

/* =========================
   Scroll Reveal Hook
========================= */
const useReveal = () => {
  const [ref, setRef] = React.useState(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setShow(true);
    });
    if (ref) observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return [setRef, show];
};

const CoreValueCard = ({ value, index }) => {
  const [ref, show] = useReveal();
  return (
    <div
      ref={ref}
      className={`bg-cool-gray rounded-xl p-6 border-l-4 border-secondary hover:shadow-card transition-all ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Icon name={value.icon} size={32} category="secondary" className="mb-4" />
      <h3 className="text-lg font-bold text-primary mb-2">{value.value}</h3>
      <p className="text-sm text-gray-600">{value.description}</p>
    </div>
  );
};

export const About = () => {
  const coreValues = [
    {
      value: "Compassion",
      icon: "favorite",
      description: "We lead with empathy and care for every individual and community we serve."
    },
    {
      value: "Integrity",
      icon: "shield",
      description: "We uphold honesty, transparency, and ethical practices in all our work."
    },
    {
      value: "Equity",
      icon: "balance",
      description: "We ensure fair access to health resources and opportunities for all."
    },
    {
      value: "Collaboration",
      icon: "groups",
      description: "We work together with partners, communities, and stakeholders to achieve shared goals."
    },
    {
      value: "Innovation",
      icon: "lightbulb",
      description: "We embrace creative solutions and evidence-based approaches to health challenges."
    },
    {
      value: "Empowerment",
      icon: "psychology",
      description: "We enable communities and individuals to take charge of their health and well-being."
    },
    {
      value: "Excellence",
      icon: "star",
      description: "We strive for the highest standards in everything we do to create lasting impact."
    }
  ];

  return (
    <div className="pt-16 bg-cool-gray">

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            About Tanzania Health Alliance
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Dedicated to transforming health outcomes and strengthening health systems across Tanzania through advocacy, research, and community engagement.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="h-80 md:h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                  <Icon name="person" size={64} category="primary" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-card">
                <p className="font-bold text-primary">Shaibu Issa</p>
                <p className="text-sm text-gray-600">Founder</p>
              </div>
            </div>

            {/* Story */}
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Founder's Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
                From Personal Loss to Global Impact
              </h2>

              <div className="text-xl italic text-gray-700 border-l-4 border-accent pl-6 mb-6 leading-relaxed">
                "In 2021, I lost my brother to a preventable liver disease. That loss became my calling—to ensure that no other family experiences the heartbreak we did."
              </div>
              <p className="text-gray-600 mb-4 text-lg">
                <strong>— Shaibu Issa, {thaData.founder.title}</strong>
              </p>

              <div className="space-y-4 text-gray-700">
                <p>{thaData.founder.story}</p>
              </div>

              {/* Key Recognition */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-cool-gray rounded-lg p-4 flex items-center gap-3">
                  <Icon name="film" size={32} category="accent" />
                  <div>
                    <p className="font-bold text-sm">WHO Documentary</p>
                    <p className="text-xs text-gray-500">Featured in 2025</p>
                  </div>
                </div>
                <div className="bg-cool-gray rounded-lg p-4 flex items-center gap-3">
                  <Icon name="award" size={32} category="secondary" />
                  <div>
                    <p className="font-bold text-sm">WHA Board Member</p>
                    <p className="text-xs text-gray-500">Elected Nov 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 border-t-4 border-primary">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="track_changes" size={28} category="primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Our Mission</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {thaData.mission}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 border-t-4 border-secondary">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Icon name="visibility" size={28} category="secondary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Our Vision</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {thaData.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">What Guides Us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2">Our Core Values</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <CoreValueCard key={index} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Leadership</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2">Our Team</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamJson.team.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-elevated transition-all">
                {/* Photo */}
                <div className="h-56 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                  <div className="w-24 h-24 rounded-full bg-white/50 flex items-center justify-center">
                    <Icon name="person" size={48} category="primary" />
                  </div>
                  {/* Social Links */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {member.linkedIn && (
                      <a href={member.linkedIn} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-subtle hover:bg-primary hover:text-white transition">
                        <Icon name="linkedin" size={16} />
                      </a>
                    )}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-subtle hover:bg-primary hover:text-white transition">
                        <Icon name="instagram" size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-secondary font-semibold text-sm mb-4">{member.title}</p>

                  {/* Credentials */}
                  {member.credentials && member.credentials.length > 0 && (
                    <div className="mb-4">
                      <ul className="space-y-1">
                        {member.credentials.slice(0, 3).map((cred, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <Icon name="check_circle" size={14} category="secondary" className="mt-0.5 flex-shrink-0" />
                            <span>{cred}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 line-clamp-3">{member.bioShort}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Collaboration</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2">Our Partners</h2>
            <p className="text-gray-600 mt-4">Working with global and local organizations to advance health outcomes</p>
          </div>

          <PartnersCarousel partners={partners.partners} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Join Our Movement
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Tanzania Health Alliance is building a healthier future. Be part of our mission to strengthen health systems and save lives across Tanzania.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/make-a-difference" className="px-8 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary-dark transition">
              Get Involved
            </Link>
            <Link to="/contact" className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};