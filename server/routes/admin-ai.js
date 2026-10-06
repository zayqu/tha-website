const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { generateAdminAssistance } = require('../cloudflare-ai');

const router = express.Router();

router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const section = String(req.body?.section || '').trim().slice(0, 120);
    const action = String(req.body?.action || 'improve').trim().slice(0, 40);
    const instruction = String(req.body?.instruction || '').trim().slice(0, 3000);
    const current = req.body?.current && typeof req.body.current === 'object' ? req.body.current : {};
    const fields = Array.isArray(req.body?.fields) ? req.body.fields.slice(0, 40) : [];

    if (!section) return res.status(400).json({ error: 'Section is required.' });
    if (!fields.length) return res.status(400).json({ error: 'At least one editable field is required.' });

    const result = await generateAdminAssistance({
      section,
      action,
      instruction,
      current,
      fields,
    });

    res.json(result);
  } catch (err) {
    if (err.code === 'AI_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'AI drafting is not configured. Continue manually.', code: err.code });
    }
    if (err.code === 'AI_FREE_LIMIT_REACHED') {
      return res.status(503).json({ error: 'The free AI allowance is temporarily exhausted. Continue manually or try again later.', code: err.code });
    }
    if (err.code === 'AI_TEMPORARILY_UNAVAILABLE' || err.code === 'AI_INVALID_RESPONSE') {
      return res.status(502).json({ error: 'The AI assistant is temporarily unavailable. Continue manually.', code: err.code });
    }
    next(err);
  }
});

module.exports = router;
