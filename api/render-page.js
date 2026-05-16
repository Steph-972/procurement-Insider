const path = require('path');

const REPO_OWNER = 'Steph-972';
const REPO_NAME = 'marches-publics-martinique';

const ALLOWED_FILES = new Set([
  'index.html',
  'services.html',
  'entreprises-privees.html',
  'entites-publiques.html',
  'faq.html',
  'mentions-legales.html',
  'outils-gratuits.html',
  'grille-mapa.html'
]);

const HOTFIX_CSS = `
<style id="display-hotfix-secondary-pages">
/* Correctif d'affichage transversal pour pages secondaires.
   Objectif : éviter que les règles du header touchent les navigations internes
   et stabiliser les images éditoriales sur desktop/mobile. */
html, body {
  max-width: 100%;
  overflow-x: hidden;
}
body > nav#navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
footer nav,
footer nav[style],
footer .footer-nav,
footer [class*="footer"] nav {
  position: static !important;
  inset: auto !important;
  top: auto !important;
  left: auto !important;
  right: auto !important;
  bottom: auto !important;
  z-index: auto !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
footer nav {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: flex-start !important;
  justify-content: flex-start !important;
}
footer .footer-grid {
  grid-template-columns: minmax(260px, 1.1fr) minmax(0, 2fr) !important;
  align-items: start !important;
}
footer .footer-links-matrix {
  display: grid;
  grid-template-columns: repeat(3, minmax(150px, 1fr));
  gap: 2rem clamp(1.5rem, 4vw, 3rem);
}
footer .footer-links-matrix h4 {
  font-family: var(--mono, monospace);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: var(--gold, #C9A84C);
  text-transform: uppercase;
  margin-bottom: 1rem;
}
footer .footer-links-matrix ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
}
footer .footer-links-matrix li {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.55);
}
footer .footer-links-matrix a {
  color: rgba(255,255,255,0.55);
  transition: color var(--transition, 0.25s ease);
}
footer .footer-links-matrix a:hover {
  color: var(--gold, #C9A84C);
}
img {
  max-width: 100%;
  height: auto;
}
.page-hero + div img,
.page-hero-img img,
.page-hero-img-inner img {
  width: 100%;
  max-height: 340px;
  object-fit: cover;
  display: block;
}
.mobile-menu {
  z-index: 9999 !important;
}
@media (max-width: 900px) {
  footer .footer-grid {
    grid-template-columns: 1fr !important;
  }
  footer .footer-links-matrix {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }
}
@media (max-width: 768px) {
  .page-hero + div,
  .page-hero-img {
    margin-top: 0 !important;
  }
  .page-hero + div img,
  .page-hero-img img,
  .page-hero-img-inner img {
    max-height: 260px;
  }
  footer nav {
    flex-direction: column !important;
    gap: 1.5rem !important;
  }
}
@media (max-width: 560px) {
  footer .footer-links-matrix {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }
}
</style>`;

function safeFile(value) {
  const raw = String(value || '').trim();
  const normalized = path.basename(raw);
  return ALLOWED_FILES.has(normalized) ? normalized : null;
}

function safeRef(value) {
  const raw = String(value || '').trim();
  return /^[A-Za-z0-9._\/-]+$/.test(raw) ? raw : 'main';
}

function normalizeHeaderNav(html) {
  if (html.includes('id="navbar"') || html.includes("id='navbar'")) {
    return html;
  }

  return html.replace(/<nav(?=[\s>])/i, '<nav id="navbar"');
}

function removeAccueilNavLink(html, file) {
  // Sur les pages secondaires, le retour accueil doit rester porté par le logo / lien retour,
  // sans bouton texte Accueil dans la navigation principale ni dans le menu mobile.
  if (file === 'index.html') return html;

  return html
    .replace(/\s*<li>\s*<a\s+href=["']\/["']>Accueil<\/a>\s*<\/li>/gi, '')
    .replace(/\s*<a\s+href=["']\/["']\s+onclick=["']toggleMenu\(\)["']>Accueil<\/a>/gi, '')
    .replace(/\s*<a\s+href=["']\/["']>Accueil<\/a>/gi, '');
}

function normalizeFounderSignature(html, file) {
  // La FAQ conserve volontairement les mentions détaillées demandées par le client.
  if (file === 'faq.html') return html;

  return html
    .replace(/Stéphane Loudoux<br>\s*Responsable Achat & MP, ODYSSI<br>\s*Fondateur Procurement Insider/gi,
      'Stéphane Loudoux<br>\n      Fondateur Procurement Insider')
    .replace(/Stéphane Loudoux<br>\s*Responsable Achat &amp; MP, ODYSSI<br>\s*Fondateur Procurement Insider/gi,
      'Stéphane Loudoux<br>\n      Fondateur Procurement Insider')
    .replace(/<div class="brand-footer">Stéphane Loudoux — Procurement Insider \| L'Œil de l'Acheteur<\/div>\s*Responsable Achat & Marchés Publics, ODYSSI – Régie des Eaux de la CACEM · Fondateur Procurement Insider<br>/gi,
      '<div class="brand-footer">Stéphane Loudoux<br>Fondateur Procurement Insider</div>')
    .replace(/<div class="brand-footer">Stéphane Loudoux — Procurement Insider \| L'Œil de l'Acheteur<\/div>\s*Responsable Achat &amp; Marchés Publics, ODYSSI – Régie des Eaux de la CACEM · Fondateur Procurement Insider<br>/gi,
      '<div class="brand-footer">Stéphane Loudoux<br>Fondateur Procurement Insider</div>');
}

function normalizeHomePageTexts(html, file) {
  if (file !== 'index.html') return html;

  return html
    .replace(
      /Je ne promets jamais l'attribution d'un marché\. J'aide à construire le meilleur dossier possible, conforme aux règles et aligné sur les attentes de l'acheteur\./g,
      "« Je m'engage sur la qualité de mes conseils et de mes méthodes. Jamais sur l'attribution d'un marché — c'est une décision qui appartient exclusivement à l'acheteur public. »"
    )
    .replace(
      /Pendant 10 ans, j'ai piloté des procédures d'achats publics au sein d'entités martiniquaises — de la définition du besoin jusqu'à la notification du marché\. Des centaines de DCE rédigés, des procédures formalisées et des MAPA conduits, des offres analysées, des attributions décidées\./g,
      "Pendant 10 ans, j'ai exercé au cœur de la commande publique en Martinique, de la définition du besoin jusqu'à la notification des marchés. DCE, CCTP, procédures formalisées, MAPA, analyse des offres : cette pratique m'a donné une lecture concrète de ce qu'un acheteur attend vraiment d'un dossier."
    )
    .replace(
      /Un jour, j'ai changé de côté\. Pas pour tourner le dos à la commande publique, mais pour en démocratiser l'accès\. Trop d'entreprises locales perdent des marchés non pas parce qu'elles ne sont pas compétentes, mais parce qu'elles ne savent pas comment valoriser cette compétence face à un acheteur public\. J'ai créé <strong>Procurement Insider<\/strong> pour ça\./g,
      "J'ai créé <strong>Procurement Insider</strong> pour rendre cette lecture terrain plus accessible. Trop d'entreprises locales perdent des opportunités non pas par manque de compétence, mais parce que leur dossier ne valorise pas suffisamment leurs moyens, leurs références et leur méthodologie face aux attentes de l'acheteur public."
    );
}

function normalizeFooterColumns(html) {
  const footerLinks = `
      <div class="footer-links-matrix" aria-label="Liens de bas de page">
        <div>
          <h4>Navigation</h4>
          <ul>
            <li><a href="#about">À propos</a></li>
            <li><a href="#cas-pratiques">Cas pratiques</a></li>
            <li><a href="/outils-gratuits">Outils gratuits</a></li>
            <li><a href="#methode">Méthode</a></li>
            <li><a href="#deontologie">Déontologie</a></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li><a href="/services">Tous les services</a></li>
            <li><a href="#services">Rédaction DCE / CCTP</a></li>
            <li><a href="#services">Accompagnement réponse AO</a></li>
            <li><a href="#services">Formation marchés publics</a></li>
          </ul>
        </div>
        <div>
          <h4>Accompagnements</h4>
          <ul>
            <li><a href="#services">Veille & conseil mensuel</a></li>
            <li><a href="#services">Ateliers collectifs</a></li>
            <li><a href="#contact">Diagnostic gratuit</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>
      </div>`;

  return html.replace(
    /\s*<div class="footer-col">\s*<h4>Services<\/h4>\s*<ul>\s*<li><a href="#about">À propos<\/a><\/li>\s*<li><a href="#cas-pratiques">Cas pratiques<\/a><\/li>\s*<li><a href="\/outils-gratuits">Outils gratuits<\/a><\/li>\s*<li><a href="#methode">Méthode<\/a><\/li>\s*<li><a href="#deontologie">Déontologie<\/a><\/li>\s*<li><a href="\/services">Tous les services<\/a><\/li>\s*<li><a href="#services">Rédaction DCE \/ CCTP<\/a><\/li>\s*<li><a href="#services">Accompagnement réponse AO<\/a><\/li>\s*<li><a href="#services">Formation marchés publics<\/a><\/li>\s*<li><a href="#services">Veille & conseil mensuel<\/a><\/li>\s*<li><a href="#services">Ateliers collectifs<\/a><\/li>\s*<\/ul>\s*<\/div>/gi,
    `\n${footerLinks}`
  );
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
    const source = await fetch(rawUrl, {
      headers: { 'User-Agent': 'Procurement-Insider-renderer/1.0' }
    });

    if (!source.ok) {
      throw new Error(`Unable to fetch ${file} from GitHub raw: ${source.status}`);
    }

    let html = await source.text();

    // Normalise la navigation principale : certaines pages utilisaient <nav> sans id,
    // ce qui rendait les correctifs CSS et JS moins fiables.
    html = normalizeHeaderNav(html);

    // Harmonise la navigation des pages secondaires : pas de bouton texte Accueil.
    html = removeAccueilNavLink(html, file);

    // Harmonise la signature publique hors FAQ.
    html = normalizeFounderSignature(html, file);

    // Harmonise les textes stratégiques de l'accueil.
    html = normalizeHomePageTexts(html, file);

    // Réorganise le footer en colonnes lisibles.
    html = normalizeFooterColumns(html);

    // Sécurise aussi le JS sur les pages où document.querySelector('nav') existe.
    html = html
      .replace(/const nav = document\.querySelector\('nav'\);/g, "const nav = document.getElementById('navbar');")
      .replace(/window\.addEventListener\('scroll', \(\) => nav\.classList\.toggle\('scrolled', window\.scrollY > 60\), \{passive:true\}\);/g,
        "if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), {passive:true});");

    if (!html.includes('display-hotfix-secondary-pages')) {
      html = html.includes('</head>')
        ? html.replace('</head>', `${HOTFIX_CSS}\n</head>`)
        : `${HOTFIX_CSS}\n${html}`;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.end(html);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(`Erreur de rendu de la page: ${error.message}`);
  }
};
