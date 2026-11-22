import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ACTIONS = [
  ['draft', 'Draft'],
  ['improve', 'Improve'],
  ['humanize', 'Make human'],
  ['shorten', 'Shorten'],
];

export default function AdminAiAssist({
  section,
  current = {},
  fields = [],
  onApply,
  defaultInstruction = '',
  className = '',
}) {
  const { authFetch } = useAuth();
  const [action, setAction] = useState('improve');
  const [instruction, setInstruction] = useState(defaultInstruction);
  const [suggestions, setSuggestions] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    setLoading(true);
    setError('');
    setSuggestions([]);
    setNote('');
    try {
      const res = await authFetch('/api/admin-ai/generate', {
        method: 'POST',
        body: JSON.stringify({
          section,
          action,
          instruction,
          current,
          fields,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI assistant unavailable.');
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      setNote(data.note || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function apply() {
    if (!suggestions.length) return;
    onApply?.(suggestions);
    setNote('Suggestions applied. Review the fields, then save when ready.');
  }

  return (
    <section className={`rounded-2xl border border-primary/15 bg-primary/[0.03] p-4 sm:p-5 ${className}`}>
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/60">AI Assist</p>
        <h3 className="mt-1 text-lg font-bold text-primary">Help with this section</h3>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">
          AI suggests edits only. Nothing is saved or published until you review and save it yourself.
        </p>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ACTIONS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setAction(value)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold transition ${action === value ? 'bg-primary text-white' : 'border border-gray-200 bg-white text-gray-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <textarea
        value={instruction}
        onChange={e => setInstruction(e.target.value)}
        rows={3}
        placeholder="Optional: tell AI what you want. Example: make this clearer and less corporate, keep all facts exactly as written."
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-[16px] text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
      />

      <button
        type="button"
        onClick={generate}
        disabled={loading || !fields.length}
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-50 sm:w-auto"
      >
        {loading ? 'Preparing suggestions…' : 'Generate suggestions'}
      </button>

      {error ? <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {suggestions.length ? (
        <div className="mt-5 space-y-3">
          <p className="text-sm font-bold text-gray-800">Suggested changes</p>
          {suggestions.map(item => {
            const field = fields.find(f => f.key === item.field);
            return (
              <div key={item.field} className="rounded-xl border border-gray-200 bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{field?.label || item.field}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{item.value}</p>
              </div>
            );
          })}
          <button
            type="button"
            onClick={apply}
            className="w-full rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white transition hover:bg-secondary-dark sm:w-auto"
          >
            Apply suggestions
          </button>
        </div>
      ) : null}

      {note ? <p className="mt-3 text-xs leading-relaxed text-gray-500">{note}</p> : null}
    </section>
  );
}
