import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import campaigns from '../data/campaigns.json';
import partners from '../data/partners.json';
import testimonials from '../data/testimonials.json';
import { PartnersCarousel } from '../components/PartnersCarousel';
import { TestimonialsCarousel } from '../components/TestimonialCarousel';
import { thaData } from '../data/thaData';
import { newsArticles } from '../data/newsData';
import NewsCard from '../components/NewsCard';

/* =========================
   Typing Animation
========================= */
const TypingText = ({ text, speed = 40 }) => {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{display}</span>;
};

/* =========================
   Scroll Reveal Hook
========================= */
const useReveal = () => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setShow(true);
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return [ref, show];
};

/* =========================
   Counter
========================= */
const Counter = ({ end }) => {
  const [ref, visible] = useReveal();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = Date.now();
    const t = setInterval(() => {
      const p = Math.min((Date.now() - start) / 1500, 1);
      setCount(Math.floor(p * end));
      if (p === 1) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [visible, end]);

  return <div ref={ref} className="text-4xl font-bold text-secondary">{count}+</div>;
};

export const Home = () => {

  const impactStats = [
    { label: 'Volunteers', value: 2 },
    { label: 'Donations', value: 2 },
    { label: 'Projects', value: 4 },
    { label: 'Missions', value: 20 },
  ];

  return (
    <div className="pt-16 bg-cool-gray">

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <img
          src="/images/hero-bg.jpg"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-dark/80" />

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-hero-lg text-white font-bold mb-6">
            <TypingText text="Together for a Healthier Tanzania" />
          </h1>

          <p className="text-white/90 mb-8">
            Advocacy, awareness, and access to healthcare.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/about" className="btn-primary">Learn More</Link>
            <Link to="/contact" className="btn-outline">Contact</Link>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="py-20 bg-white">
        <div className="grid md:grid-cols-4 gap-10 max-w-7xl mx-auto px-4">
          {impactStats.map((s) => (
            <div key={s.label} className="text-center">
              <Counter end={s.value} />
              <p>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMS (Premium Cards Restored) */}
      <section className="py-20 bg-cool-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl text-center mb-12 font-bold">Our Programs</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {campaigns.campaigns.map((c) => (
              <div
                key={c.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500"
              >
                {/* Gradient Header */}
                <div className="h-52 bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative">
                  <Icon name="favorite" size={40} color="white" />
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-primary">{c.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{c.description}</p>

                  <Link
                    to={`/campaigns/${c.id}`}
                    className="flex justify-between items-center bg-primary text-white px-4 py-2 rounded"
                  >
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OBJECTIVES (Reveal Animation) */}
      <section className="py-20 bg-white">
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
          {thaData.objectives.map((obj, i) => {
            const [ref, show] = useReveal();
            return (
              <div
                key={i}
                ref={ref}
                className={`p-6 bg-cool-gray rounded transition duration-700 ${
                  show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                {obj}
              </div>
            );
          })}
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-20 bg-white">
        <PartnersCarousel partners={partners.partners} />
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-cool-gray">
        <TestimonialsCarousel testimonials={testimonials.testimonials} />
      </section>

      {/* NEWS */}
      <section className="py-20 bg-white">
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
          {newsArticles.map((n) => (
            <NewsCard key={n.id} news={n} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white text-center">
        <h2 className="text-3xl mb-6 font-bold">Get Involved</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/make-a-difference" className="btn-secondary">Volunteer</Link>
          <Link to="/make-a-difference" className="btn-secondary">Donate</Link>
          <Link to="/contact" className="btn-secondary">Partner</Link>
        </div>
      </section>

    </div>
  );
};