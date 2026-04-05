import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import teamData from '../data/teamData.json';

export const About = () => {
  return (
    <div className="pt-16 bg-cool-gray">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-hero-lg font-heading font-bold tracking-tighter mb-6">
            About Tanzania Health Alliance
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Dedicated to transforming health outcomes and strengthening health systems across Tanzania.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="h-64 md:h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Founder Portrait - TODO: Add image</span>
            </div>

            {/* Story */}
            <div>
              <div className="text-lg md:text-2xl italic text-primary font-heading mb-6 leading-relaxed">
                "In 2021, I lost my brother to a preventable liver disease. That loss became my calling—to ensure that no other family experiences the heartbreak we did."
              </div>
              <p className="text-gray-600 mb-4">
                <strong>— Shaibu Issa, Founder</strong>
              </p>
              <p className="body-md mb-4">
                What began as personal grief transformed into a mission. Tanzania Health Alliance was founded on the belief that every person deserves access to quality health information and services.
              </p>
              <p className="body-md">
                Our work is guided by evidence, driven by compassion, and measured by real impact on people's lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white rounded-lg shadow-card p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <Icon name="track_changes" size={40} category="primary" />
                <h3 className="text-2xl font-bold text-primary">Our Mission</h3>
              </div>
              <p className="body-md">
                To strengthen Tanzania's health systems through community education, advocacy, and partnerships that promote disease prevention and health equity.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-lg shadow-card p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <Icon name="visibility" size={40} category="secondary" />
                <h3 className="text-2xl font-bold text-primary">Our Vision</h3>
              </div>
              <p className="body-md">
                A Tanzania where every person has the knowledge and resources to live healthy, fulfilling lives free from preventable disease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter text-center mb-16">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamData.coreValues.map((value, index) => (
              <div key={index} className="bg-cool-gray rounded-lg p-6 md:p-8 border-l-4 border-secondary hover:shadow-card transition">
                <h3 className="text-lg font-bold text-primary">{value}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter text-center mb-12">
            Our Leadership Team
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamData.team.map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-elevated transition-all">
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-gray-400 text-center text-sm px-2">{member.name}'s Photo</span>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-secondary font-semibold text-sm mb-3">{member.title}</p>
                  <p className="body-sm text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter mb-6">
            Join Our Movement
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Tanzania Health Alliance is building a healthier future. Be part of our mission to strengthen health systems and save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/make-a-difference" className="px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition">
              Get Involved
            </Link>
            <Link to="/contact" className="px-8 py-3 border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-primary transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
