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
            </div>
          </div>
        </div>
      </section>

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
              </p>
            </div>
          </div>
        </div>
      </section>

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
              </div>
            ))}
          </div>
        </div>
      </section>

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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
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
              </div>
            ))}
          </div>
        </div>
      </section>

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
