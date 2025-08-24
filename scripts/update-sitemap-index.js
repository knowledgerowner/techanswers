#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script pour mettre à jour le sitemap_index.xml avec les vraies dates
 * Ce script peut être exécuté manuellement ou via un cron job
 */

function updateSitemapIndex() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techanswers.fr';
  const currentDate = new Date().toISOString();
  
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/categories/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/articles/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap_index.xml');
  
  try {
    fs.writeFileSync(sitemapPath, sitemapIndex, 'utf8');
    console.log(`✅ [SITEMAP] sitemap_index.xml mis à jour: ${currentDate}`);
  } catch (error) {
    console.error('❌ [SITEMAP] Erreur lors de la mise à jour:', error);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  updateSitemapIndex();
}

module.exports = { updateSitemapIndex }; 