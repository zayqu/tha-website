import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DESTINATIONS = [
  ['news', 'News', '/api/news/import/editorial'],
  ['academy', 'Academy', '/api/site-content/academy/import'],
];

export function HealthDraftImport({ onImported, onAcademyImported }) {
  const { authFetch } = useAuth();
  const [input, setInput] = useState('');
  const [result, setResult] = useState([]);
  const [error, setError] = useState('');
  const [importing, setImporting] = useState(false);

  async function importDrafts() {
    setError('');
    setResult([]);
    let batch;
    try {
      batch = JSON.parse(input);
    } catch {
      setError('Paste the JSON from the THA editorial watch without its code fences.');
      return;
    }
    if (!batch || !DESTINATIONS.every(([key]) => Array.isArray(batch[key]) && batch[key].length <= 25)
      || !DESTINATIONS.some(([key]) => batch[key].length)) {
      setError('Include the news and academy lists, with 1 to 25 items in at least one list.');
      return;
    }

    setImporting(true);
    const outcomes = await Promise.allSettled(DESTINATIONS.filter(([key]) => batch[key].length)
      .map(async ([key, label, path]) => {
        const response = await authFetch(path, {
          method: 'POST',
          body: JSON.stringify({ items: batch[key] }),
        });
        if (!response.ok) throw new Error(`${label} import failed (HTTP ${response.status}).`);
        const data = await response.json();
        return { label, ...data };
      }));
    const completed = outcomes.flatMap(outcome => outcome.status === 'fulfilled' ? [outcome.value] : []);
    setResult(completed);
    if (completed.some(item => item.label === 'News' && item.imported)) onImported();
    if (completed.some(item => item.label === 'Academy' && item.imported)) onAcademyImported();
    if (outcomes.some(outcome => outcome.status === 'rejected')) {
      setError('Part of the batch could not be imported. You can safely retry the same batch.');
    } else if (!completed.some(item => item.invalid)) {
      setInput('');
    }
    setImporting(false);
  }

  return (
    <details className="mt-4 border-t border-gray-100 pt-3">
      <summary className="cursor-pointer text-sm font-semibold text-gray-800">Import health drafts</summary>
      <p className="mt-3 text-sm text-gray-600">Paste a JSON batch from the THA editorial watch to add it to the same draft queues.</p>
      <label htmlFor="health-drafts" className="mt-4 block text-sm font-semibold text-gray-700">Editorial batch JSON</label>
      <textarea
        id="health-drafts"
        value={input}
        onChange={event => setInput(event.target.value)}
        disabled={importing}
        rows={5}
        className="mt-2 w-full rounded-xl border border-gray-300 p-3 font-mono text-sm"
      />
      <button
        type="button"
        onClick={importDrafts}
        disabled={!input.trim() || importing}
        className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {importing ? 'Importing…' : 'Import as drafts'}
      </button>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      <div role="status" className="mt-2 text-sm text-gray-700">
        {result.map(item => (
          <p key={item.label}>{item.label} · {item.imported} imported · {item.duplicates} already present · {item.invalid} invalid</p>
        ))}
      </div>
    </details>
  );
}
