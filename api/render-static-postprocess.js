const path = require('path');
const { applyComplianceLayer } = require('./compliance-layer');

const REPO_OWNER = 'Steph-972';
const REPO_NAME = 'marches-publics-martinique';
const PUBLIC_BASE = process.env.SITE_BASE || 'https://marches-publics-martinique.vercel.app';

const ALLOWED_FILES = new Set([
  'insights.html',
  'accompagnement-appel-offres-martinique.html',
  'conseil-acheteur-public-martinique.html'
]);

function safeFile(value) {
  const file = path.basename(String(value || '').trim());
  return ALLOWED_FILES.has(file) ? file : null;
}

function safeRef(value) {
  const ref = String(value || '').trim();
  return /^[A-Za-z0-9._\/-]+$/.test(ref) ? ref : 'main';
}

function normalizeStaticPage(html, file) {
  let out = String(html || '')
    .replace(/https:\/\/procurement-insider\.fr/g, PUBLIC_BASE)
    .replace(/https:\/\/procurement-insider-git-main-procurement-insiders-projects\.vercel\.app/g, PUBLIC_BASE)
    .replace(/https:\/\/procurement-insider-[a-z0-9-]+-procurement-insiders-projects\.vercel\.app/g, PUBLIC_BASE)
    .replace(/<nav(?=[\s>])(?![^>]*id=)/i, '<nav id="navbar"')
    .replace(/<\/head>/i, '<style id="pi-static-polish">.nav-links{gap:clamp(.9rem,1.35vw,1.55rem)!important}.nav-links a{font-size:clamp(.76rem,.8vw,.84rem)!important}.nav-cta{white-space:nowrap!important}.hero,.cta{background:#0F2342!important}.hero h1 em{color:#C9A84C!important}footer{background:#07172D!important}@media(max-width:900px){.nav-links{display:none!important}}</style></head>');

  out = out.replace(/(<ul class="nav-links">)([\s\S]*?)(<\/ul>)/i, function(match, open, body, close) {
    if (!body.includes('/formation-marches-publics-martinique')) {
      body = body.replace(/(<li><a href="\/services"[^>]*>Services<\/a><\/li>)/i, '$1<li><a href="/formation-marches-publics-martinique">Formation</a></li>');
    }
    if (!body.includes('/a-propos') && file === 'insights.html') {
      body = body.replace(/(<li><a[^>]*href="\/outils-gratuits"[\s\S]*?<\/li>)/i, '$1<li><a href="/a-propos">À propos</a></li>');
    }
    return open + body + close;
  });

  out = out.replace(/(<div class="mobile-menu"[^>]*>)([\s\S]*?)(<\/div>)/i, function(match, open, body, close) {
    if (!body.includes('/formation-marches-publics-martinique')) body += '<a href="/formation-marches-publics-martinique">Formation</a>';
    if (!body.includes('/a-propos')) body += '<a href="/a-propos">À propos</a>';
    return open + body + close;
  });

  return applyComplianceLayer(out);
}

module.exports = async function handler(req, res) {
  const file = safeFile(req.query.file);
  if (!file) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Page introuvable');
    return;
  }

  try {
    const ref = safeRef(process.env.VERCEL_GIT_COMMIT_REF || 'main');
    const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${encodeURIComponent(ref)}/${file}`;
    const source = await fetch(rawUrl, { headers: { 'User-Agent': 'Procurement-Insider-static-renderer/1.0' } });
    if (!source.ok) throw new Error(`Unable to fetch ${file}: ${source.status}`);

    const html = normalizeStaticPage(await source.text(), file);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.end(html);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`Erreur de rendu statique: ${error.message}`);
  }
};
