import { Icon } from '../components/Icon';
import { Link } from 'react-router-dom';

export const About = () => {
  const timeline = [
    {
      year: 2018,
      title: 'Foundation',
      description: 'Tanzania Health Alliance founded by Shaibu Issa after losing his brother to preventable liver disease.',
      icon: 'calendar_today'
    },
    {
      year: 2019,
      title: 'First Initiatives',
      description: 'Launched hepatitis awareness campaigns in Dar es Salaam and surrounding regions.',
      icon: 'favorite'
    },
    {
      year: 2021,
      title: 'Expansion',
      description: 'Extended reach to 8 regions across Tanzania with focus on HIV and mental health.',
      icon: 'groups'
    },
    {
      year: 2023,
      title: 'Academy Launch',
      description: 'Established THA Academy for health education with WHO guidelines and research resources.',
      icon: 'school'
    },
    {
      year: 2024,
      title: 'Today',
      description: 'Serving 50,000+ people with 25+ partner organizations across Tanzania.',
      icon: 'track_changes'
    }
  ];

  const team = [
    {
      name: 'Shaibu Issa',
      title: 'Founder & Executive Director',
      bio: 'Health advocate dedicating his life to strengthening Tanzania\'s health systems after personal loss.',
      image: 'YOUR_FOUNDER_IMAGE_PATH'
    },
    {
      name: 'Dr. Jane Mwangi',
      title: 'Head of Programs',
      bio: 'Public health specialist with 10+ years experience in East African health systems.',
      image: 'YOUR_TEAM_IMAGE_PATH'
    },
    {
      name: 'David Kimani',
      title: 'Head of Academy',
      bio: 'Education specialist focused on making health information accessible to all.',
      image: 'YOUR_TEAM_IMAGE_PATH'
    },
    {
      name: 'Grace Moshi',
      title: 'Community Engagement Manager',
      bio: 'Community organizer passionate about grassroots health advocacy.',
      image: 'YOUR_TEAM_IMAGE_PATH'
    }
  ];

  return (
    <div className="pt-16 bg-cool-gray">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-hero-lg font-heading font-bold tracking-tighter mb-6 animate-fade-up">
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
            {/* Image - placeholder */}
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
                What began as personal grief transformed into a mission. Tanzania Health Alliance was founded on the belief that every person deserves access to quality health information and services. We work tirelessly to break down barriers to healthcare, combat stigma, and strengthen the health systems that serve Tanzania's diverse communities.
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
                To strengthen Tanzania's health systems through community education, advocacy, and partnerships that promote disease prevention, health equity, and improved outcomes for all Tanzanians.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-lg shadow-card p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <Icon name="visibility" size={40} category="secondary" />
                <h3 className="text-2xl font-bold text-primary">Our Vision</h3>
              </div>
              <p className="body-md">
                A Tanzania where every person has the knowledge, resources, and access to health services they need to live healthy, fulfilling lives free from preventable disease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter text-center mb-16">
            Our Journey
          </h2>

          <div className="relative">
            {/* Timeline line - only visible on desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary to-secondary"></div>

            {/* Timeline items */}
            {timeline.map((item, index) => (
              <div key={item.year} className={`mb-12 md:mb-20 ${index % 2 === 0 ? 'md:text-right md:pr-1/2 md:pr-12' : 'md:text-left md:pl-1/2 md:pl-12'}`}>
                {/* Timeline dot */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-secondary rounded-full border-4 border-white shadow-md top-0"></div>

                {/* Content */}
                <div className="bg-cool-gray rounded-lg p-6 md:p-8 shadow-card hover:shadow-elevated transition">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name={item.icon} size={28} category="primary" />
                    <h3 className="text-2xl font-bold text-primary">{item.year}</h3>
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-2">{item.title}</h4>
                  <p className="body-md">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter text-center mb-12">
            Our Team
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-elevated transition-all hover:scale-105">
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-gray-400 text-center text-sm">{member.name}'s Photo</span>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-primary mb-1">{member.name}</h3>
                  <p className="text-secondary font-semibold text-sm mb-3">{member.title}</p>
                  <p className="body-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter text-center mb-12">
            Our Partners
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i}
                className="h-32 bg-cool-gray rounded-lg flex items-center justify-center shadow-subtle hover:shadow-card transition cursor-pointer group"
              >
                <div className="text-center opacity-60 group-hover:opacity-100 transition">
                  <div className="text-gray-400 text-sm font-semibold mb-2">Partner {i + 1}</div>
                  <span className="text-xs text-gray-500">Partnership Type</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Report */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex gap-12 items-center">
            {/* Report Cover - placeholder */}
            <div className="md:w-1/3 h-64 md:h-96 bg-white/20 rounded-lg flex items-center justify-center mb-8 md:mb-0">
              <span className="text-white/50">Annual Report Cover</span>
            </div>

            {/* Content */}
            <div className="md:w-2/3">
              <h3 className="text-3xl font-heading font-bold tracking-tighter mb-4">
                2024 Annual Report
              </h3>
              <p className="text-white/90 mb-6">
                Discover our comprehensive impact report showcasing the lives we've touched, lessons learned, and strategic priorities for the coming year.
              </p>
              <button className="px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition inline-flex items-center gap-2">
                <Icon name="download" size={20} />
                Download Report (PDF)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-cool-gray">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-hero-md font-heading font-bold tracking-tighter mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="body-md mb-8 max-w-2xl mx-auto">
            Join Tanzania Health Alliance in our mission to transform health outcomes across the country.
          </p>
          <Link to="/make-a-difference" className="px-8 py-3 bg-secondary text-white font-bold rounded-md hover:bg-secondary-dark transition inline-flex items-center gap-2">
            Get Involved <Icon name="arrow_forward" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};
