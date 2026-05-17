const baseRenderer = require('./render-page-v3.js');

function refineNavigationAndTools(html) {
  if (typeof html !== 'string' || !html.includes('<html')) return html;

  const css = `
<style id="nav-tools-free-access-fix">
.nav-links{gap:clamp(1rem,1.55vw,2rem)!important}
.nav-links a{font-size:clamp(.78rem,.82vw,.875rem)!important}
@media(max-width:1050px){.nav-links{gap:.85rem!important}.nav-links a{font-size:.76rem!important}.nav-cta{padding:.45rem .85rem!important}}
</style>`;

  html = html
    // Navigation desktop accueil : insertion Outils gratuits entre Insights et Contact.
    .replace(/(<li><a href="#insights">Insights<\/a><\/li>\s*)(<li><a href="#contact">Contact<\/a><\/li>)/g,
      '$1<li><a href="/outils-gratuits">Outils gratuits</a></li>\n        $2')
    // Navigation desktop pages secondaires éventuelles.
    .replace(/(<li><a href="\/#insights">Insights<\/a><\/li>\s*)(<li><a href="\/#contact">Contact<\/a><\/li>)/g,
      '$1<li><a href="/outils-gratuits">Outils gratuits</a></li>\n        $2')
    // Menu mobile accueil.
    .replace(/(<a href="#insights" onclick="toggleMenu\(\)">Insights<\/a>\s*)(<a href="#contact" onclick="toggleMenu\(\)">Contact<\/a>)/g,
      '$1<a href="/outils-gratuits" onclick="toggleMenu()">Outils gratuits</a>\n  $2')
    // Menu mobile pages secondaires éventuelles.
    .replace(/(<a href="\/#insights" onclick="toggleMenu\(\)">Insights<\/a>\s*)(<a href="\/#contact" onclick="toggleMenu\(\)">Contact<\/a>)/g,
      '$1<a href="/outils-gratuits" onclick="toggleMenu()">Outils gratuits</a>\n  $2')
    // Évite les doublons éventuels si une page source contenait déjà Outils gratuits.
    .replace(/(<li><a href="\/outils-gratuits">Outils gratuits<\/a><\/li>\s*){2,}/g,
      '<li><a href="/outils-gratuits">Outils gratuits</a></li>\n        ')
    .replace(/(<a href="\/outils-gratuits" onclick="toggleMenu\(\)">Outils gratuits<\/a>\s*){2,}/g,
      '<a href="/outils-gratuits" onclick="toggleMenu()">Outils gratuits</a>\n  ')

    // Page outils gratuits : cohérence accès libre / inscription optionnelle.
    .replace(/Voir la grille PDF/g, 'Consulter la grille')
    .replace(/Accès immédiat après inscription/g, 'Accès libre immédiat')
    .replace(/Recevoir la grille par email/g, 'Recevoir aussi la grille par email')
    .replace(/Accès immédiat par email \+ lien vers la version PDF imprimable\./g,
      'Inscription optionnelle : recevez le lien PDF et les futures ressources utiles par email.')
    .replace(/Recevoir la grille gratuite/g, 'Recevoir la grille par email')
    .replace(/La grille vient de vous être envoyée par email\./g,
      'La grille vient de vous être envoyée par email. Vous pouvez aussi y accéder librement depuis cette page.');

  return html.includes('nav-tools-free-access-fix')
    ? html
    : html.replace('</head>', `${css}\n</head>`);
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
    const contentType = String(res.getHeader('Content-Type') || res.getHeader('content-type') || '');
    const output = contentType.includes('text/html') || body.trim().startsWith('<!DOCTYPE html') || body.trim().startsWith('<html')
      ? refineNavigationAndTools(body)
      : body;
    return originalEnd(output, 'utf8', callback);
  };

  return baseRenderer(req, res);
};
