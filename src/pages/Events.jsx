import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiUrl } from '../lib/api';
import { SEO } from '../components/SEO';
import { ShareButtons } from '../components/ShareButtons';

const displayDate = value => new Date(value).toLocaleDateString('en-TZ', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Dar_es_Salaam'
});
function Pricing({ event }) {
  return Array.isArray(event.feeOptions) && event.feeOptions.length ? (
    <div className="grid grid-cols-2 gap-3">
      {event.feeOptions.map((option, index) => (
        <div className="rounded-xl border border-gray-200 bg-white p-4" key={index}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{option.label}</p>
          <p className="mt-2 text-xl font-bold text-primary">{option.price}</p>
        </div>
      ))}
    </div>
  ) : event.fee ? <p className="text-2xl font-bold text-primary">{event.fee}</p> : null;
}
function Registration({ event }) {
  return event.status === 'registration_open' && event.registrationUrl ? (
    <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer"
      className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-primary-dark">
      Register to Join
    </a>
  ) : <span className="block rounded-lg bg-gray-100 px-4 py-3 text-center font-medium text-gray-700">
    {event.status === 'completed' ? 'Event completed' : 'Registration unavailable'}
  </span>;
}
export default function Events() {
  const { slug } = useParams();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetch(apiUrl(slug ? '/api/events/' + encodeURIComponent(slug) : '/api/events'))
      .then(response => { if (!response.ok) throw Error('Unable to load events'); return response.json(); })
      .then(result => { if (active) setEvents(slug ? (result.event ? [result.event] : []) : result.events || []); })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);
  const event = slug ? events[0] : null;
  return <main className="min-h-screen bg-cool-gray pt-14 md:pt-16">
    <SEO title={event?.title || 'Events & Bootcamps'} canonicalPath={slug ? '/events/' + slug : '/events'}
      description="Discover Tanzania Health Alliance events, bootcamps and community programmes." />
    <section className="bg-gradient-to-br from-primary to-primary-dark py-14 text-white md:py-20">
      <div className="container-custom">
        {slug && <Link to="/events" className="mb-5 inline-block text-sm font-semibold text-white/80 hover:text-white">← All events</Link>}
        <div className={slug ? 'max-w-4xl' : 'mx-auto max-w-3xl text-center'}>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white/80">THA Events & Bootcamps</p>
          <h1 className="heading-xl text-white">{event?.title || 'Events & Bootcamps'}</h1>
          {!slug && <p className="mt-5 text-lg text-white/90">Explore upcoming programmes, leadership experiences and community events.</p>}
          {event && <p className="mt-5 text-base text-white/90">{displayDate(event.startAt)} – {displayDate(event.endAt)} · {event.location}</p>}
        </div>
      </div>
    </section>
    <section className="section-padding">
      <div className="container-custom">
        {loading && <p className="text-gray-600">Loading events…</p>}
        {error && <p role="alert" className="rounded-lg bg-white p-5 text-red-700">{error}</p>}
        {!loading && !error && !events.length && <p className="rounded-xl bg-white p-8 text-center">No events available yet.</p>}
        {slug ? event && <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <article className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-card">
            {event.imageUrl && <div className="bg-gray-50 p-4 md:p-6">
              <img src={event.imageUrl} alt={event.title + ' event poster'} className="mx-auto max-h-[640px] w-full object-contain" />
            </div>}
            <div className="p-6 md:p-10">
              <h2 className="heading-md mb-5">About the event</h2>
              <div className="whitespace-pre-line break-words text-base leading-8 text-gray-700">{event.description}</div>
              {event.organizers && <p className="mt-7 border-t pt-5 text-sm text-gray-600"><strong>Organized by:</strong> {event.organizers}</p>}
              <div className="mt-7"><ShareButtons title={event.title} url={typeof window !== 'undefined' ? window.location.href : ''}/></div>
            </div>
          </article>
          <aside className="rounded-2xl bg-white p-6 shadow-card lg:sticky lg:top-24">
            <p className="mb-5 text-sm font-semibold uppercase tracking-wide text-primary">{event.status.replaceAll('_',' ')}</p>
            <h2 className="mb-4 text-xl font-bold">Event details</h2>
            <dl className="space-y-4 text-sm">
              <div><dt className="font-semibold text-gray-500">Dates</dt><dd className="mt-1 font-medium">{displayDate(event.startAt)} – {displayDate(event.endAt)}</dd></div>
              <div><dt className="font-semibold text-gray-500">Location</dt><dd className="mt-1 font-medium">{event.location}</dd></div>
            </dl>
            {(event.feeOptions?.length > 0 || event.fee) && <div className="my-6 border-t pt-5"><p className="mb-3 text-sm font-semibold text-gray-500">Participation fees</p><Pricing event={event}/></div>}
            <div className="mt-6"><Registration event={event}/></div>
            {event.newsUrl && <a href={event.newsUrl} className="mt-4 inline-block text-sm font-semibold text-primary underline">Read event report</a>}
          </aside>
        </div> : <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map(item => <article key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-card">
            {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="h-60 w-full bg-gray-50 object-contain" loading="lazy"/>}
            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">{item.status.replaceAll('_', ' ')}</p>
              <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
              <p className="mt-3 text-sm text-gray-600">{displayDate(item.startAt)} – {displayDate(item.endAt)}</p>
              <p className="mt-2 text-sm text-gray-600">{item.location}</p>
              <Link to={'/events/' + item.slug} className="mt-5 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white">View event details</Link>
            </div>
          </article>)}
        </div>}
      </div>
    </section>
  </main>;
}
