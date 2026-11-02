const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();
const file = path.join(__dirname, '../data/events.json');
const hasDb = !!process.env.DATABASE_URL;
let pool, ready;
if (hasDb) {
  const { Pool } = require('pg');
  pool = new Pool({ connectionString: process.env.DATABASE_URL.replace(/([?&]sslmode=)(prefer|require|verify-ca)(?=&|$)/i, '$1verify-full'), connectionTimeoutMillis: 5000, query_timeout: 10000 });
}
async function init() {
  if (!pool) return;
  if (!ready) ready = pool.query(`CREATE TABLE IF NOT EXISTS tha_events (id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, content JSONB NOT NULL, updated_at BIGINT NOT NULL)`).catch(err => { ready = null; throw err; });
  await ready;
}
function local() {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (err) { if (err.code === 'ENOENT') return []; throw err; }
}
async function all() {
  if (!pool) return local();
  await init();
  const { rows } = await pool.query('SELECT content FROM tha_events ORDER BY updated_at DESC');
  return rows.map(r => r.content);
}
async function save(item) {
  if (pool) {
    await init();
    await pool.query('INSERT INTO tha_events (id,slug,content,updated_at) VALUES ($1,$2,$3::jsonb,$4) ON CONFLICT (id) DO UPDATE SET slug=$2,content=$3::jsonb,updated_at=$4', [item.id,item.slug,JSON.stringify(item),Date.now()]);
  } else {
    const items = local().filter(x => x.id !== item.id);
    items.push(item);
    fs.mkdirSync(path.dirname(file), { recursive:true });
    const tmp = file + '.' + process.pid + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(items,null,2), { mode:0o600 });
    fs.renameSync(tmp,file);
  }
}
function status(e, now=Date.now()) {
  if (e.cancelled) return 'cancelled';
  if (now >= Date.parse(e.endAt)) return 'completed';
  if (!e.registrationUrl || e.registrationClosed || now >= Date.parse(e.startAt) || (e.registrationClosesAt && now >= Date.parse(e.registrationClosesAt))) return 'registration_closed';
  if (e.registrationOpensAt && now < Date.parse(e.registrationOpensAt)) return 'upcoming';
  return 'registration_open';
}
function publicEvent(e) { return { ...e, status:status(e), registrationUrl: status(e)==='registration_open' ? e.registrationUrl : null }; }
function validate(input) {
  const text = k => typeof input[k] === 'string' ? input[k].trim() : '';
  const title=text('title'), slug=text('slug'), startAt=text('startAt'), endAt=text('endAt');
  if (!title || title.length>180 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw Error('Valid title and URL slug required');
  if (!Number.isFinite(Date.parse(startAt)) || !Number.isFinite(Date.parse(endAt)) || Date.parse(endAt)<=Date.parse(startAt)) throw Error('Valid event start and end dates required');
  for (const field of ['registrationOpensAt','registrationClosesAt']) if (text(field) && !Number.isFinite(Date.parse(text(field)))) throw Error('Invalid '+field);
  if (text('registrationOpensAt') && text('registrationClosesAt') && Date.parse(text('registrationOpensAt'))>=Date.parse(text('registrationClosesAt'))) throw Error('Registration opening must precede closing');
  for (const field of ['registrationUrl','imageUrl']) {
    if (text(field)) {
      const url = new URL(text(field));
      if (url.protocol !== 'https:') throw Error(field+' must use HTTPS');
    }
  }
  return { title,slug,startAt,endAt,registrationOpensAt:text('registrationOpensAt'),registrationClosesAt:text('registrationClosesAt'),registrationUrl:text('registrationUrl'),imageUrl:text('imageUrl'),location:text('location').slice(0,250),description:text('description').slice(0,10000),organizers:text('organizers').slice(0,500),fee:text('fee').slice(0,100),feeOptions:Array.isArray(input.feeOptions)?input.feeOptions.slice(0,12).map(o=>({label:String(o?.label||'').trim().slice(0,80),price:String(o?.price||'').trim().slice(0,80)})).filter(o=>o.label&&o.price):[],newsUrl:text('newsUrl'),published:input.published===true,registrationClosed:input.registrationClosed===true,cancelled:input.cancelled===true };
}
router.get('/', async (_req,res,next)=> { try { res.json({events:(await all()).filter(e=>e.published).map(publicEvent).sort((a,b)=>Date.parse(b.startAt)-Date.parse(a.startAt))}); } catch(e){next(e);} });
router.get('/admin',requireAuth,async (_req,res,next)=>{try{res.json({events:(await all()).map(e=>({...e,status:status(e)}))});}catch(e){next(e);}});
router.get('/:slug',async (req,res,next)=>{try {const event=(await all()).find(e=>e.slug===req.params.slug&&e.published);if(!event)return res.status(404).json({error:'Event not found'});res.json({event:publicEvent(event)});}catch(e){next(e);}});
router.post('/',requireAuth,async(req,res,next)=>{try{const data=validate(req.body);if((await all()).some(e=>e.slug===data.slug))return res.status(409).json({error:'URL slug already exists'});const event={...data,id:crypto.randomUUID(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};await save(event);res.status(201).json({event:publicEvent(event)});}catch(e){if(e instanceof TypeError||e.message?.includes('required')||e.message?.includes('Invalid')||e.message?.includes('must'))return res.status(400).json({error:e.message});next(e);}});
router.put('/:id',requireAuth,async(req,res,next)=>{try{const items=await all(),previous=items.find(e=>e.id===req.params.id);if(!previous)return res.status(404).json({error:'Event not found'});const data=validate(req.body);if(items.some(e=>e.slug===data.slug&&e.id!==previous.id))return res.status(409).json({error:'URL slug already exists'});const event={...previous,...data,updatedAt:new Date().toISOString()};await save(event);res.json({event:publicEvent(event)});}catch(e){if(e instanceof TypeError||e.message?.includes('required')||e.message?.includes('Invalid')||e.message?.includes('must'))return res.status(400).json({error:e.message});next(e);}});
module.exports=router;
