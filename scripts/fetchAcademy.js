const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const ACADEMY_FILE = path.join(__dirname, '../src/data/academy.json');
const KEYWORDS = ['hepatitis', 'HIV', 'mental health', 'Tanzania', 'Africa', 'guidelines', 'training'];

// Simple fetch using native https
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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

async function fetchWHO() {
  try {
    // WHO API endpoint for publications (simplified)
    const url = 'https://www.who.int/api/news/release.json?categories=AFRO&page=1&per_page=10';
    const data = await fetchJSON(url);
    
    return data.results?.map(item => ({
      title: item.title,
      excerpt: item.excerpt || item.summary || '',
      url: item.url,
      source: 'WHO',
      sourceFavicon: 'https://www.who.int/favicon.ico',
      category: categorizeContent(item.title + ' ' + (item.excerpt || '')),
      date: item.date || new Date().toISOString(),
      tags: extractTags(item.title + ' ' + (item.excerpt || ''))
    })) || [];
  } catch (error) {
    console.error('WHO fetch error:', error.message);
    return [];
  }
}

function categorizeContent(text) {
  const lower = text.toLowerCase();
  if (lower.includes('guideline') || lower.includes('recommendation')) return 'WHO Guidelines';
  if (lower.includes('training') || lower.includes('course') || lower.includes('learning')) return 'Training Materials';
  if (lower.includes('policy') || lower.includes('strategy') || lower.includes('framework')) return 'Policy Documents';
  return 'Research Papers';
}

function extractTags(text) {
  const lower = text.toLowerCase();
  return KEYWORDS.filter(k => lower.includes(k.toLowerCase()));
}

async function main() {
  console.log('Fetching academy resources...');
  
  // Fetch from multiple sources
  const [whoData] = await Promise.all([
    fetchWHO(),
    // Add more sources here (CDC, World Hepatitis Alliance, etc.)
  ]);
  
  // Combine and deduplicate
  const existingData = fs.existsSync(ACADEMY_FILE) 
    ? JSON.parse(fs.readFileSync(ACADEMY_FILE, 'utf8'))
    : [];
  
  const newData = [...whoData, ...existingData];
  
  // Remove duplicates based on URL
  const uniqueData = Array.from(new Map(newData.map(item => [item.url, item])).values());
  
  // Sort by date (newest first)
  uniqueData.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Keep only last 100 items
  const finalData = uniqueData.slice(0, 100);
  
  // Write to file
  fs.writeFileSync(ACADEMY_FILE, JSON.stringify(finalData, null, 2));
  console.log(`Updated academy.json with ${finalData.length} resources`);
}

main().catch(console.error);