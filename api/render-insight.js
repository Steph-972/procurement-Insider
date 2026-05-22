const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://marches-publics-martinique.vercel.app';
const SLUGS = {
  'seuils-marches-publics-2026-pouvoirs-entites': 'seuils-marches-publics-2026',
  'trois-devis-commune-tilly-sur-seulles': 'jur-3-devis-2026',
  'criteres-sociaux-rse-commande-publique': 'jur-criteres-sociaux-rse-2026',
  'mapa-martinique-erreurs-avant-depot': 'mapa-erreurs-martinique-2026',
  'memoire-technique-criteres': 'memoire-technique-criteres-2026',
  'prix-anormalement-bas': 'prix-anormalement-bas-2026',
  'dce-cctp-incoherences': 'dce-cctp-incoherences-2026'
};

function esc(value) {
  return String(value || '').replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]));
}

function logo() {
  return `<svg viewBox="0 0 310 52" xmlns="http://www.w3.org/2000/svg" style="height:32px;width:auto"><rect x="0" y="4" width="5" height="44" rx="2.5" fill="#C9A84C"/><text x="13" y="32" font-family="Arial Black,Arial,sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" letter-spacing="0.8">PROCUREMENT INSIDER</text><rect x="13" y="37" width="291" height="1" fill="#C9A84C"/><text x="13" y="48" font-family="Arial,sans-serif" font-size="7.5" fill="#C9A84C" letter-spacing="3">L'ŒIL DE L'ACHETEUR</text></svg>`;
}

module.exports = function handler(req, res) {
  const slug = String(req.query.slug || '').replace(/[^a-z0-9-]/gi, '');
  const id = SLUGS[slug];
  const articlesPath = path.join(process.cwd(), 'articles.json');
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
  const article = articles.find(a => a.id === id && a.published);

  if (!article) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end('<!doctype html><meta charset="utf-8"><title>Article introuvable</title><p>Article introuvable.</p>');
  }

  const url = `${BASE_URL}/insights/${slug}`;
  const description = esc(article.excerpt).slice(0, 160);
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || '',
    author: { '@type': 'Person', name: article.auteur || 'Stéphane Loudoux', url: `${BASE_URL}/a-propos` },
    publisher: {
      '@type': 'Organization',
      name: 'Procurement Insider',
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/img/logo.png`
      }
    },
    datePublished: article.date || '2026-05-01',
    dateModified: article.date || '2026-05-21',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url: url
  });

  // CTA contextuel selon la catégorie de l'article
  const ctaMap = {
    'Acheteur public': {
      title: 'Vous préparez une consultation ou un DCE ?',
      text: 'Un regard externe sur vos pièces avant publication peut éviter bien des contentieux. Le diagnostic est gratuit et sans engagement.',
      btn: 'Faire relire mon DCE →'
    },
    'Jurisprudence': {
      title: 'Cette décision concerne votre procédure ?',
      text: 'Chaque jurisprudence a des conséquences pratiques différentes selon votre contexte. Discutons de ce que ça change pour vous.',
      btn: 'Analyser mon cas →'
    },
    'Méthode': {
      title: 'Vous avez un mémoire à structurer ?',
      text: 'La méthode change tout. Procurement Insider peut relire votre réponse et identifier ce qui peut être renforcé avant dépôt.',
      btn: 'Renforcer mon mémoire →'
    },
    'Stratégie': {
      title: 'Vous construisez votre offre prix ?',
      text: 'Un prix solide, c\'est un prix cohérent avec votre méthode. Procurement Insider peut valider votre logique avant dépôt.',
      btn: 'Valider ma stratégie prix →'
    },
    'Astuce terrain': {
      title: 'Vous avez un dossier en cours ?',
      text: 'Ces erreurs sont évitables avec une relecture experte avant dépôt. Le diagnostic de 30 minutes suffit souvent à identifier les points critiques.',
      btn: 'Vérifier mon dossier →'
    },
    'Décryptage': {
      title: 'Vous êtes concerné par ces évolutions réglementaires ?',
      text: 'Procurement Insider vous aide à lire ce que ces changements impliquent concrètement pour vos procédures ou vos offres.',
      btn: 'Décrypter mon contexte →'
    }
  };
  const cta = ctaMap[article.category] || {
    title: 'Besoin d\'une analyse sur votre dossier ?',
    text: 'Procurement Insider peut vous aider à qualifier le risque, structurer votre procédure ou renforcer votre réponse.',
    btn: 'Demander un diagnostic gratuit →'
  };

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.end(`<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="index, follow"><meta name="description" content="${description}"><title>${esc(article.title)} | Procurement Insider</title><link rel="canonical" href="${url}"><meta property="og:type" content="article"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(article.title)}"><meta property="og:description" content="${description}"><meta property="og:image" content="${BASE_URL}/img/collaboration-pro.jpg"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${jsonLd}</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"><style>:root{--navy:#0F2342;--gold:#C9A84C;--cream:#F8F5EF;--gray:#6B7080;--line:#E8EBF0;--serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif;--mono:'DM Mono',monospace}*{box-sizing:border-box}body{margin:0;font-family:var(--sans);color:#1C1C2E;background:var(--cream);line-height:1.75}.container{max-width:1180px;margin:0 auto;padding:0 clamp(1.25rem,5vw,3rem)}.article-wrap{max-width:900px;margin:0 auto;padding:0 clamp(1.25rem,5vw,3rem)}a{text-decoration:none;color:inherit}nav{position:fixed;top:0;left:0;right:0;z-index:1000;padding:1.2rem 0;background:rgba(15,35,66,0.97);backdrop-filter:blur(12px);box-shadow:0 2px 20px rgba(0,0,0,.2)}.nav-inner{display:flex;align-items:center;justify-content:space-between}.nav-links{list-style:none;display:flex;align-items:center;gap:2rem}.nav-links a{font-size:.875rem;font-weight:500;color:rgba(255,255,255,.85);transition:color .2s;text-decoration:none}.nav-links a:hover,.nav-links a.active{color:#C9A84C}.nav-cta{background:#C9A84C;color:#0F2342!important;padding:.5rem 1.25rem;border-radius:4px;font-weight:700!important}.nav-cta:hover{background:#E8C96A!important}.hamb{display:none;background:none;border:0;color:white;font-size:1.8rem;cursor:pointer}.mobile-menu{display:none;position:fixed;inset:0;background:#0F2342;z-index:2000;padding:5rem 2rem;flex-direction:column;align-items:center;gap:1.4rem}.mobile-menu.open{display:flex}.mobile-menu a{color:white;font-family:'Playfair Display',Georgia,serif;font-size:1.3rem;text-decoration:none}.close-btn{position:absolute;right:1.5rem;top:1.25rem;background:none;border:0;color:white;font-size:1.8rem;cursor:pointer}@media(max-width:768px){.nav-links{display:none}.hamb{display:block}}.hero{background:var(--navy);color:white;padding:4.5rem 0 3.5rem}.cat{display:inline-block;background:rgba(201,168,76,.14);color:var(--gold);border:1px solid rgba(201,168,76,.35);border-radius:999px;padding:.4rem 1rem;font-family:var(--mono);font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;margin-bottom:1rem}.hero h1{font-family:var(--serif);font-size:clamp(2rem,5vw,3.2rem);line-height:1.12;margin:.5rem 0 1rem}.meta{color:rgba(255,255,255,.68);font-family:var(--mono);font-size:.78rem}.article{background:white;margin:-2rem auto 4rem;border:1px solid var(--line);border-radius:12px;padding:clamp(1.5rem,4vw,3rem);box-shadow:0 18px 55px rgba(15,35,66,.1)}.article h2{font-family:var(--serif);color:var(--navy)}.article p{font-size:1rem}.article a:not(.btn){color:var(--gold);font-weight:700}.cta{background:var(--navy);color:white;border-radius:10px;padding:1.5rem;margin-top:2rem}.cta p{color:rgba(255,255,255,.72)}.btn{display:inline-flex;background:var(--gold);color:var(--navy);padding:.8rem 1.3rem;border-radius:4px;font-weight:800;margin-top:.5rem}footer{text-align:center;color:var(--gray);padding:2rem;font-size:.82rem}.btn-pdf{display:inline-flex;align-items:center;gap:.5rem;background:white;color:var(--navy);border:2px solid var(--navy);padding:.65rem 1.25rem;border-radius:4px;font-weight:700;font-size:.85rem;cursor:pointer;font-family:var(--sans);transition:.2s}.btn-pdf:hover{background:var(--navy);color:white}@media print{nav,footer,.cta,.btn-pdf{display:none!important}.article{box-shadow:none!important;border:none!important;margin:0!important;padding:1rem!important}.hero{padding:2rem 0 1rem!important}body{background:white!important}}</style></head><body><nav><div class="container"><div class="nav-inner"><a href="/">${logo()}</a><ul class="nav-links"><li><a href="/services">Services</a></li><li><a href="/formation-marches-publics-martinique">Formation</a></li><li><a href="/insights" class="active">Insights</a></li><li><a href="/outils-gratuits">Outils gratuits</a></li><li><a href="/#contact" class="nav-cta">Diagnostic gratuit</a></li></ul><button class="hamb" onclick="toggleMenu()">☰</button></div></div></nav><div class="mobile-menu" id="mobile-menu"><button class="close-btn" onclick="toggleMenu()">×</button><a href="/services" onclick="toggleMenu()">Services</a><a href="/formation-marches-publics-martinique" onclick="toggleMenu()">Formation</a><a href="/insights" onclick="toggleMenu()">Insights</a><a href="/outils-gratuits" onclick="toggleMenu()">Outils gratuits</a><a href="/#contact" onclick="toggleMenu()">Diagnostic gratuit</a></div><header class="hero" style="padding-top:7rem"><div class="article-wrap"><span class="cat">${esc(article.category)}</span><h1>${esc(article.title)}</h1><div class="meta" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem">${esc(article.dateLabel)} · ${esc(article.lecture)} · ${esc(article.auteur)}<button class="btn-pdf" onclick="window.print()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Garder cette analyse</button></div></div></header><main class="article-wrap"><article class="article">${article.content}<div class="cta"><strong>${cta.title}</strong><p>${cta.text}</p><a class="btn" href="/#contact">${cta.btn}</a></div></article></main><footer>© 2026 Stéphane Loudoux — Procurement Insider · <a href="/mentions-legales">Mentions légales</a></footer><script>function toggleMenu(){document.getElementById('mobile-menu').classList.toggle('open')}</script></body></html>`);
};
