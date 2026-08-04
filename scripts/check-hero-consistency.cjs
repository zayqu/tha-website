#!/usr/bin/env node
/**
 * Hero section consistency check.
 *
 * Enforces the site-wide hero pattern established in August 2026:
 * every page hero is a <section> with the standard
 * `bg-gradient-to-br from-primary to-primary-dark` gradient, containing
 * exactly one <h1> and at most one subtext <p> — nothing else (no eyebrow
 * labels, no tagline pills, no embedded inputs). Home.jsx is the sole,
 * explicit exception: it's the only primary-conversion landing hero and
 * keeps its CTA buttons.
 *
 * This exists because that exact pattern drifted twice in production
 * (a `to-primary-light` typo on two pages, and eyebrow/pill/search-bar
 * elements creeping into four hero sections) before anyone noticed via
 * screenshots. This script turns "someone happens to notice" into
 * "the PR fails to build."
 *
 * Run: node scripts/check-hero-consistency.js
 * Exits non-zero (and prints exactly what's wrong and where) on violation.
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages');

// Files intentionally exempt from the strict header+subtext-only rule, and why.
const EXEMPTIONS = {
  'Home.jsx': 'primary landing hero — keeps CTA buttons alongside header + subtext',
};

// Files with no hero section at all (utility/detail pages, admin, etc.) — skipped silently.
const SKIP = new Set(['NewsDetail.jsx']);

function getClassName(openingElement) {
  const attr = openingElement.attributes.find(
    a => a.type === 'JSXAttribute' && a.name?.name === 'className'
  );
  if (!attr || !attr.value) return '';
  if (attr.value.type === 'StringLiteral') return attr.value.value;
  if (attr.value.type === 'JSXExpressionContainer') {
    // Template literals / expressions: best-effort stringify for pattern matching.
    try { return require('@babel/generator').default(attr.value.expression).code; }
    catch { return ''; }
  }
  return '';
}

function isHeroSection(node) {
  if (node.type !== 'JSXElement') return false;
  const name = node.openingElement.name?.name;
  if (name !== 'section') return false;
  const cls = getClassName(node.openingElement);
  return cls.includes('from-primary') && (cls.includes('to-primary-dark') || cls.includes('to-primary-light'));
}

function findFirstHero(ast) {
  let hero = null;
  traverse(ast, {
    JSXElement(nodePath) {
      if (hero) return; // only the first hero in the file
      if (isHeroSection(nodePath.node)) {
        hero = nodePath.node;
        nodePath.stop();
      }
    },
  });
  return hero;
}

function collectDescendants(heroNode) {
  const elements = [];
  // Manual walk since we already have the isolated subtree.
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'JSXElement') {
      elements.push(node);
      node.children.forEach(walk);
    } else if (node.type === 'JSXFragment') {
      node.children.forEach(walk);
    } else if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node.type === 'JSXExpressionContainer' && node.expression) {
      walk(node.expression);
    } else if (node.body) {
      walk(node.body);
    } else if (node.consequent) {
      walk(node.consequent);
      if (node.alternate) walk(node.alternate);
    }
  }
  heroNode.children.forEach(walk);
  return elements;
}

function checkFile(filename) {
  const filePath = path.join(PAGES_DIR, filename);
  const code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  } catch (err) {
    return [`Could not parse ${filename}: ${err.message}`];
  }

  const hero = findFirstHero(ast);
  if (!hero) return []; // no hero section in this file — nothing to check

  const heroClass = getClassName(hero.openingElement);
  const violations = [];

  if (heroClass.includes('to-primary-light')) {
    violations.push(
      `uses 'to-primary-light' instead of the standard 'to-primary-dark' gradient`
    );
  }

  if (EXEMPTIONS[filename]) return violations; // gradient check still applies even to exempt files

  const descendants = collectDescendants(hero);
  const tagCounts = {};
  for (const el of descendants) {
    const tag = el.openingElement.name?.name;
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  }

  const h1Count = tagCounts.h1 || 0;
  if (h1Count !== 1) {
    violations.push(`has ${h1Count} <h1> elements in its hero (expected exactly 1)`);
  }

  const pCount = tagCounts.p || 0;
  if (pCount > 1) {
    violations.push(`has ${pCount} <p> elements in its hero (expected at most 1 subtext paragraph)`);
  }

  if (tagCounts.input) {
    violations.push(`has an <input> inside its hero (move it to a section below the hero instead)`);
  }

  for (const el of descendants) {
    const cls = getClassName(el.openingElement);
    const tag = el.openingElement.name?.name;
    if (tag === 'h1' || tag === 'p') continue;

    const looksLikeEyebrow = /uppercase/.test(cls) && /tracking-(wide|widest|\[)/.test(cls);
    if (looksLikeEyebrow) {
      violations.push(`has an eyebrow/kicker label in its hero (className: "${cls.slice(0, 60)}…")`);
    }

    const looksLikePill = /rounded-full/.test(cls) && /backdrop-blur/.test(cls);
    if (looksLikePill) {
      violations.push(`has a pill/badge element in its hero (className: "${cls.slice(0, 60)}…")`);
    }

    if (tag === 'button' || (tag === 'Link' && /rounded-(xl|full)/.test(cls) && /px-\d/.test(cls))) {
      violations.push(
        `has a CTA button/link in its hero — only Home.jsx is allowed CTA buttons in its hero`
      );
    }
  }

  return violations;
}

function main() {
  const files = fs.readdirSync(PAGES_DIR).filter(f => f.endsWith('.jsx') && !SKIP.has(f));
  let failed = false;

  for (const file of files) {
    const violations = checkFile(file);
    if (violations.length > 0) {
      failed = true;
      console.error(`\n✗ ${file}`);
      violations.forEach(v => console.error(`  - ${v}`));
    }
  }

  if (failed) {
    console.error(
      '\nHero sections must match the site-wide pattern: header + at most one subtext ' +
      'paragraph, using the standard bg-gradient-to-br from-primary to-primary-dark gradient. ' +
      'No eyebrow labels, tagline pills, or embedded inputs in the hero band. ' +
      'If this page genuinely needs an exception, add it to EXEMPTIONS in ' +
      'scripts/check-hero-consistency.cjs with a one-line reason.\n'
    );
    process.exit(1);
  }

  console.log(`✓ Hero consistency check passed (${files.length} page files checked).`);
}

main();
