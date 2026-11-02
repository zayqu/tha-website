async function generateCloudflareDraft({ topic, purpose, facts, categories }) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiToken = process.env.CLOUDFLARE_WORKERS_AI_TOKEN?.trim();

  if (!accountId || !apiToken) {
    const error = new Error('AI drafting is not configured.');
    error.code = 'AI_NOT_CONFIGURED';
    throw error;
  }

  const instructions = [
    'You are the editorial assistant for Tanzania Health Alliance (THA).',
    'Create a professional, human, factual public-health news draft.',
    'Never invent names, dates, locations, statistics, quotes, partnerships, outcomes, or medical claims.',
    'Use only the supplied topic and verified facts.',
    'Use clear English for a general Tanzanian audience and short paragraphs.',
    'Write 5 to 8 useful paragraphs with no Markdown headings, hashtags, or promotional exaggeration.',
    'Choose an existing category when suitable; otherwise suggest one concise professional category.',
  ].join(' ');

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      title: { type: 'string', minLength: 10, maxLength: 200 },
      excerpt: { type: 'string', minLength: 30, maxLength: 500 },
      content: { type: 'string', minLength: 200, maxLength: 12000 },
      category: { type: 'string', minLength: 2, maxLength: 80 },
      tags: {
        type: 'array',
        minItems: 2,
        maxItems: 8,
        items: { type: 'string', minLength: 2, maxLength: 50 },
      },
    },
    required: ['title', 'excerpt', 'content', 'category', 'tags'],
  };

  const model = process.env.CLOUDFLARE_AI_MODEL || '@cf/meta/llama-3.1-8b-instruct';
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: instructions },
          {
            role: 'user',
            content: [
              `Topic: ${topic}`,
              `Story type: ${purpose || 'News update'}`,
              `Verified facts:\n${facts || 'No additional facts supplied.'}`,
              `Available categories: ${categories?.length ? categories.join(', ') : 'None supplied'}`,
            ].join('\n\n'),
          },
        ],
        response_format: { type: 'json_schema', json_schema: schema },
      }),
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const error = new Error('AI drafting unavailable');
    error.code = response.status === 429 ? 'AI_FREE_LIMIT_REACHED' : 'AI_TEMPORARILY_UNAVAILABLE';
    throw error;
  }

  const payload = data?.result?.response ?? data?.result;
  if (typeof payload === 'string') {
    try { return JSON.parse(payload); } catch {}
  }
  if (payload && typeof payload === 'object') return payload;

  const error = new Error('Invalid AI response');
  error.code = 'AI_INVALID_RESPONSE';
  throw error;
}

async function generateAdminAssistance({ section, action, instruction, current = {}, fields = [] }) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiToken = process.env.CLOUDFLARE_WORKERS_AI_TOKEN?.trim();

  if (!accountId || !apiToken) {
    const error = new Error('AI drafting is not configured.');
    error.code = 'AI_NOT_CONFIGURED';
    throw error;
  }

  const allowedFields = (fields || [])
    .map(field => ({
      key: String(field.key || '').trim(),
      label: String(field.label || field.key || '').trim(),
      type: String(field.type || 'text').trim(),
    }))
    .filter(field => field.key)
    .slice(0, 40);

  const currentText = allowedFields
    .map(field => `${field.key}: ${typeof current[field.key] === 'string' ? current[field.key] : JSON.stringify(current[field.key] ?? '')}`)
    .join('\n');

  const instructions = [
    'You are the shared editorial assistant for Tanzania Health Alliance (THA) administration.',
    'Your job is to help staff draft or refine editable website content.',
    'Write natural, human English suitable for a Tanzanian public-health NGO.',
    'Do not sound like marketing copy, a grant application, or generic AI prose.',
    'Never invent names, dates, locations, statistics, quotes, partnerships, awards, outcomes, legal facts, medical claims, or financial details.',
    'Preserve verified facts already present in the supplied content.',
    'For health content, do not diagnose or give individual medical advice.',
    'For policies, keep wording clear and cautious rather than pretending to be legal counsel.',
    'Return suggestions only for the allowed fields.',
    'If there is not enough factual information to safely fill a field, omit that field.',
  ].join(' ');

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      suggestions: {
        type: 'array',
        maxItems: 40,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            field: { type: 'string', minLength: 1, maxLength: 120 },
            value: { type: 'string', maxLength: 8000 },
          },
          required: ['field', 'value'],
        },
      },
      note: { type: 'string', maxLength: 500 },
    },
    required: ['suggestions', 'note'],
  };

  const model = process.env.CLOUDFLARE_AI_MODEL || '@cf/meta/llama-3.1-8b-instruct';
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/run/${model}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: instructions },
          {
            role: 'user',
            content: [
              `Admin section: ${section || 'Website content'}`,
              `Requested action: ${action || 'improve'}`,
              `Staff instruction: ${instruction || 'Improve the content while preserving facts.'}`,
              `Allowed fields: ${allowedFields.map(field => `${field.key} (${field.label}, ${field.type})`).join(', ')}`,
              `Current content:\n${currentText || 'No current content supplied.'}`,
            ].join('\n\n'),
          },
        ],
        response_format: { type: 'json_schema', json_schema: schema },
      }),
    }
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const error = new Error('AI drafting unavailable');
    error.code = response.status === 429 ? 'AI_FREE_LIMIT_REACHED' : 'AI_TEMPORARILY_UNAVAILABLE';
    throw error;
  }

  const payload = data?.result?.response ?? data?.result;
  let parsed = payload;
  if (typeof payload === 'string') {
    try { parsed = JSON.parse(payload); } catch { parsed = null; }
  }
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.suggestions)) {
    const error = new Error('Invalid AI response');
    error.code = 'AI_INVALID_RESPONSE';
    throw error;
  }

  const allowed = new Set(allowedFields.map(field => field.key));
  return {
    suggestions: parsed.suggestions
      .filter(item => allowed.has(String(item.field || '').trim()))
      .map(item => ({
        field: String(item.field || '').trim(),
        value: String(item.value ?? '').trim(),
      }))
      .filter(item => item.field && item.value),
    note: String(parsed.note || '').trim().slice(0, 500),
  };
}

module.exports = { generateCloudflareDraft, generateAdminAssistance };
