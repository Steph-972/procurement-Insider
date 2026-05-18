const path = require('path');

const REPO_OWNER = 'Steph-972';
const REPO_NAME = 'marches-publics-martinique';
const CANONICAL_BASE = 'https://procurement-insider.fr';

const ALLOWED_FILES = new Set([
  'mentions-legales.html',
  'conditions-generales-prestations-services.html',
  'politique-confidentialite.html',
  'politique-cookies.html',
  'deontologie.html',
  'a-propos.html',
  'formation-marches-publics-martinique.html'
]);

function safeFile(value) {
  const file = path.basename(String(value || '').trim());
  return ALLOWED_FILES.has(file) ? file : null;
}

function safeRef(value) {
  const ref = String(value || '').trim();
  return /^[A-Za-z0-9._\/-]+$/.test(ref) ? ref : 'main';
}

function normalizeTechnicalDomains(html) {
  return String(html || '')
    .replace(/https:\/\/marches-publics-martinique\.vercel\.app/g, CANONICAL_BASE)
    .replace(/https:\/\/procurement-insider-git-main-procurement-insiders-projects\.vercel\.app/g, CANONICAL_BASE)
    .replace(/https:\/\/procurement-insider-[a-z0-9-]+-procurement-insiders-projects\.vercel\.app/g, CANONICAL_BASE);
}

function legalFooter() {
  return `<footer class="pi-legal-footer"><div><strong>Procurement Insider</strong><p>Conseil opérationnel en commande publique. Obligation de moyens. Aucune promesse d’attribution.</p></div><nav><strong>Juridique</strong><a href="/mentions-legales">Mentions légales</a><a href="/conditions-generales-prestations-services">CGPS</a><a href="/politique-confidentialite">Politique de confidentialité</a><a href="/politique-cookies">Politique cookies</a><a href="/deontologie">Charte de déontologie</a><a href="/politique-cookies#preferences">Gérer mes préférences cookies</a></nav><nav><strong>Contact</strong><a href="mailto:loeildelacheteur@gmail.com">loeildelacheteur@gmail.com</a><a href="tel:+596696266231">+596 696 26 62 31</a></nav></footer>`;
}

function shellMinimalLegalPage(html, file) {
  const input = String(html || '');
  if (input.includes('legal-card') || input.includes('class="doc"')) return input;
  if (!['politique-confidentialite.html', 'politique-cookies.html', 'deontologie.html'].includes(file)) return input;

  const title = (input.match(/<title>([\s\S]*?)<\/title>/i) || [null, 'Procurement Insider'])[1];
  const body = (input.match(/<body[^>]*>([\s\S]*?)<\/body>/i) || [null, input])[1];
  const route = file.replace('.html', '');
  const cleanTitle = title.replace(/\s*\|\s*Procurement Insider\s*$/i, '');

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title><meta name="description" content="${cleanTitle} de Procurement Insider."><link rel="canonical" href="${CANONICAL_BASE}/${route}"><style>:root{--navy:#0f1f33;--gold:#c9a45c;--ink:#17202c;--muted:#5f6877;--bg:#f7f5f0;--card:#fff;--border:#e6e0d5}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--ink);line-height:1.72}a{color:var(--navy);text-decoration:none}a:hover{color:var(--gold)}.top{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:10}.nav{max-width:1180px;margin:auto;padding:16px 24px;display:flex;justify-content:space-between;gap:20px;align-items:center}.brand{font-weight:850;color:var(--navy);letter-spacing:-.02em}.brand span{display:block;font-size:.78rem;color:var(--muted);font-weight:500}.links{display:flex;gap:16px;flex-wrap:wrap;font-size:.92rem;font-weight:650}.hero{background:linear-gradient(135deg,#0f1f33,#183657);color:#fff;padding:70px 24px}.hero-inner{max-width:960px;margin:auto}.eyebrow{color:var(--gold);font-weight:800;text-transform:uppercase;letter-spacing:.1em;font-size:.78rem}h1{font-size:clamp(2.1rem,4vw,3.8rem);line-height:1.08;margin:12px 0 14px;letter-spacing:-.04em}.wrap{max-width:960px;margin:auto;padding:46px 24px 80px}.doc{background:#fff;border:1px solid var(--border);border-radius:24px;padding:clamp(24px,4vw,46px);box-shadow:0 18px 40px rgba(15,31,51,.06)}.doc h1{display:none}.doc h2{color:var(--navy);font-size:1.35rem;margin:38px 0 12px}.doc p,.doc li{font-size:.98rem}.doc ul{padding-left:1.2rem}.doc button{background:var(--navy);color:#fff;border:0;border-radius:999px;padding:.8rem 1.2rem;font-weight:700;cursor:pointer}.pi-legal-footer{background:var(--navy);color:rgba(255,255,255,.75);padding:38px 24px;display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:26px}.pi-legal-footer strong{color:#fff}.pi-legal-footer a{display:block;color:rgba(255,255,255,.75);margin:.35rem 0}.pi-legal-footer a:hover{color:var(--gold)}@media(max-width:780px){.nav{align-items:flex-start;flex-direction:column}.pi-legal-footer{grid-template-columns:1fr}}@media print{.top,.pi-legal-footer{display:none}.wrap{padding:0}.doc{box-shadow:none;border:none}}</style></head><body><header class="top"><div class="nav"><a class="brand" href="/">Procurement Insider<span>L'Œil de l'Acheteur</span></a><nav class="links"><a href="/services">Services</a><a href="/insights">Insights</a><a href="/outils-gratuits">Outils gratuits</a><a href="/mentions-legales">Mentions légales</a><a href="/#contact">Contact</a></nav></div></header><section class="hero"><div class="hero-inner"><div class="eyebrow">Juridique</div><h1>${cleanTitle}</h1></div></section><main class="wrap"><article class="doc">${body}<p><a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;" style="display:inline-block;margin-top:28px;font-weight:750;color:#c9a45c">Retour en haut ↑</a></p></article></main>${legalFooter()}</body></html>`;
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
    const source = await fetch(rawUrl, { headers: { 'User-Agent': 'Procurement-Insider-source-renderer/1.0' } });
    if (!source.ok) throw new Error(`Unable to fetch ${file} from GitHub raw: ${source.status}`);

    const html = shellMinimalLegalPage(normalizeTechnicalDomains(await source.text()), file);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.end(html);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`Erreur de rendu de la page source: ${error.message}`);
  }
};
