import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const policies = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'How Tanzania Health Alliance handles information shared through this website.',
    sections: [
      ['Information we collect', 'We collect information that you voluntarily provide through contact, registration, partnership, volunteer, donation, and administrative forms. We may also collect limited technical information needed to keep the website secure and reliable.'],
      ['How information is used', 'Information is used to respond to requests, manage participation in THA activities, operate the website, protect accounts, and improve our public-health programmes and communications.'],
      ['Information sharing', 'THA does not sell personal information. Information is shared only with authorised service providers or partners when necessary to deliver a requested service, comply with the law, or protect people and the organisation.'],
      ['Your choices', 'You may request access, correction, or deletion of information you submitted by contacting THA. Some records may be retained when required for security, legal, or programme-accountability purposes.'],
    ],
  },
  cookies: {
    title: 'Cookies Policy',
    intro: 'How this website uses essential browser storage and similar technologies.',
    sections: [
      ['Essential storage', 'The website may use essential cookies or browser storage to maintain secure administrator sessions, remember necessary preferences, and protect forms.'],
      ['Analytics', 'If audience measurement is enabled, it should be configured to collect only the information needed to understand website performance and improve public information.'],
      ['Your control', 'You can remove or block cookies through your browser settings. Blocking essential storage may prevent secure areas of the website from working correctly.'],
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    intro: 'Conditions for using Tanzania Health Alliance’s public website and information.',
    sections: [
      ['Health information', 'Website content is provided for education and public awareness. It does not replace diagnosis, treatment, or advice from a qualified health professional. Seek urgent medical help when needed.'],
      ['Acceptable use', 'Do not misuse the website, attempt unauthorised access, interfere with its operation, or submit unlawful, harmful, or misleading material.'],
      ['Content and links', 'THA works to keep information accurate and current. External links are provided for context and remain the responsibility of their respective publishers.'],
      ['Updates', 'These terms may be updated when website services or legal requirements change. The current version will remain available on this page.'],
    ],
  },
};

export default function LegalPolicy({ type }) {
  const policy = policies[type] || policies.privacy;

  return (
    <div className="bg-cool-gray pt-14 md:pt-16">
      <SEO title={policy.title} description={policy.intro} canonicalPath={`/${type}`} />
      <section className="bg-gradient-to-br from-primary to-primary-dark py-16 text-white md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-bold md:text-5xl">{policy.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">{policy.intro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="space-y-5">
          {policy.sections.map(([heading, text]) => (
            <article key={heading} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary">{heading}</h2>
              <p className="mt-3 leading-relaxed text-gray-700">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-primary/5 p-6 text-center">
          <p className="text-gray-700">Questions about this policy?</p>
          <Link to="/contact" className="mt-3 inline-flex rounded-lg bg-primary px-5 py-2.5 font-semibold text-white hover:bg-primary-dark">
            Contact Tanzania Health Alliance
          </Link>
        </div>
      </section>
    </div>
  );
}
