const fs = require('fs');
const path = require('path');

function generateSitemap() {
  console.log('Generating dynamic sitemap...');
  const toolsFilePath = path.join(__dirname, '../src/data/tools.ts');
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

  if (!fs.existsSync(toolsFilePath)) {
    console.error('tools.ts not found at', toolsFilePath);
    return;
  }

  const content = fs.readFileSync(toolsFilePath, 'utf8');

  // Regex to match path values: path: '/...'
  const pathRegex = /path:\s*['"]([^'"]+)['"]/g;
  const paths = new Set();

  // Standard pages
  paths.add('/');
  paths.add('/about');
  paths.add('/privacy');
  paths.add('/terms');
  paths.add('/contact');
  paths.add('/sitemap');

  let match;
  while ((match = pathRegex.exec(content)) !== null) {
    const p = match[1];
    // Normalize path to remove duplicate slashes and trailing slashes
    let cleanPath = p.trim().replace(/\/$/, '');
    if (cleanPath && cleanPath !== '/') {
      paths.add(cleanPath);
    }
  }

  const sortedPaths = Array.from(paths).sort();
  const domain = 'https://toolgenichub.com';

  const sitemapEntries = sortedPaths.map(p => {
    const url = p === '/' ? domain : `${domain}${p}/`;
    return `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === '/' ? '1.0' : p.split('/').length > 2 ? '0.8' : '0.9'}</priority>
  </url>`;
  }).join('\n');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');
  console.log(`Successfully generated sitemap.xml with ${sortedPaths.length} URLs!`);
}

generateSitemap();
