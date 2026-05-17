const baseRenderer = require('./render-page.js');

const SITE_URL = 'https://marches-publics-martinique.vercel.app';

const ROUTE_BY_FILE = {
  'index.html': '/',
  'services.html': '/services',
  'entreprises-privees.html': '/entreprises-privees',
  'entites-publiques.html': '/entites-publiques',
  'faq.html': '/faq',
  'mentions-legales.html': '/mentions-legales',
  'outils-gratuits.html': '/outils-gratuits',
  'grille-mapa.html': '/grille-mapa'
};

const FOUNDER_HERO = "Dix années au cœur de la commande publique m'ont donné une lecture que peu de prestataires possèdent : comprendre ce qu'un acheteur attend réellement au moment d'analyser une offre. Aujourd'hui, je transforme cette expérience terrain en méthode claire pour aider les entreprises à mieux répondre et les entités publiques à acheter plus juste.";
const GUARANTEE_HERO = "Je m'engage sur la qualité de mes conseils et de mes méthodes. Jamais sur l'attribution d'un marché — c'est une décision qui appartient exclusivement à l'acheteur public.";

function canonicalFor(file) {
  const route = ROUTE_BY_FILE[file] || '/';
  return route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`;
}

function jsonLdFor(file) {
  const canonical = canonicalFor(file);
  return JSON.stringify([
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Procurement Insider',
      alternateName: "L’Œil de l’Acheteur",
      url: SITE_URL,
      description: 'Conseil en marchés publics, commande publique et achat en Martinique et aux Antilles françaises.',
      founder: { '@type': 'Person', name: 'Stéphane Loudoux' },
      email: 'loeildelacheteur@gmail.com',
      telephone: '+596696266231',
      areaServed: ['Martinique', 'Guadeloupe', 'Guyane', 'Antilles françaises'],
      serviceType: ['Conseil marchés publics', 'Rédaction DCE CCTP', 'Accompagnement réponse appel d offres', 'Formation marchés publics']
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: canonical,
      isPartOf: { '@type': 'WebSite', name: 'Procurement Insider', url: SITE_URL },
      inLanguage: 'fr-FR'
    }
  ]);
}

function hardenHtml(html, file) {
  if (typeof html !== 'string' || !html.includes('<html')) return html;

  const hardeningCss = `
<style id="agency-hardening">
#splash{display:none!important;visibility:hidden!important;pointer-events:none!important}
body.splash-active #nav,
body.splash-active #navbar,
body.splash-active #hero,
body.splash-active #cookie-banner,
body.splash-active section{visibility:visible!important}
.btn-cookie-refuse{display:none!important}
#cookie-banner{justify-content:space-between}
#cookie-banner .cookie-btns{flex:0 0 auto}

/* Hero : retour au style éditorial du screen 1, sans carte lourde */
.hero-content{max-width:690px!important}
.hero-title-refined{max-width:620px!important;font-size:clamp(2.45rem,5.35vw,4.75rem)!important;line-height:1.045!important;margin-bottom:1.45rem!important;letter-spacing:-.025em!important}
.hero-title-refined span,.hero-title-refined em{display:block!important}
.hero-title-refined span{color:#fff!important;max-width:560px!important}
.hero-title-refined em{color:var(--gold,#C9A84C)!important;font-style:italic!important;font-size:.93em!important;line-height:1.06!important;margin-top:.18rem!important;max-width:610px!important}
.hero-subtitle-agency{max-width:560px!important;margin:0 0 1.45rem!important;color:rgba(255,255,255,.72)!important;font-size:clamp(.98rem,1.25vw,1.12rem)!important;font-weight:300!important;line-height:1.82!important}
.hero-guarantee-line{max-width:520px!important;margin:1.15rem 0 0!important;font-family:var(--mono,monospace)!important;font-size:.72rem!important;line-height:1.68!important;letter-spacing:.035em!important;color:rgba(255,255,255,.46)!important}
.hero-keywords{display:flex!important;flex-wrap:wrap!important;gap:.55rem!important;margin:0 0 1.75rem!important;max-width:620px!important}
.hero-keywords span{display:inline-flex!important;align-items:center!important;gap:.35rem!important;background:rgba(255,255,255,.10)!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:20px!important;padding:.3rem .82rem!important;font-family:var(--mono,monospace)!important;font-size:.66rem!important;letter-spacing:.055em!important;color:rgba(255,255,255,.82)!important;text-transform:none!important;white-space:nowrap!important}
.hero-keywords strong{color:var(--gold,#C9A84C)!important;font-weight:700!important}

/* Sections de transition : centrage contrôlé des titres et sous-titres */
.agency-paths>.container>.agency-kicker,
.agency-ba>.container>.agency-kicker{display:block!important;text-align:center!important;margin-left:auto!important;margin-right:auto!important}
.agency-paths>.container>.agency-title,
.agency-ba>.container>.agency-title{text-align:center!important;margin-left:auto!important;margin-right:auto!important;max-width:760px!important}
.agency-paths>.container>.agency-muted{text-align:center!important;margin-left:auto!important;margin-right:auto!important;max-width:720px!important}
.agency-path-grid,.agency-ba-grid{text-align:left!important}
@media(max-width:560px){
  .hero-title-refined{font-size:clamp(2.35rem,12vw,3.15rem)!important;max-width:100%!important}
  .hero-title-refined em{max-width:100%!important}
  .hero-keywords span{font-size:.62rem!important;padding:.28rem .68rem!important}
}
</style>`;

  html = html
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '')
    .replace(/<button class="btn-cookie-refuse"[\s\S]*?<\/button>/i, '')
    .replace(/\s*<!-- DÉONTOLOGIE & INDÉPENDANCE -->\s*<section id="deontologie"[\s\S]*?<\/section>\s*(?=<!-- CAS PRATIQUES -->)/i, '')
    .replace(/<h1 class="display hero-title">Votre offre est solide\.<br><em>Encore faut-il<br>qu(?:’|')un acheteur public la voie\.<\/em><\/h1>/i,
      '<h1 class="display hero-title hero-title-refined"><span>Votre offre est solide.</span><em>Rendons-la lisible<br>pour l’acheteur public.</em></h1>')
    .replace(/\s*<div class="founder-statement founder-statement-hero"><p>Dix années au cœur de la commande publique[\s\S]*?acheter plus juste\.<\/p><\/div>/i,
      `\n      <p class="lead hero-subtitle hero-subtitle-agency">${FOUNDER_HERO}</p>`)
    .replace(/\s*<blockquote class="founder-statement founder-statement-hero founder-statement-compact"><p>« Je m'engage sur la qualité de mes conseils et de mes méthodes\. Jamais sur l'attribution d'un marché — c'est une décision qui appartient exclusivement à l'acheteur public\. »<\/p><\/blockquote>/i,
      `\n      <p class="hero-guarantee-line">${GUARANTEE_HERO}</p>`)
    .replace(/\s*<div style="display:flex;flex-wrap:wrap;gap:\.6rem;margin-bottom:1\.75rem">\s*<span[^>]*><strong[^>]*>52\+<\/strong>[\s\S]*?<\/div>/i,
      '\n      <div class="hero-keywords"><span><strong>10 ans</strong> terrain achat public</span><span>Lecture RC</span><span>Critères de notation</span><span>Mémoire technique</span><span>DCE / CCTP</span><span>MAPA</span></div>')
    .replace(/93%<\/strong>&nbsp;satisfaction/g, '93%</strong>&nbsp;retours')
    .replace(/\s*<span style="display:inline-flex;align-items:center;gap:\.4rem;background:rgba\(255,255,255,\.1\);border:1px solid rgba\(255,255,255,\.18\);border-radius:20px;padding:\.3rem \.85rem;font-family:var\(--mono\);font-size:\.68rem;letter-spacing:\.05em;color:rgba\(255,255,255,\.82\)"><strong style="color:var\(--gold\)">2<\/strong>&nbsp;cibles<\/span>/g, '')
    .replace(/\s*<span style="display:inline-flex;align-items:center;gap:\.4rem;background:rgba\(255,255,255,\.1\);border:1px solid rgba\(255,255,255,\.18\);border-radius:20px;padding:\.3rem \.85rem;font-family:var\(--mono\);font-size:\.68rem;letter-spacing:\.05em;color:rgba\(255,255,255,\.82\)"><strong style="color:var\(--gold\)">3<\/strong>&nbsp;territoires<\/span>/g, '')
    .replace(/<h4>J'ai décidé des attributions<\/h4>\s*<p>J'ai noté vos offres, comparé vos prix, validé vos références\. Je sais pourquoi un dossier gagne — et pourquoi un autre, techniquement meilleur, perd\. Cette lecture est unique\.<\/p>/g,
      '<h4>Je connais la mécanique d’analyse</h4><p>Critères, pondération, cohérence prix/technique, preuves attendues : je vous aide à rendre votre dossier plus lisible et plus défendable, sans jamais promettre l’attribution.</p>')
    .replace(/Deux mois plus tard, nous décrochions un marché de 280&nbsp;000&nbsp;€ avec une collectivité avec laquelle nous n'avions jamais travaillé\./g,
      'Le dossier a gagné en clarté, en preuves et en cohérence. Résultat : une réponse nettement plus professionnelle et mieux alignée sur les attentes de l’acheteur.')
    .replace(/<strong class="about-temoignage-name">M\. C\.<\/strong>/g, '<strong class="about-temoignage-name">Cas client anonymisé</strong>')
    .replace(/required id="message"><\/textarea>/g, 'required></textarea>')
    .replace(/Stéphane Loudoux<\/strong>\s*—\s*Responsable Achat &amp; March(?:é|\\u00e9)s Publics, ODYSSI(?:\s*–|\s*\\u2013)\s*R(?:é|\\u00e9)gie des Eaux de la CACEM/gi,
      'Stéphane Loudoux</strong> — Fondateur Procurement Insider')
    .replace(/Stéphane Loudoux<\/strong>\s*—\s*Fondateur Procurement Insider<\/p>'/g,
      "Stéphane Loudoux</strong> — Fondateur Procurement Insider</p>'")
    .replace(/<p style="margin-top:\.5rem">Fort-de-France, Martinique[\s\S]*?<\/p>/g,
      '<p style="margin-top:.5rem">Martinique · loeildelacheteur@gmail.com</p>')
    .replace(/Fort-de-France, Martinique/g, 'Martinique');

  html = html.replace('</head>', `<script type="application/ld+json">${jsonLdFor(file)}</script>\n${hardeningCss}\n</head>`);
  return html;
}

module.exports = async function handler(req, res) {
  const chunks = [];
  const originalWrite = res.write ? res.write.bind(res) : null;
  const originalEnd = res.end.bind(res);

  if (originalWrite) {
    res.write = function patchedWrite(chunk, encoding, callback) {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), encoding || 'utf8'));
      if (typeof callback === 'function') callback();
      return true;
    };
  }

  res.end = function patchedEnd(chunk, encoding, callback) {
    if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), encoding || 'utf8'));
    const body = Buffer.concat(chunks).toString('utf8');
    const file = req.query && req.query.file;
    const contentType = String(res.getHeader('Content-Type') || res.getHeader('content-type') || '');
    const output = contentType.includes('text/html') || body.trim().startsWith('<!DOCTYPE html') || body.trim().startsWith('<html')
      ? hardenHtml(body, file)
      : body;
    return originalEnd(output, 'utf8', callback);
  };

  return baseRenderer(req, res);
};
