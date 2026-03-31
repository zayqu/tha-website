import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get current directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get secrets from environment variables
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const TABLE_NAME = 'News';

// Where to save the news data
const OUTPUT_FILE = path.join(__dirname, '../src/data/news.json');

// Build the Airtable API URL
const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${TABLE_NAME}?view=Grid%20view`;

function fetchAirtableData() {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function transformRecord(record) {
  const fields = record.fields;
  
  // Handle image - get URL from attachment
  let imageUrl = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  if (fields['Featured Image'] && fields['Featured Image'].length > 0) {
    imageUrl = fields['Featured Image'][0].url;
  }

  // Create slug from title if not present
  let slug = fields.Slug;
  if (!slug && fields.Title) {
    slug = fields.Title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  return {
    id: record.id,
    title: fields.Title || 'Untitled',
    slug: slug,
    excerpt: fields.Content ? fields.Content.substring(0, 150) + '...' : '',
    content: fields.Content || '',
    category: fields.Category || 'Announcements',
    date: fields['Publish Date'] || new Date().toISOString(),
    image: imageUrl,
    author: fields.Author || 'THA Team',
    tags: []
  };
}

async function main() {
  try {
    console.log('🔄 Fetching news from Airtable...');
    
    if (!AIRTABLE_BASE_ID || !AIRTABLE_API_KEY) {
      console.log('⚠️  No Airtable credentials found, using sample data');
      process.exit(0);
    }
    
    const data = await fetchAirtableData();
    
    if (!data.records) {
      console.log('⚠️  No records found:', data);
      process.exit(0);
    }

    // Transform Airtable records to our format
    const news = data.records.map(transformRecord);
    
    // Sort by date (newest first)
    news.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Save to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(news, null, 2));
    console.log(`✅ Success! Updated ${news.length} news articles`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    // Don't fail the build if Airtable is down, keep existing data
    process.exit(0);
  }
}

main();