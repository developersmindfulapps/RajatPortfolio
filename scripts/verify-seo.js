const fs = require('fs');
const path = require('path');

function checkFile(name, filePath) {
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    console.log('\n=============================================');
    console.log(name);
    console.log('=============================================');
    
    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
    console.log('Title:         ', titleMatch ? titleMatch[1] : 'NONE');
    
    // Extract description
    const descMatch = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/);
    console.log('Description:   ', descMatch ? descMatch[1] : 'NONE');

    // Extract canonical
    const canonMatch = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/) || html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/);
    console.log('Canonical:     ', canonMatch ? canonMatch[1] : 'NONE');

    // Extract robots
    const robotsMatch = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/);
    console.log('Robots Meta:   ', robotsMatch ? robotsMatch[1] : 'NONE (defaults to index, follow)');

    // Extract H1
    const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)).map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
    console.log('H1 Tags Count: ', h1Matches.length);
    console.log('H1 Content:    ', h1Matches);

    // Check JSON-LD
    const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    console.log('JSON-LD Count: ', jsonLdMatches ? jsonLdMatches.length : 0);

    // Check OG Tags
    const ogTitle = html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/);
    const ogUrl = html.match(/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/);
    console.log('OG Title:      ', ogTitle ? ogTitle[1] : 'NONE');
    console.log('OG URL:        ', ogUrl ? ogUrl[1] : 'NONE');
  } else {
    console.log('\n[FILE NOT FOUND]:', filePath);
  }
}

checkFile('HOMEPAGE (/)', path.join('.next', 'server', 'app', 'index.html'));
checkFile('EXPERIENCE (/experience)', path.join('.next', 'server', 'app', 'experience.html'));
checkFile('CASE STUDY (/case-study)', path.join('.next', 'server', 'app', 'case-study.html'));
checkFile('PROJECT: BAT CAVE (/projects/bat-cave)', path.join('.next', 'server', 'app', 'projects', 'bat-cave.html'));
checkFile('PROJECT: LAW PRACTICE (/projects/law-practice)', path.join('.next', 'server', 'app', 'projects', 'law-practice.html'));
checkFile('PROJECT: EVENTUALLY (/projects/eventually)', path.join('.next', 'server', 'app', 'projects', 'eventually.html'));
checkFile('RECOMMENDATIONS PLACEHOLDER (/recommendations)', path.join('.next', 'server', 'app', 'recommendations.html'));

// Sitemap
const sitemapPath = path.join('.next', 'server', 'app', 'sitemap.xml.body');
if (fs.existsSync(sitemapPath)) {
  console.log('\n=============================================');
  console.log('SITEMAP.XML CONTENT:');
  console.log('=============================================');
  console.log(fs.readFileSync(sitemapPath, 'utf8'));
}

// Robots
const robotsPath = path.join('.next', 'server', 'app', 'robots.txt.body');
if (fs.existsSync(robotsPath)) {
  console.log('\n=============================================');
  console.log('ROBOTS.TXT CONTENT:');
  console.log('=============================================');
  console.log(fs.readFileSync(robotsPath, 'utf8'));
}
