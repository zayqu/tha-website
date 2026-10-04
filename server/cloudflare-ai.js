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

module.exports = { generateCloudflareDraft };
