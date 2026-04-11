/**
 * Creates the initial superadmin account.
 * Run once from the server/ directory:
 *
 *   ADMIN_IDENTIFIER=admin@tzhealthalliance.or.tz \
 *   ADMIN_PASSWORD=YourStrongPassword123! \
 *   ADMIN_NAME="THA Admin" \
 *   node seed.js
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { admins } = require('./db');

async function seed() {
  const identifier = process.env.ADMIN_IDENTIFIER;
  const password   = process.env.ADMIN_PASSWORD;
  const name       = process.env.ADMIN_NAME || 'THA Admin';

  if (!identifier || !password) {
    console.error('Usage: ADMIN_IDENTIFIER=... ADMIN_PASSWORD=... node seed.js');
    process.exit(1);
  }

  if (password.length < 12) {
    console.error('Password must be at least 12 characters.');
    process.exit(1);
  }

  const normalized = identifier.includes('@') ? identifier.toLowerCase() : identifier;

  if (admins.exists(normalized)) {
    console.log(`Admin "${normalized}" already exists. Skipping.`);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 12);
  const id = uuidv4();

  admins.create({ id, identifier: normalized, password: hash, name, role: 'superadmin' });

  console.log('Superadmin created:');
  console.log(`  ID:    ${id}`);
  console.log(`  Login: ${normalized}`);
  console.log(`  Name:  ${name}`);
  console.log('\nDelete this output – do not log credentials in production.');
}

seed().catch(err => { console.error(err); process.exit(1); });
